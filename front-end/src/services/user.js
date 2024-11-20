import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setSignOutUser, setUser } from "../features/authSlice";

const baseQueryWithAuth = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/users`,
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("access-token");
        if(token){
          headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    }
})

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
    
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["user"],
  endpoints: (builder) => ({
    // Fetch user by ID
    bringUserById: builder.query({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
      providesTags: ["user"],
    }),

    // Update user details
    updateUser: builder.mutation({
      query: (updatedData) => ({
        url: "/",
        method: "PUT",
        body: updatedData,
      }),
      async onQueryStarted(updatedData, { dispatch, queryFulfilled }) {
        // Optimistic Update
        const patchResult = dispatch(
          userApi.util.updateQueryData("bringUserById", updatedData.id, (draft) => {
            // Update the user data in the cache
            Object.assign(draft, updatedData);
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["user"],
    }),

    // Delete a user
    deleteUser: builder.mutation({
      query: () => ({
        url: "/",
        method: "DELETE",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          userApi.util.updateQueryData("bringUserById", undefined, () => {
            // Clear user data in the cache
            return null; 
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: ["user"],
    }),
  }),
});

export const {
  useBringUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;

