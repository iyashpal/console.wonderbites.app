import { Axios } from '@/helpers'
import { useSelector } from '~/store/hooks'

export default function useFetch(config = {}) {
  
  const auth = useSelector(state => state.authSlice)

  return Axios({ headers: { 'Authorization': `Bearer ${auth.token}` }, ...config })
}
