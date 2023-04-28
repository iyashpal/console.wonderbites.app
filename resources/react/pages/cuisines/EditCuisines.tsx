import {Cuisine} from "@/types/models";
import {useCuisineForm} from "@/hooks/forms";
import * as Loaders from "@/components/loaders";
import InputError from "@/components/Form/InputError";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import {Form, Link, useLoaderData} from "react-router-dom";

export default function EditCuisines() {
  const {cuisine} = useLoaderData() as { cuisine: Cuisine }

  const form = useCuisineForm({
    id: cuisine.id,
    name: cuisine.name,
    description: cuisine.description,
    status: cuisine.status,
  })
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Cuisines', href: '/app/cuisines'}, {name: 'Edit Cuisine'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">

          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Edit Cuisine</h1>
          </div>

          <Form method='post' onSubmit={form.onSubmit.update} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" defaultValue={form.input.value('name')} onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError error={form.errors?.name}/>
                </div>

                <div className="col-span-6 relative">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                    Description
                  </label>
                  <textarea defaultValue={form.input.value('description')} onChange={form.input.onChange.description} name="description" id="description" rows={5} className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
                  <InputError error={form.errors?.description}/>
                </div>

                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                    Image
                  </label>
                  <input type="file" onChange={form.input.onChange.thumbnail} accept={'image/*'} name="image" id="image" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none"/>
                  <InputError error={form.errors?.thumbnail} />
                </div>

                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                    Status <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="status" defaultValue={form.input.value('status')} onChange={form.input.onChange.status} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={1}>Public</option>
                    <option value={0}>Private</option>
                  </select>
                  <InputError error={form.errors?.status}/>
                </div>

              </div>

              <div className="pt-4 sm:pt-6 md:pt-8">

                <div className="flex justify-end gap-x-3">

                  <Link to={`/app/cuisines/`} className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">Cancel</Link>

                  <button type="submit" className="inline-flex gap-x-1 items-center justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
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
