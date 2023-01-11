import React, {useState} from 'react'
import AuthCard from '@/components/auth/AuthCard'
import {UserCircleIcon, LockClosedIcon} from '@heroicons/react/24/solid'

export default function index() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  return <>
    <AuthCard>
      <div className="flex items-center w-full border border-gray-50 shadow-lg rounded overflow-hidden divide-x divide-gray-300 focus-within:divide-red-primary">
          <span className="px-3 flex-none flex items-center">
              <span className="p-1 rounded-full bg-red-primary inline-block">
                  <UserCircleIcon className="w-4 h-4 text-white"/>
              </span>
          </span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="" placeholder='Username' className="flex-auto focus:outline-none py-3 px-5 placeholder:uppercase placeholder:text-xs placeholder:font-semibold"/>
      </div>
      <div className="flex items-center w-full border border-gray-50 shadow-lg rounded overflow-hidden divide-x divide-gray-300 focus-within:divide-red-primary">
        <span className="px-3 flex-none  flex items-center">
            <span className="p-1 bg-red-primary inline-block rounded-full">
                <LockClosedIcon className="w-4 h-4 text-white"/>
            </span>
        </span>
        <input type="password" name="" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' className="flex-auto focus:outline-none py-3 px-5 placeholder:uppercase placeholder:text-xs placeholder:font-semibold"/>
      </div>

      <div className="flex flex-col items-center w-full pt-3 space-y-4">
        <button className="bg-red-primary py-3 px-5 block rounded uppercase font-semibold text-white w-full hover:bg-opacity-50 transition-opacity ease-in-out duration-700">
          Log In
        </button>

        <a href={'/forgot-password'} className="text-red-primary hover:underline transition-all ease-in-out duration-700">Forgot Password?</a>
      </div>
    </AuthCard>
  </>
}
