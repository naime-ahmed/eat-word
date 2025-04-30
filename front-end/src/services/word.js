import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setSignOutUser, setUser } from "../features/authSlice";
import { milestoneApi } from "./milestone";

// Create a base query with the common configuration
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/words`,
  credentials: "include",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Create a custom base query with retry logic
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  // Check if we got a 401 with "Access token expired" message
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
      const { accessToken, ...userData } = refreshData;
      localStorage.setItem("access-token", accessToken);

      api.dispatch(setUser(userData));

      // Retry the original request with new token
      result = await baseQueryWithAuth(args, api, extraOptions);
    } else {
      // If refresh failed, sign out the user
      api.dispatch(setSignOutUser());
    }
  }

  return result;
};

export const wordApi = createApi({
  reducerPath: "wordApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Word"],
  endpoints: (builder) => ({
    appendWord: builder.mutation({
      query: (wordData) => ({
        url: `/`,
        method: "POST",
        body: wordData,
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
      // Optimistic update
      async onQueryStarted(wordData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestoneWord",
            wordData.addedMilestone,
            (draft) => {
              if (draft && draft.words) {
                draft.words.push(wordData);
              }
            }
          )
        );

        try {
          const result = await queryFulfilled;
          const { newWord } = result.data;

          // Update the cache with the server response
          dispatch(
            milestoneApi.util.updateQueryData(
              "bringMilestoneWord",
              newWord.addedMilestone,
              (draft) => {
                if (draft && draft.words) {
                  const wordIndex = draft.words.findIndex(
                    (word) => word.word === newWord.word
                  );
                  if (wordIndex !== -1) {
                    draft.words[wordIndex] = newWord;
                  }
                }
              }
            )
          );
          // update milestone cache
          dispatch(
            milestoneApi.util.updateQueryData(
              "bringMilestones",
              undefined,
              (draft) => {
                const milestonesArray = draft?.milestones;

                if (milestonesArray) {
                  const milestoneIndex = milestonesArray.findIndex(
                    (milestone) => milestone._id === newWord.addedMilestone
                  );
                  if (milestoneIndex !== -1) {
                    milestonesArray[milestoneIndex] = {
                      ...milestonesArray[milestoneIndex],
                      wordsCount:
                        milestonesArray[milestoneIndex].wordsCount + 1,
                    };
                  } else {
                    console.warn(
                      "Milestone not found in cache:",
                      newWord.addedMilestone
                    );
                  }
                } else {
                  console.warn("Milestones array not found in cache.");
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Milestone"],
    }),
    bringWord: builder.query({
      query: (wordId) => ({
        url: `/${wordId}`,
        method: "GET",
      }),
      providesTags: ["Word"],
    }),
    editWord: builder.mutation({
      query: ({ wordId, milestoneId, updates }) => ({
        url: `/${wordId}`,
        method: "PATCH",
        body: { milestoneId, updates },
      }),
      async onQueryStarted(
        { wordId, milestoneId, updates: editedFields },
        { dispatch, queryFulfilled }
      ) {
        // Optimistically update the cache
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestoneWord",
            milestoneId,
            (draft) => {
              if (draft && draft.words) {
                const wordIndex = draft.words.findIndex(
                  (word) => word._id === wordId
                );
                if (wordIndex !== -1) {
                  Object.assign(draft.words[wordIndex], editedFields);
                }
              }
            }
          )
        );

        try {
          const res = await queryFulfilled;
          const updatedWord = res?.data?.word;

          // filed to update
          if ("memorized" in editedFields) {
            const incrementValue = editedFields.memorized ? 1 : -1;

            // update milestone cache
            dispatch(
              milestoneApi.util.updateQueryData(
                "bringMilestones",
                undefined,
                (draft) => {
                  const milestonesArray = draft?.milestones;

                  if (milestonesArray) {
                    const milestoneIndex = milestonesArray.findIndex(
                      (milestone) =>
                        milestone._id === updatedWord.addedMilestone
                    );
                    if (milestoneIndex !== -1) {
                      milestonesArray[milestoneIndex] = {
                        ...milestonesArray[milestoneIndex],
                        memorizedCount:
                          (milestonesArray[milestoneIndex].memorizedCount || 0) + incrementValue,
                      };
                    } else {
                      console.warn(
                        "Milestone not found in cache:",
                        updatedWord.addedMilestone
                      );
                    }
                  } else {
                    console.warn("Milestones array not found in cache.");
                  }
                }
              )
            );
          }
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Milestone"],
    }),
    deleteWord: builder.mutation({
      query: ({ wordId, milestoneId }) => ({
        url: `/${wordId}`,
        method: "DELETE",
        body: { milestoneId },
      }),
      // Optimistic update
      async onQueryStarted(
        { wordId, milestoneId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestoneWord",
            milestoneId,
            (draft) => {
              if (draft && draft.words) {
                draft.words = draft.words.filter((word) => word._id !== wordId);
              }
            }
          )
        );

        try {
          await queryFulfilled;

          // update milestone cache
          dispatch(
            milestoneApi.util.updateQueryData(
              "bringMilestones",
              undefined,
              (draft) => {
                const milestonesArray = draft?.milestones;

                if (milestonesArray) {
                  const milestoneIndex = milestonesArray.findIndex(
                    (milestone) => milestone._id === milestoneId
                  );
                  if (milestoneIndex !== -1) {
                    milestonesArray[milestoneIndex] = {
                      ...milestonesArray[milestoneIndex],
                      wordsCount:
                        milestonesArray[milestoneIndex].wordsCount - 1,
                    };
                  } else {
                    console.warn("Milestone not found in cache:", milestoneId);
                  }
                } else {
                  console.warn("Milestones array not found in cache.");
                }
              }
            )
          );
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["Milestone"],
    }),
  }),
});

export const {
  useAppendWordMutation,
  useBringWordQuery,
  useEditWordMutation,
  useDeleteWordMutation,
} = wordApi;
