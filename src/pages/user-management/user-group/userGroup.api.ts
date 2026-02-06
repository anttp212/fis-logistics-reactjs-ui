import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { ApiResponseI } from '@app-types/api-response'

// User Group types
export interface UserGroupI {
  key: string
  name: string
  description: string
}

export interface UserGroupListResponseI {
  data: UserGroupI[]
  total?: number
}

export interface CreateUserGroupRequestI {
  name: string
  description: string
}

export interface UpdateUserGroupRequestI {
  name: string
  description: string
}

export const userGroupApi = createApi({
  reducerPath: 'userGroupApi',
  baseQuery: baseQuery,
  tagTypes: [API_TAGS.userGroup],
  endpoints: (builder) => ({
    // 📋 GET_USER_GROUPS - Lấy danh sách nhóm người dùng
    getUserGroups: builder.query<ApiResponseI<UserGroupListResponseI>, void>({
      query: () => ({
        url: API_ENDPOINTS.userGroup.list,
        method: 'GET'
      }),
      providesTags: [API_TAGS.userGroup],
      // Transform response nếu cần
      transformResponse: (response: ApiResponseI<UserGroupListResponseI>) => {
        return response
      },
      // Transform error response
      transformErrorResponse: (response: any) => {
        console.error('❌ Get user groups failed:', response)
        return response
      }
    }),

    // ➕ CREATE_USER_GROUP - Tạo mới nhóm người dùng
    createUserGroup: builder.mutation<ApiResponseI<UserGroupI>, CreateUserGroupRequestI>({
      query: (data: CreateUserGroupRequestI) => ({
        url: API_ENDPOINTS.userGroup.create,
        method: 'POST',
        body: data
      }),
      invalidatesTags: [API_TAGS.userGroup],
      transformErrorResponse: (response: any) => {
        console.error('❌ Create user group failed:', response)
        return response
      }
    }),

    // ✏️ UPDATE_USER_GROUP - Cập nhật nhóm người dùng
    updateUserGroup: builder.mutation<
      ApiResponseI<UserGroupI>,
      { id: string; data: UpdateUserGroupRequestI }
    >({
      query: ({ id, data }) => ({
        url: API_ENDPOINTS.userGroup.update.replace(':id', id),
        method: 'PUT',
        body: data
      }),
      invalidatesTags: [API_TAGS.userGroup],
      transformErrorResponse: (response: any) => {
        console.error('❌ Update user group failed:', response)
        return response
      }
    }),

    // 🗑️ DELETE_USER_GROUP - Xóa nhóm người dùng
    deleteUserGroup: builder.mutation<ApiResponseI<void>, string>({
      query: (id: string) => ({
        url: API_ENDPOINTS.userGroup.delete.replace(':id', id),
        method: 'DELETE'
      }),
      invalidatesTags: [API_TAGS.userGroup],
      transformErrorResponse: (response: any) => {
        console.error('❌ Delete user group failed:', response)
        return response
      }
    })
  })
})

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  // Queries
  useGetUserGroupsQuery,
  useLazyGetUserGroupsQuery,

  // Mutations
  useCreateUserGroupMutation,
  useUpdateUserGroupMutation,
  useDeleteUserGroupMutation
} = userGroupApi
