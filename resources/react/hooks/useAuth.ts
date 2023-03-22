import {useFetch} from "./index"
import {useEffect, useState} from 'react'
import {useSelector, useDispatch} from '@/store/hooks'
import {setUser} from "@/store/features/auth/userSlice";
import {setUser as setAuthUser} from '~/store/features/auth/authSlice'
import {setAuthToken} from '~/store/features/auth/authSlice'
import {Axios} from "@/helpers";

export default function useAuth() {
  const dispatch = useDispatch()

  const auth = useSelector(state => state.authSlice)

  const [token, setToken] = useState<string|null>(auth.token)

  useEffect(() => {

  }, [auth.user])


  function useToken(authToken: string | null) {
    setToken(authToken)

    dispatch(setAuthToken(authToken))

    return this
  }

  function syncUser(user) {
    dispatch(setUser(user))
    dispatch(setAuthUser(user))
  }

  /**
   * Determine if the user is logged in or not.
   */
  function isLoggedIn(): boolean {
    return !!token;
  }

  function user(key: string, defaultValue = null) {
    if (auth.user[key]) {
      return auth.user[key]
    }

    return defaultValue
  }


  function check() {
    useFetch().get('auth')
  }

  function logout() {
    return Axios().post('logout').then(() => {
      syncUser({})
      useToken(null)
      return Promise.resolve()
    })
  }

  return {
    user,
    logout,
    check,
    syncUser,
    useToken,
    isLoggedIn,
  }
}
