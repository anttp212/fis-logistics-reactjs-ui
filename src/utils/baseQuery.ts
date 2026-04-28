import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, BaseQueryApi } from '@reduxjs/toolkit/query'
import { RootStateT } from '@redux/index'
import { API_ENDPOINTS, HTTP_STATUS } from '@constants'
import { config } from './config'

import authSlice from '../redux/slices/auth.slice'
import { ApiResponseI, RefreshTokenResponseI } from '@app-types/api-response'
import { isEmpty } from 'lodash'

// Queue để chứa các request bị 401
interface PendingRequestI {
  args: string | FetchArgs
  api: BaseQueryApi
  extraOptions: any
  resolve: (value: any) => void
  reject: (reason?: any) => void
}

let isRefreshing = false
let pendingRequests: PendingRequestI[] = []

// Handle 401 errors and token refresh logic
const handleRefreshToken = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any): Promise<any> => {
  // If already refreshing, add to queue
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({
        args,
        api,
        extraOptions,
        resolve,
        reject
      })
    })
  }

  // Set refreshing flag
  isRefreshing = true

  try {
    const state = api.getState() as RootStateT
    const refreshToken = state?.auth?.refreshToken

    // Attempt token refresh
    const refreshResult = await rawBaseQuery(
      {
        url: API_ENDPOINTS.auth.refreshToken,
        method: 'POST',
        body: {
          refreshToken
        }
      },
      api,
      extraOptions
    )

    if (refreshResult.data) {
      const responseData = refreshResult.data as ApiResponseI<RefreshTokenResponseI>

      // TODO: Check if data is not empty
      if (!isEmpty(responseData?.data)) {
        const newTokens = responseData.data

        // Update tokens in Redux store
        api.dispatch(
          authSlice.actions.setTokenData({
            accessToken: newTokens.accessToken ?? newTokens.access_token ?? '',
            refreshToken: newTokens.refreshToken ?? newTokens.refresh_token ?? refreshToken ?? undefined,
            tokenType: newTokens.tokenType ?? newTokens.token_type,
            expiresIn: newTokens.expiresIn ?? newTokens.expires_in
          })
        )

        // Retry original request with new token
        const retryResult = await rawBaseQuery(args, api, extraOptions)

        // Process all pending requests
        await processPendingRequests()

        return retryResult
      }
    }

    // Refresh failed - clear auth and reject pending requests
    api.dispatch(authSlice.actions.clearAuth())
    rejectPendingRequests(refreshResult)
    return refreshResult
  } catch (error) {
    // Refresh error - clear auth and reject pending requests
    api.dispatch(authSlice.actions.clearAuth())
    rejectPendingRequests(error)
    throw error
  } finally {
    // Reset refresh state
    isRefreshing = false
    pendingRequests = []
  }
}

// Process all pending requests after successful token refresh
const processPendingRequests = async (): Promise<void> => {
  const requests = [...pendingRequests]

  await Promise.allSettled(
    requests.map(async (pendingRequest) => {
      try {
        const retryResult = await rawBaseQuery(pendingRequest.args, pendingRequest.api, pendingRequest.extraOptions)

        pendingRequest.resolve(retryResult)
      } catch (error) {
        pendingRequest.reject(error)
      }
    })
  )
}

// Reject all pending requests when refresh fails
const rejectPendingRequests = (error: any): void => {
  pendingRequests.forEach((pendingRequest) => {
    pendingRequest.reject(error)
  })
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: config.apiUrl,
  prepareHeaders: (headers, api) => {
    const accessToken = (api.getState() as RootStateT)?.auth?.accessToken
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
  timeout: config.apiTimeout
})

export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // Try the request
  const result = await rawBaseQuery(args, api, extraOptions)

  // Handle 401 errors
  if (result.error?.status === HTTP_STATUS.unauthorized) {
    return await handleRefreshToken(args, api, extraOptions)
  }

  return result
}
