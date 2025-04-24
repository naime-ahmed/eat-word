import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setSignOutUser, setUser } from "../features/authSlice";
import { milestoneApi } from "./milestone";

const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/generative`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  if (
    result.error &&
    result.error.status === 401 &&
    result.error.data?.message === "Access token expired"
  ) {
    // Try to get a new token
    const refreshResult = await fetch(
      `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/auth/refresh-token`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (refreshResult.ok) {
      const refreshData = await refreshResult.json();
      // Store the new token
      const { accessToken, ...userData } = refreshData;
      localStorage.setItem("access-token", accessToken);

      api.dispatch(setUser(userData));

      // Retry the original request with new token
      result = await baseQueryWithAuth(args, api, extraOptions);
    } else {
      api.dispatch(setSignOutUser());
    }
  }

  return result;
};

export const generativeApi = createApi({
  reducerPath: "generativeApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Generative"],
  endpoints: (builder) => ({
    generateWordInfo: builder.mutation({
      query: ([wordId, fieldsAndLangs]) => ({
        url: `/word-info/${wordId}`,
        method: "PATCH",
        body: fieldsAndLangs,
      }),

      transformResponse: (responseData, meta) => {
        const limit = meta.response.headers.get("X-RateLimit-Limit");
        const remaining = meta.response.headers.get("X-RateLimit-Remaining");
        const reset = meta.response.headers.get("X-RateLimit-Reset");

        return {
          ...responseData,
          rateLimit: { limit, remaining, reset },
        };
      },

      async onQueryStarted(
        [wordId, fieldsAndLangs],
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data } = await queryFulfilled;
          const { updateData, milestoneId } = data;

          // pessimistic cache update
          const patchResult = dispatch(
            milestoneApi.util.updateQueryData(
              "bringMilestoneWord",
              milestoneId,
              (draft) => {
                if (draft) {
                  const wordIndex = draft.words.findIndex(
                    (word) => word._id === wordId
                  );
                  if (wordIndex !== -1) {
                    draft.words[wordIndex] = {
                      ...draft.words[wordIndex],
                      ...updateData,
                    };
                  }
                }
              }
            )
          );

          // If update fails, revert the cache
          queryFulfilled.catch(() => {
            patchResult.undo();
          });
        } catch (error) {
          console.error("Cache update error:", error);
        }
      },
    }),

    generateStory: builder.mutation({
      query: ([milestoneId, aboutStory]) => ({
        url: `/story/${milestoneId}`,
        method: "PATCH",
        body: aboutStory,
      }),
      async onQueryStarted(
        [milestoneId, aboutStory],
        { dispatch, queryFulfilled }
      ) {
        try {
          const { data } = await queryFulfilled;
          // Update the cache with the response
          dispatch(
            milestoneApi.util.updateQueryData(
              "bringMilestones",
              undefined,
              (draft) => {
                const milestoneEntry = Object.values(draft?.milestones).find(
                  (m) => m._id === milestoneId
                );
                if (milestoneEntry) {
                  milestoneEntry.story = data.story;
                  milestoneEntry.storyCount = data.storyCount;
                }
              }
            )
          );
        } catch (error) {
          console.log("generating story error: ", error);
        }
      },
    }),
  }),
});

export const { useGenerateWordInfoMutation, useGenerateStoryMutation } =
  generativeApi;
