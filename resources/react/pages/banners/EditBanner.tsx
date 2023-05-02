import {useEffect} from "react";
import {useDataLoader} from "@/hooks";
import {Banner} from "~/contracts/schema";
import {useBannerForm} from "@/hooks/forms";
import * as Loaders from "@/components/loaders";
import InputError from "@/components/Form/InputError";
import {Form, Link, useParams} from "react-router-dom";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function CreateBanner() {

  const {id} = useParams()
  const loader = useDataLoader<{ banner: Banner }>(`banners/${id}/edit`)

  const form = useBannerForm({
    title: '', status: 'active', options: {page: 'home', section: 'todayspick', type: 'image', link: ''},
  })

  useEffect(() => {
    if (loader.isProcessed()) {
      form.input.set('id', loader.response.banner.id)
      form.input.set('title', loader.response.banner.title)
      form.input.set('status', loader.response.banner.status)
      form.input.set('options', loader.response.banner.options)
    }
  }, [loader])

  if (loader.isProcessed()) {
    return (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Banners', href: '/app/banners'}, {name: 'Edit Banner'}]}/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
          <div className="shadow border">

            <div className="p-4 sm:p-6 border-b">
              <h1 className={'font-semibold'}>Edit Banner</h1>
            </div>

            <Form method='post' onSubmit={form.onSubmit.update} encType='multipart/form-data'>
              <div className="p-4 sm:p-6 md:p-8">
                <div className="grid grid-cols-6 gap-6">

                  <div className="col-span-6 sm:col-span-3 relative">
                    <label htmlFor="title" className="block text-sm font-bold text-gray-700">
                      Name <sup className='text-red-primary'>*</sup>
                    </label>
                    <input type="text" defaultValue={form.input.value('title')} onChange={form.input.onChange.title} name="title" id="title" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                    <InputError error={form.errors?.title}/>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="attachment" className="block text-sm font-bold text-gray-700">
                      Image
                    </label>
                    <input type="file" accept={'image/*'} name={'attachment'} id={'attachment'} onChange={form.input.onChange.attachment} className={'mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none'}/>
                    <InputError error={form.errors?.attachment}/>
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label htmlFor="page" className="block text-sm font-bold text-gray-700">
                      Page
                    </label>
                    <select defaultValue={loader.response.banner.options.page} onChange={form.input.onChange.options.page} id="page" name="page" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm disabled:bg-gray-50">
                      <option value={'home'}>Home</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label htmlFor="section" className="block text-sm font-bold text-gray-700">
                      Section
                    </label>
                    <select defaultValue={loader.response.banner.options.section} onChange={form.input.onChange.options.section} id="section" name="section" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                      <option value={'todayspick'}>Today's Pick</option>
                      <option value={'hero'}>Hero Section</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-2">
                    <label htmlFor="link" className="block text-sm font-bold text-gray-700">
                      Link
                    </label>
                    <input type="text" defaultValue={loader.response.banner.options.link} onChange={form.input.onChange.options.link} name="link" id="link" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="type" className="block text-sm font-bold text-gray-700">
                      Type
                    </label>
                    <select defaultValue={loader.response.banner.options.type} onChange={form.input.onChange.options.type} id="type" name="type" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                      <option value={'image'}>Image</option>
                      <option value={'slide'}>Slide</option>
                    </select>
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                      Status <sup className='text-red-primary'>*</sup>
                    </label>
                    <select defaultValue={loader.response.banner.status} id="status" onChange={form.input.onChange.status} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                      <option value={'active'}>Active</option>
                      <option value={'in-active'}>In-Active</option>
                    </select>
                    <InputError error={form.errors?.status}/>
                  </div>

                </div>

                <div className="pt-4 sm:pt-6 md:pt-8">
                  <div className="flex justify-end">
                    <Link to="/app/banners" className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Cancel</Link>

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
    )
  }

  return <></>
}
