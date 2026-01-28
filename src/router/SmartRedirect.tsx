import React from 'react'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@constants'
import { useAppSelector } from '@hooks'

// ✅ Safe auth check hook that works with redux-persist
const useIsAuthenticated = (): { isAuthenticated: boolean; isRehydrated: boolean } => {
  const accessToken = useAppSelector((state) => state.auth?.accessToken)
  const isRehydrated = useAppSelector((state) => state._persist?.rehydrated ?? false)

  return {
    isAuthenticated: !!accessToken,
    isRehydrated
  }
}

// Smart redirect component based on auth status
const SmartRedirect: React.FC = () => {
  const { isAuthenticated, isRehydrated } = useIsAuthenticated()

  // Show loading while redux-persist is rehydrating
  if (!isRehydrated) {
    return (
      <div
        className=' flex justify-center items-center h-[100vh]'
        style={{
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <div>Loading...</div>
      </div>
    )
  }

  // Once rehydrated, make navigation decision
  if (isAuthenticated) {
    return <Navigate to={ROUTES.home} replace />
  } else {
    return <Navigate to={ROUTES.login} replace />
  }
}

export default SmartRedirect
