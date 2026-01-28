import { useLocation } from 'react-router-dom'

const useQuery = () => {
  return new URLSearchParams(useLocation().search)
}

const useQueryParam = (param: string) => {
  const query = useQuery()
  return query.has(param)
}

export default useQueryParam
