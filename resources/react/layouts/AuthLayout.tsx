import {Outlet, useNavigate} from "react-router-dom";
import {useAuth} from "~/hooks";
import {useEffect} from "react";

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
      <div>This is demo</div>
      <div>
        <Outlet/>
        {props.children}
      </div>
    </div>
  </>
}
