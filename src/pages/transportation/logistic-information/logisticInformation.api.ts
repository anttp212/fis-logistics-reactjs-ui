import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { LogisticInformationI } from './data'

export interface CreateLogisticRequestI {
  customerType: string
  customerCode?: string
  taxCode?: string
  companyName?: string
  shortName?: string
  fullName?: string
  idCardNumber?: string
  address?: string
  paymentType: string
  email?: string
  phone?: string
  note?: string
}

export type UpdateLogisticRequestT = CreateLogisticRequestI

export interface GetLogisticListParamsI {
  page?: number
  size?: number
  keyword?: string
  phone?: string
  customerType?: string
  taxCode?: string
}

export interface LogisticPaginationI {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface LogisticListResponseI {
  code: string
  message: string
  data?: LogisticInformationI[]
  pagination?: LogisticPaginationI
}

export const logisticInformationApi = createApi({
  reducerPath: 'logisticInformationApi',
  baseQuery,
  tagTypes: [API_TAGS.logisticInformation],
  endpoints: (builder) => ({
    getLogisticList: builder.query<
      { data: LogisticInformationI[]; pagination: LogisticPaginationI },
      GetLogisticListParamsI | void
    >({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        if (p.keyword?.trim()) searchParams.set('keyword', p.keyword.trim())
        if (p.phone?.trim()) searchParams.set('phone', p.phone.trim())
        if (p.customerType?.trim()) searchParams.set('customerType', p.customerType.trim())
        if (p.taxCode?.trim()) searchParams.set('taxCode', p.taxCode.trim())
        const qs = searchParams.toString()
        return { url: `${API_ENDPOINTS.logisticInformation.list}${qs ? `?${qs}` : ''}`, method: 'GET' }
      },
      transformResponse: (response: LogisticListResponseI) => ({
        data: response.data ?? [],
        pagination: response.pagination ?? {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
          hasNext: false,
          hasPrevious: false
        }
      }),
      providesTags: [API_TAGS.logisticInformation]
    }),
    getLogisticDetail: builder.query<LogisticInformationI, string>({
      query: (id) => ({ url: API_ENDPOINTS.logisticInformation.detail.replace(':id', id), method: 'GET' }),
      transformResponse: (response: { data?: LogisticInformationI } | LogisticInformationI) =>
        (response && typeof response === 'object' && 'data' in response
          ? response.data
          : response) as LogisticInformationI,
      providesTags: (_result, _err, id) => [{ type: API_TAGS.logisticInformation, id }]
    }),
    createLogistic: builder.mutation<LogisticInformationI, CreateLogisticRequestI>({
      query: (body) => ({ url: API_ENDPOINTS.logisticInformation.create, method: 'POST', body }),
      transformResponse: (response: { data?: LogisticInformationI } | LogisticInformationI) =>
        (response && typeof response === 'object' && 'data' in response
          ? response.data
          : response) as LogisticInformationI,
      invalidatesTags: [API_TAGS.logisticInformation]
    }),
    updateLogistic: builder.mutation<LogisticInformationI, { id: string; body: UpdateLogisticRequestT }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.logisticInformation.update.replace(':id', id),
        method: 'PUT',
        body
      }),
      transformResponse: (response: { data?: LogisticInformationI } | LogisticInformationI) =>
        (response && typeof response === 'object' && 'data' in response
          ? response.data
          : response) as LogisticInformationI,
      invalidatesTags: (_result, _err, { id }) => [
        API_TAGS.logisticInformation,
        { type: API_TAGS.logisticInformation, id }
      ]
    })
  })
})

export const {
  useGetLogisticListQuery,
  useGetLogisticDetailQuery,
  useCreateLogisticMutation,
  useUpdateLogisticMutation
} = logisticInformationApi
