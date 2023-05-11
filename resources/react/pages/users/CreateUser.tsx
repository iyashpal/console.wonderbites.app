import { useUserForm } from "@/hooks/forms";
import Resources from "@/components/resources";
import InputError from "@/components/Form/InputError";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function CreateUser() {
  const form = useUserForm({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: ''
  })
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Users', href: '/app/users' }, { name: 'Create User' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <Resources.Form title="Create User" backUrl="/app/users" onSubmit={form.onSubmit.create} processing={form.isProcessing}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                First Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" onChange={form.input.onChange.firstName} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.first_name} />
            </div>
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Last Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" onChange={form.input.onChange.lastName} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.last_name} />
            </div>
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Email <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" onChange={form.input.onChange.email} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.email} />
            </div>
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Phone <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" onChange={form.input.onChange.phone} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.phone} />
            </div>
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Password <sup className='text-red-primary'>*</sup>
              </label>
              <input type="password" onChange={form.input.onChange.password} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.password} />
            </div>
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Confirm Password <sup className='text-red-primary'>*</sup>
              </label>
              <input type="password" onChange={form.input.onChange.passwordConfirmation} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.password_confirmation} />
            </div>

            <div className="col-span-6 relative">
              <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                Image
              </label>
              <input type="file" onChange={form.input.onChange.avatar} accept={'image/*'} name="image" id="image" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none" />
              <InputError error={form.errors?.avatar} />
            </div>

          </div>
        </Resources.Form>
      </div>
    </div>
  </>
}
