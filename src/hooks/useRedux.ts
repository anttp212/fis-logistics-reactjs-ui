import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { AppDispatchT, RootStateT } from '@redux/index'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatchT = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootStateT> = useSelector
