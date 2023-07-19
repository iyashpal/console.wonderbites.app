import { GuestLayout } from '~/layouts'
import React, { useEffect } from 'react'
import { useLoginForm } from '@/hooks/forms'
import { Form, Link } from 'react-router-dom'
import AuthCard from '@/components/auth/AuthCard'
import InputError from '@/components/Form/InputError'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon, LockClosedIcon } from '@heroicons/react/24/solid'


export default function Login() {
  const form = useLoginForm()

  useEffect(() => {
    if (form.auth.isLoggedIn()) {
      form.goToRedirectURL()
    }
  }, [])

  return <>
    <GuestLayout>
      <AuthCard>
        {form.errorCode === 'E_INVALID_AUTH_PASSWORD' && <>
          <div className="flex items-center text-red-600 bg-red-100 px-5 py-3 w-full rounded-md gap-x-2">
            <ExclamationTriangleIcon className={'h-5 w-5'} /> <span>You entered a wrong password.</span>
          </div>
        </>}
        <Form onSubmit={form.onSubmit.login} method='post' className='space-y-4 sm:space-y-5 md:space-y-6 w-full pt-3'>
          <div className={'w-full relative'}>
            <div className="flex items-center w-full border border-gray-100 shadow rounded overflow-hidden divide-x divide-gray-300 focus-within:divide-red-primary">
              <span className="px-2 md:px-3 flex-none flex items-center">
                <span className="p-1 rounded-full bg-red-primary inline-block">
                  <UserCircleIcon className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </span>
              </span>
              <input type="text" defaultValue={form.input.value('email')} onChange={(e) => form.input.set('email', e.target.value)} placeholder='Username' className={`border-0 flex-auto focus:outline-none focus:ring-0 py-2 sm:py-3 px-5 placeholder:uppercase placeholder:text-xs placeholder:font-semibold ${!!form.errors?.email && 'placeholder:text-red-300 text-red-500'}`} />
            </div>
            <InputError error={form.errors?.email} />
          </div>

          <div className="w-full">
            <div className="flex items-center w-full border-gray-100 shadow rounded overflow-hidden divide-x divide-gray-300 focus-within:divide-red-primary">
              <span className="px-2 md:px-3 flex-none  flex items-center">
                <span className="p-1 bg-red-primary inline-block rounded-full">
                  <LockClosedIcon className="w-4 h-4 text-white" />
                </span>
              </span>
              <input type="password" defaultValue={form.input.value('password')} onChange={(e) => form.input.set('password', e.target.value)} placeholder='Password' className={`border-0 flex-auto focus:outline-none focus:ring-0 py-2 sm:py-3 px-5 placeholder:uppercase placeholder:text-xs placeholder:font-semibold ${!!form.errors?.password && 'placeholder:text-red-300 text-red-500'}`} />
            </div>
            <InputError error={form.errors?.password} />
          </div>

          <div className="flex flex-col items-center w-full md:pt-3 space-y-4">
            <button disabled={form.isProcessing} className="bg-red-primary py-2 md:py-3 px-5 block rounded uppercase font-semibold text-sm sm:text-base text-white w-full hover:bg-opacity-60 transition-all ease-in-out duration-300 disabled:bg-opacity-40">
              {form.isProcessing ? 'Processing...' : 'Log In'}
            </button>

            <Link to={'/forgot-password'} className="text-red-primary hover:underline transition-all ease-in-out duration-300">
              Forgot Password?
            </Link>
          </div>
        </Form>
      </AuthCard>
    </GuestLayout>
  </>
}
