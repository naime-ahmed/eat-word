import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setSignOutUser, setUser } from "../features/authSlice.js";

// Create a base query with the common configuration
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/milestones`,
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
const baseQueryWithReauth = async (args, api, extraOptions) => {
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

// Create the API with the enhanced base query
export const milestoneApi = createApi({
  reducerPath: "milestoneApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Milestone"],
  endpoints: (builder) => ({
    addMilestone: builder.mutation({
      query: (milestoneData) => ({
        url: "/",
        method: "POST",
        body: milestoneData,
      }),
      // Optimistic Update for Add
      async onQueryStarted(milestoneData, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestones",
            undefined,
            (draft) => {
              Object.assign(draft, milestoneData);
            }
          )
        );
        try {
          // Wait for the server response
          await queryFulfilled;
        } catch {
          // Revert the optimistic update if the request fails
          patchResult.undo();
        }
      },
      invalidatesTags: ["Milestone"],
    }),

    bringMilestones: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: ["Milestone"],
    }),

    bringMilestoneWord: builder.query({
      query: (milestoneId) => ({
        url:`/${milestoneId}`,
        method: "GET"
      }),
      providesTags: ["Milestone"]
    }),

    editMilestone: builder.mutation({
      query: ([milestoneId, updatedFields ]) => ({
        url: `/${milestoneId}`,
        method: "PATCH",
        body: updatedFields,
      }),
      async onQueryStarted(
        { updatedFields, milestoneId },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestones",
            undefined,
            (draft) => {
              const milestoneKeys = Object.keys(draft);
              const milestoneIndex = milestoneKeys.findIndex((key) => draft[key].id === milestoneId);
              if (milestoneIndex !== -1) {
                Object.assign(draft[milestoneKeys[milestoneIndex]], updatedFields);
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

    removeMilestone: builder.mutation({
      query: (milestoneId) => ({
        url: `/${milestoneId}`,
        method: "DELETE",
      }),
      async onQueryStarted(milestoneId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestones",
            undefined,
            (draft) => {
              return draft.filter((milestone) => milestone.id !== milestoneId);
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
  useAddMilestoneMutation,
  useBringMilestonesQuery,
  useBringMilestoneWordQuery,
  useEditMilestoneMutation,
  useRemoveMilestoneMutation,
} = milestoneApi;