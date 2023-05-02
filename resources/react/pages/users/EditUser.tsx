import {User} from "~/contracts/schema";
import {useUserForm} from "@/hooks/forms";
import * as Loaders from "@/components/loaders";
import {Link, useLoaderData} from "react-router-dom";
import InputError from "@/components/Form/InputError";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function EditUser() {
  const {user} = useLoaderData() as { user: User}
  const form = useUserForm({
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.mobile,
    password: '',
    password_confirmation: ''
  })
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Users', href: '/app/users'}, {name: 'Edit User'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">

          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Edit User</h1>
          </div>

          <form method='post' onSubmit={form.onSubmit.update} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    First Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" defaultValue={form.input.value('first_name')} onChange={form.input.onChange.firstName} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.first_name} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Last Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" defaultValue={form.input.value('last_name')} onChange={form.input.onChange.lastName} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.last_name} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Password
                  </label>
                  <input type="password" onChange={form.input.onChange.password} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.password} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Email <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" defaultValue={form.input.value('email')} onChange={form.input.onChange.email} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.email} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Phone <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" defaultValue={form.input.value('phone')} onChange={form.input.onChange.phone} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.phone} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Confirm Password
                  </label>
                  <input type="password" onChange={form.input.onChange.passwordConfirmation} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.password_confirmation} />
                </div>



                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                    Image
                  </label>
                  <input type="file" onChange={form.input.onChange.avatar} accept={'image/*'} name="image" id="image" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none"/>
                  <InputError error={form.errors?.avatar} />
                </div>

              </div>

              <div className="pt-4 sm:pt-6 md:pt-8">

                <div className="flex items-center justify-end gap-x-3">

                  <Link to="/app/users" className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Cancel</Link>

                  <button type="submit" className="inline-flex items-center justify-center gap-x-1 rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    {form.isProcessing ? <><Loaders.Circle className={'animate-spin h-5 w-5'}/> Saving</> : 'Save'}
                  </button>

                </div>

              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  </>
}
