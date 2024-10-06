import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// define user signUp, signIn, signOut services
export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({baseUrl: `${import.meta.env.VITE_EAT_WORD_BASE_URL}/auth`}),
    tagTypes:['User'],
    endpoints:(builder) => ({
        signUpUser: builder.mutation({
            query: (userData) => ({
                url: '/sign-up',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User']
        }),
        singInUser: builder.mutation({
            query: (signInData) =>({
                url: '/sign-in',
                method: 'POST',
                body: signInData
            }),
            providesTags: ['User'],
        }),
        singOutUser: builder.mutation({
            query: () =>({
                url: '/sign-out',
                method: 'POST',
            }),
            invalidatesTags: ['User']
        }),
        deleteUser: builder.mutation({
            query: () => ({
                url:'/delete-me',
                method: 'DELETE',
            }),
            invalidatesTags: ['User']
        })
    })
});

// hooks for components to signup users
export const {useSignUpUserMutation, useSingInUserMutation, useSingOutUserMutation, useDeleteUserMutation} = usersApi;