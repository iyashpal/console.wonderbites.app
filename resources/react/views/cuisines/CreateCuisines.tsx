import {Form, Link} from 'react-router-dom';
import {useCreateCuisine} from '@/hooks/forms';
import * as Loaders from '@/components/loaders';
import InputError from '@/components/Form/InputError';
import Breadcrumb from '@/layouts/AuthLayout/Breadcrumb';

export default function CreateCuisines() {
  const form = useCreateCuisine()
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Cuisines', href: '/app/cuisines'}, {name: 'Add Cuisine'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">

          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Add Cuisine</h1>
          </div>

          <Form method='post' onSubmit={form.onSubmit} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.name}>{form.errors.name}</InputError>
                </div>

                <div className="col-span-6 relative">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                    Description
                  </label>
                  <textarea onChange={form.input.onChange.description} name="description" id="description" rows={5} className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.description}>{form.errors.description}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                    Image <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="file" onChange={form.input.onChange.thumbnail} accept={'image/*'} name="image" id="image" className="mt-1"/>
                  <InputError show={form.errors?.thumbnail}>{form.errors.thumbnail}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                    Status <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="status" defaultValue={1} onChange={form.input.onChange.status} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={1}>Public</option>
                    <option value={0}>Private</option>
                  </select>
                  <InputError show={form.errors?.status}>{form.errors.status}</InputError>
                </div>

              </div>

              <div className="pt-4 sm:pt-6 md:pt-8">

                <div className="flex justify-end">

                  <Link to="/app/cuisines" className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Cancel</Link>

                  <button type="submit" className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    {form.isProcessing ? <Loaders.Circle className={'animate-spin h-5 w-5'}/> : 'Save'}
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
