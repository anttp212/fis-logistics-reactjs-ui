import { ApiResponseI } from '@app-types/api-response'
import { API_ENDPOINTS, API_TAGS } from '@constants'
import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils'
import { CostGroupParamsT, CostGroupResponseT } from './types'

export const costGroupApi = createApi({
  reducerPath: 'costGroupApi',
  baseQuery: baseQuery,
  tagTypes: [API_TAGS.costGroup.list],
  endpoints: (builder) => ({
    getCostGroups: builder.query<ApiResponseI<CostGroupResponseT>, CostGroupParamsT | void>({
      query: (params) => ({
        url: API_ENDPOINTS.costGroup.list,
        method: 'POST',
        body: params ?? {}
      }),
      transformResponse: (response: any) => response.data,
      providesTags: [API_TAGS.costGroup.list]
    })
  })
})

export const { useGetCostGroupsQuery } = costGroupApi
