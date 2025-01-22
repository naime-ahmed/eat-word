import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// define user signUp, signIn, signOut services
export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_EAT_WORD_BACKEND_URL}/auth`,
  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    signUpUser: builder.mutation({
      query: (userData) => ({
        url: "/sign-up",
        method: "POST",
        credentials: "include",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),
    activateUser: builder.mutation({
      query: (activationToken) => ({
        url:"/activate",
        method: "POST",
        credentials: "include",
        body: {activation_token: activationToken},
      }),
      providesTags: ["User"],
    }),
    signInUser: builder.mutation({
      query: (signInData) => ({
        url: "/sign-in",
        method: "POST",
        credentials: "include",
        body: signInData,
      }),
      providesTags: ["User"],
    }),
    forgotPass: builder.mutation({
      query: (email) => ({
        url: "/forgot-password",
        method: "POST",
        body: {email: email},
      })
    }),
    resetPass: builder.mutation({
      query: (payload) => ({
        url: "/reset-password",
        method: "POST",
        body: payload,
      })
    }),
    signOutUser: builder.mutation({
      query: () => ({
        url: "/sign-out",
        credentials: "include",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

// hooks for components to signup users
export const {
  useSignUpUserMutation,
  useActivateUserMutation,
  useSignInUserMutation,
  useForgotPassMutation,
  useResetPassMutation,
  useSignOutUserMutation,
} = authApi;
