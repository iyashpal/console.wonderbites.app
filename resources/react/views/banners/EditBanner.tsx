import {Form, Link} from "react-router-dom";
import {useCategoryForm} from "@/hooks/forms";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import InputError from "@/components/Form/InputError";
import * as Loaders from "@/components/loaders";

export default function EditBanner() {


  const form = useCategoryForm({name: '', description: '', parent: null, type: 'All', status: 1})
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Banners', href: '/app/banners'}, {name: 'Add Banner'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">

          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Add Banner</h1>
          </div>

          <Form method='post' onSubmit={form.onSubmit.create} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700">
                    Image <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="file" accept={'image/*'} name={'thumbnail'} id={'thumbnail'} onChange={form.input.onChange.thumbnail} className={'mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none'}/>
                  <InputError error={form.errors?.thumbnail} />
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                    Description
                  </label>
                  <textarea rows={3} name={'description'} id={'description'} onChange={form.input.onChange.description} className={'mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'} />
                  <InputError error={form.errors?.description} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="parent" className="block text-sm font-bold text-gray-700">
                    Page
                  </label>
                  <select onChange={form.input.onChange.parent} id="parent" name="parent" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm disabled:bg-gray-50">
                    <option value={'Home'}>Home</option>
                  </select>
                  <InputError error={form.errors?.parent} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-bold text-gray-700">
                    Section
                  </label>
                  <select onChange={form.input.onChange.type} id="type" name="type" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={'todayspick'}>Today's Pick</option>
                    <option value={'hero'}>Hero Section</option>
                  </select>
                  <InputError error={form.errors?.type} />
                </div>


                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-bold text-gray-700">
                    Type
                  </label>
                  <select onChange={form.input.onChange.type} id="type" name="type" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={'image'}>Image</option>
                    <option value={'slide'}>Slide</option>
                  </select>
                  <InputError error={form.errors?.type} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                    Status <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="status" onChange={form.input.onChange.status} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={'active'}>Active</option>
                    <option value={'in-active'}>In-Active</option>
                  </select>
                  <InputError error={form.errors?.status} />
                </div>

              </div>

              <div className="pt-4 sm:pt-6 md:pt-8">

                <div className="flex justify-end">

                  <Link to="/app/categories" className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Cancel</Link>

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
