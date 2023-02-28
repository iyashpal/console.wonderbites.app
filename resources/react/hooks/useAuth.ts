import {useFetch} from "./index"
import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from '@/store/hooks'
import {setUser} from '~/store/features/auth/authSlice'
import {setAuthToken} from '~/store/features/auth/authSlice'

export default function useAuth() {
  const dispatch = useDispatch()

  const auth = useSelector(state => state.authSlice)

  const [token, setToken] = useState<string>(auth.token)

  useEffect(() => {

  }, [])



  function useToken(authToken: string) {
    setToken(authToken)

    dispatch(setAuthToken(authToken))

    return this
  }

  function syncUser(user) {
    dispatch(setUser(user))
  }

  /**
   * Determine if the user is logged in or not.
   */
  function isLoggedIn(): boolean {
    return !!token;
  }


  function check() {
    useFetch().get('auth')
  }

  return {
    check,
    syncUser,
    useToken,
    isLoggedIn,
  }
}
