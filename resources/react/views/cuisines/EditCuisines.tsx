import {useFetch} from "@/hooks";
import {Cuisine} from "@/types/models";
import {useEffect, useState} from "react";
import {useUpdateCuisine} from "@/hooks/forms";
import * as Loaders from "@/components/loaders";
import InputError from "@/components/Form/InputError";
import {Form, Link, useParams} from "react-router-dom";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import EditCuisineSkeleton from "./skeleton/EditCuisineSkeleton";

export default function EditCuisines() {
  const {id} = useParams()
  const fetcher = useFetch()
  const form = useUpdateCuisine()
  const [cuisine, setCuisine] = useState<Cuisine>({} as Cuisine)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    fetchCuisine()
  }, [id])

  useEffect(() => {
    form.syncData(cuisine)
  }, [cuisine])


  function fetchCuisine() {
    fetcher.get(`/cuisines/${id}`).then(({data}) => {
      setCuisine(data)
      setIsLoaded(true)
    })
  }

  return <>
    {isLoaded ? <>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Cuisines', href: '/app/cuisines'}, {name: 'Edit Cuisine'}]}/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
          <div className="shadow border">

            <div className="p-4 sm:p-6 border-b">
              <h1 className={'font-semibold'}>Edit Cuisine</h1>
            </div>

            <Form method='post' onSubmit={form.onSubmit} encType='multipart/form-data'>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6 relative">
                    <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                      Name <sup className='text-red-primary'>*</sup>
                    </label>
                    <input type="text" defaultValue={form.data.name} onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                    <InputError error={form.errors?.name}>{form.errors.name}</InputError>
                  </div>

                  <div className="col-span-6 relative">
                    <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                      Description
                    </label>
                    <textarea value={form.data.description} onChange={form.input.onChange.description} name="description" id="description" rows={5} className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
                    <InputError error={form.errors?.description}>{form.errors.description}</InputError>
                  </div>

                  <div className="col-span-6 sm:col-span-3 relative">
                    <label htmlFor="image" className="block text-sm font-bold text-gray-700">
                      Image
                    </label>
                    <input type="file" onChange={form.input.onChange.thumbnail} accept={'image/*'} name="image" id="image" className="mt-1"/>
                    <InputError error={form.errors?.thumbnail}>{form.errors.thumbnail}</InputError>
                  </div>

                  <div className="col-span-6 sm:col-span-3 relative">
                    <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                      Status <sup className='text-red-primary'>*</sup>
                    </label>
                    <select id="status" value={form.data.status} defaultValue={cuisine.status} onChange={form.input.onChange.status} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                      <option value={1}>Public</option>
                      <option value={0}>Private</option>
                    </select>
                    <InputError error={form.errors?.status}>{form.errors.status}</InputError>
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
    </> : <>
      <EditCuisineSkeleton/>
    </>}

  </>
}
