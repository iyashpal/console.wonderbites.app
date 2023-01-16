import {GuestLayout} from '~/layouts'
import {useFetch, useAuth} from '~/hooks'
import {useNavigate} from 'react-router-dom'
import React, {useEffect, useState} from 'react'
import AuthCard from '@/components/auth/AuthCard'
import InputError from '@/components/Form/InputError'
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import {UserCircleIcon, LockClosedIcon} from '@heroicons/react/24/solid'


export default function index() {
  const dashboardURI = '/app/dashboard'
  const auth = useAuth()
  const usableFetch = useFetch()
  const navigateTo = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const [errorCode, setErrorCode] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string, password?: string }>({})

  useEffect(() => {
    if (auth.isLoggedIn()) {
      navigateTo(dashboardURI)
    }
  }, [])

  function login() {

    setIsLoading(true)

    usableFetch.post('login', {email, password}).then(({data}) => {
      setErrors({})
      setIsLoading(false)
      auth.useToken(data.token)
      navigateTo(dashboardURI)
    }).catch(({data}) => {
      setErrorCode(data.code)
      setIsLoading(false)
      setErrors(data?.errors)
    })
  }

  return <>
    <GuestLayout>
      <AuthCard>
        {errorCode === 'E_INVALID_AUTH_PASSWORD' && <>
          <div className="flex items-center text-red-600 bg-red-100 px-5 py-3 w-full rounded-md gap-x-2">
            <ExclamationTriangleIcon className={'h-5 w-5'}/> <span>You entered a wrong password.</span>
          </div>
        </>}

        <div className={'w-full relative'}>
          <div className="flex items-center w-full border border-gray-50 shadow-lg rounded overflow-hidden divide-x divide-gray-300 focus-within:divide-red-primary">
          <span className="px-3 flex-none flex items-center">
              <span className="p-1 rounded-full bg-red-primary inline-block">
                  <UserCircleIcon className="w-4 h-4 text-white"/>
              </span>
          </span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="" placeholder='Username' className={`flex-auto focus:outline-none py-3 px-5 placeholder:uppercase placeholder:text-xs placeholder:font-semibold ${!!errors?.email && 'placeholder:text-red-300 text-red-500'}`}/>
          </div>
          <InputError show={errors?.email}>{errors.email}</InputError>
        </div>

        <div className="w-full">
          <div className="flex items-center w-full border border-gray-50 shadow-lg rounded overflow-hidden divide-x divide-gray-300 focus-within:divide-red-primary">
        <span className="px-3 flex-none  flex items-center">
            <span className="p-1 bg-red-primary inline-block rounded-full">
                <LockClosedIcon className="w-4 h-4 text-white"/>
            </span>
        </span>
            <input type="password" name="" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className={`flex-auto focus:outline-none py-3 px-5 placeholder:uppercase placeholder:text-xs placeholder:font-semibold ${!!errors?.password && 'placeholder:text-red-300 text-red-500'}`}/>
          </div>
          <InputError show={errors?.password}>{errors.password}</InputError>
        </div>

        <div className="flex flex-col items-center w-full pt-3 space-y-4">
          <button onClick={login} disabled={isLoading} className="bg-red-primary py-3 px-5 block rounded uppercase font-semibold text-white w-full hover:bg-opacity-60 transition-all ease-in-out duration-700 disabled:bg-opacity-40">
            {isLoading ? 'Processing...' : 'Log In'}
          </button>

          <a href={'/forgot-password'} className="text-red-primary hover:underline transition-all ease-in-out duration-700">Forgot Password?</a>
        </div>
      </AuthCard>
    </GuestLayout>
  </>
}
