import Axios from 'redaxios'
import {useSelector} from '~/store/hooks'

export default function useFetch(config = {}) {
  const auth = useSelector(state => state.authSlice)

  return Axios.create({
    ...config,
    baseURL: '/core',
    headers: {
      'Authorization': `Bearer ${auth.token}`,
      'Content-Type': 'application/json'
    }
  })
}
