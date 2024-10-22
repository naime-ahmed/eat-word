import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const milestoneApi = createApi({
  reducerPath: "milestoneApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_EAT_WORD_BASE_URL}/milestones`,
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
        // Perform optimistic update on add
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestones",
            undefined,
            (draft) => {
              // Add the new milestone to the local cache immediately
              draft.push(milestoneData);
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

    editMilestone: builder.mutation({
      query: ({ updatedFields, milestoneId }) => ({
        url: `/${milestoneId}`,
        method: "PUT",
        body: updatedFields,
      }),
      // Optimistic Update for Edit
      async onQueryStarted(
        { updatedFields, milestoneId },
        { dispatch, queryFulfilled }
      ) {
        // Perform optimistic update on edit
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestones",
            undefined,
            (draft) => {
              const milestone = draft.find(
                (milestone) => milestone.id === milestoneId
              );
              if (milestone) {
                // Update the milestone locally
                Object.assign(milestone, updatedFields);
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
      // Optimistic Update for Remove
      async onQueryStarted(milestoneId, { dispatch, queryFulfilled }) {
        // Perform optimistic update on delete
        const patchResult = dispatch(
          milestoneApi.util.updateQueryData(
            "bringMilestones",
            undefined,
            (draft) => {
              // Remove the milestone from the local cache
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
  useEditMilestoneMutation,
  useRemoveMilestoneMutation,
} = milestoneApi;
