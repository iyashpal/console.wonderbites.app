import {useAuth} from '~/hooks'
import {useEffect} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'
import Header from './AuthLayout/Header'


export default function AuthLayout(props) {
  const auth = useAuth()
  const navigateTo = useNavigate()

  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigateTo('/')
    }
  }, [])
  return <>
    <div>
      <Header />
      <div>
        <Outlet/>
        {props.children}
      </div>
    </div>
  </>
}


