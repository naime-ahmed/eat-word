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
      // Store the new token
      const { accessToken, ...userData } = refreshData;
      localStorage.setItem("access-token", accessToken);

      // Update user data in Redux store
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
  tagTypes: ["word"],
  endpoints: (builder) => ({
    appendWord: builder.mutation({
      query: (wordData) => ({
        url: `/`,
        method: "POST",
        body: wordData,
      }),
      // Optimistic update
      async onQueryStarted(wordData, { dispatch, queryFulfilled }) {
        // Optimistically add the new word to the milestoneApi cache
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
          await queryFulfilled;
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
      providesTags: ["word"],
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
                // Find the word in the words array
                const wordIndex = draft.words.findIndex((word) => word._id === wordId);
                console.log("modified word Idx",wordIndex);
                if (wordIndex !== -1) {
                  // Merge the editedFields into the found word object
                  Object.assign(draft.words[wordIndex], editedFields);
                }
              }
            }
          )
        );
    
        try {
          await queryFulfilled;
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
  useEditWordMutation 
} = wordApi;
