import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import {Form, Link} from "react-router-dom";
import InputError from "@/components/Form/InputError";
import * as Loaders from "@/components/loaders";
import {useCuisineForm} from "@/hooks/forms";

export default function CreateUser() {
  const form = useCuisineForm({name: '', description: '', status: 0})
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Users', href: '/app/users'}, {name: 'Create User'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">

          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Create User</h1>
          </div>

          <Form method='post' onSubmit={form.onSubmit.create} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    First Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Last Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Password <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="password" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Email <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Phone <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name} />
                </div>
                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Confirm Password <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="password" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name} />
                </div>



                <div className="col-span-6 sm:col-span-2 relative">
                  <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                    Image <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="file" onChange={form.input.onChange.thumbnail} accept={'image/*'} name="image" id="image" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none"/>
                  <InputError error={form.errors?.thumbnail} />
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
          </Form>
        </div>
      </div>
    </div>
  </>
}
