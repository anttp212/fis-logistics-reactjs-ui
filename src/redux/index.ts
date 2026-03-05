import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import authSlice from '@slices/auth.slice'
import { loginApi } from '../pages/auth/login/login.api'
import { userGroupApi } from '../pages/user-management/user-group/userGroup.api'
import { departmentsApi } from '../pages/organization-structure/departments/departments.api'
import { vehicleDispatchApi } from '../pages/transportation/vehicle-dispatch/vehicleDispatch.api'
import { vehicleDispatchMasterApi } from '../pages/transportation/vehicle-dispatch/vehicleDispatchMaster.api'
import { dashboardApi } from '../pages/home/dashboard.api'

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'] // Add reducer names you want to persist here
}

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [userGroupApi.reducerPath]: userGroupApi.reducer,
  [departmentsApi.reducerPath]: departmentsApi.reducer,
  [vehicleDispatchApi.reducerPath]: vehicleDispatchApi.reducer,
  [vehicleDispatchMasterApi.reducerPath]: vehicleDispatchMasterApi.reducer,
  [dashboardApi.reducerPath]: dashboardApi.reducer
})

// Wrap the root reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

// mount it on the Store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
        ignoredPaths: ['register'] // Ignore paths that might have non-serializable data
      },
      immutableCheck: {
        warnAfter: 128 // Warn if state operations take longer than 128ms
      }
    }).concat(
      loginApi.middleware,
      userGroupApi.middleware,
      departmentsApi.middleware,
      vehicleDispatchApi.middleware,
      vehicleDispatchMasterApi.middleware,
      dashboardApi.middleware
    ) // Add RTK Query middleware
})

// Create a persistor
const persistor = persistStore(store)

export type RootStateT = ReturnType<typeof store.getState>
export type AppDispatchT = typeof store.dispatch

// Export AuthState for type checking
export type { AuthStateI } from '@slices/auth.slice'

export { store, persistor } // Export persistor
