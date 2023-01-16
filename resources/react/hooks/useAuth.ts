import {useState} from 'react';
import {useFetch} from "./index";
import {useSelector, useDispatch} from '@/store/hooks';
import {setAuthToken} from '~/store/features/auth/authSlice'

export default function useAuth() {
  const auth = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const [token, setToken] = useState<string>(auth.token)

  function useToken(authToken: string) {
    setToken(authToken)

    dispatch(setAuthToken(authToken))

    return this
  }

  /**
   * Determine if the user is logged in or not.
   */
  function isLoggedIn(): boolean {
    if (token) return true

    return false
  }


  function authorize() {
    useFetch().get('auth')
  }

  return {
    isLoggedIn,
    authorize,
    useToken
  }
}
