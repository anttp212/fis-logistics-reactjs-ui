import { useForm } from 'react-hook-form'
import { useSearchParams } from 'react-router-dom'
import { useMemo, useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'

/**
 * ============================================
 * TYPES
 * ============================================
 */

export type ColumnOptionT = {
  label: string
  value: string
}

export type TableFiltersT = Record<string, any>
export type TableColumnsT = string[]

export type TableApiParamsT<TFilters = TableFiltersT> = {
  filters: TFilters
  columns: TableColumnsT
  sort?: { columnKey?: string; order?: string }
  page?: number
  pageSize?: number
}

export interface UseTableToolbarConfigI<TFormValues = any> {
  defaultFilterValues: Partial<TFormValues>
}

/**
 * ============================================
 * HELPER UTILITIES
 * ============================================
 */

/**
 * Create parseFiltersFromUrl for specific filter fields
 */
const createParseFiltersFromUrl = <TFilters>(filterFields: (keyof TFilters)[]) => {
  return (searchParams: URLSearchParams): TFilters => {
    const filters = {} as TFilters
    filterFields.forEach((field) => {
      const value = searchParams.get(field as string)
      if (value) {
        ;(filters as any)[field] = value
      }
    })
    return filters
  }
}

/**
 * Parse sort info from URL
 */
const parseSortFromUrl = (searchParams: URLSearchParams): { columnKey?: string; order?: string } => {
  const columnKey = searchParams.get('sortColumn') || undefined
  const order = searchParams.get('sortOrder') || undefined
  return { columnKey, order }
}

export const useTableToolbar = <TFormValues extends Record<string, any> = any, TFilters = any>(
  config: UseTableToolbarConfigI<TFormValues>
) => {
  const { defaultFilterValues } = config
  const [searchParams, setSearchParams] = useSearchParams()

  // Sort state management - initialize from URL
  const [sortedInfo, setSortedInfo] = useState<{
    columnKey?: string
    order?: string
  }>(() => parseSortFromUrl(searchParams))

  // Update sort state and URL
  const handleSort = useCallback(
    (columnKey?: string, order?: string) => {
      setSortedInfo({ columnKey, order })

      // Update URL
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev)
        if (columnKey && order) {
          params.set('sortColumn', columnKey)
          params.set('sortOrder', order)
        } else {
          params.delete('sortColumn')
          params.delete('sortOrder')
        }
        return params
      })
    },
    [setSearchParams]
  )

  // Auto-generate filterFields from defaultFilterValues keys
  const filterFields = useMemo(() => Object.keys(defaultFilterValues) as (keyof TFilters)[], [defaultFilterValues])

  const parseFiltersFromUrl = useMemo(() => createParseFiltersFromUrl<TFilters>(filterFields), [filterFields])

  // Initialize default form values
  const defaultValues = useMemo(
    () => ({
      ...defaultFilterValues,
      search: ''
    }),
    [defaultFilterValues]
  )

  // Setup react-hook-form
  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { errors },
    getValues,
    setValue
  } = useForm<TFormValues & { search: string }>({
    defaultValues: defaultValues as any
  })

  /**
   * FILTER FUNCTIONS
   */

  // Load saved filter values from URL
  const loadSavedFilterValues = useCallback(() => {
    const filters = parseFiltersFromUrl(searchParams) as any
    Object.entries(filters).forEach(([key, value]) => {
      // @ts-expect-error - setValue type inference issue with generic types
      setValue(key, value || '')
    })
  }, [searchParams, parseFiltersFromUrl, setValue])

  // Reset filter to default empty state (exclude search field)
  const handleResetFilter = useCallback(() => {
    Object.keys(defaultFilterValues).forEach((key) => {
      if (key !== 'search') {
        setValue(key as any, (defaultFilterValues as any)[key])
      }
    })
  }, [defaultFilterValues, setValue])

  // Save filter to URL
  const handleSaveFilter = useCallback(() => {
    const formValues = getValues()
    const params = new URLSearchParams(searchParams)

    // Add filter values to URL params
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === 'search') return // Skip non-filter fields
      if (value && value !== '') {
        params.set(key, String(value))
      } else {
        params.delete(key)
      }
    })

    setSearchParams(params)
  }, [getValues, searchParams, setSearchParams])

  /**
   * SEARCH FUNCTIONS
   */

  // Handle search change - update URL immediately with debounce
  const handleSearchChangeRef = useRef(
    debounce((params: URLSearchParams, value: string, setter: (params: URLSearchParams) => void) => {
      const newParams = new URLSearchParams(params)
      if (value && value.trim() !== '') {
        newParams.set('search', value)
      } else {
        newParams.delete('search')
      }
      setter(newParams)
    }, 300)
  )

  // Cleanup debounce on unmount
  useEffect(() => {
    const searchValue = searchParams.get('search') || ''
    // @ts-expect-error - setValue type inference issue with generic types
    setValue('search' as any, searchValue)
    const debouncedFn = handleSearchChangeRef.current
    return () => {
      debouncedFn.cancel()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearchChange = useCallback(
    (value: string) => {
      handleSearchChangeRef.current(searchParams, value, setSearchParams)
    },
    [searchParams, setSearchParams]
  )

  return {
    // Form methods
    register,
    control,
    watch,
    handleSubmit,
    errors,
    setValue,
    getValues,

    // Search value from URL
    search: searchParams.get('search') || '',

    // Filter functions
    handleSaveFilter,
    handleResetFilter,
    loadSavedFilterValues,

    // Search function
    handleSearchChange,

    // Sort state and handler
    sortedInfo,
    handleSort
  }
}
