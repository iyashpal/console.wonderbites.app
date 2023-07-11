import { useForm } from "@/hooks";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Resources from "@/components/resources";
import InputError from "@/components/Form/InputError";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function CreateBanner() {

  const navigateTo = useNavigate()

  const form = useForm({
    title: '', attachment: '', status: 'active', page: 'home', section: 'todayspick', type: 'image', link: ''
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    form.post('/banners').then(({ data }) => {
      navigateTo(`/app/banners/${data.id}`)
    })
  }

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Banners', href: '/app/banners' }, { name: 'Add Banner' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <Resources.Form title="Add Banner" backUrl="/app/banners" onSubmit={onSubmit} processing={form.isProcessing}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="title" className="block text-sm font-bold text-gray-700">
                Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" onChange={form.onChange('title')} name="title" id="title" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('title')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="attachment" className="block text-sm font-bold text-gray-700">
                Image <sup className='text-red-primary'>*</sup>
              </label>
              <input type="file" accept={'image/*'} name={'attachment'} id={'attachment'} onChange={form.onChange('attachment')} className={'mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none'} />
              <InputError error={form.errors('attachment')} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="page" className="block text-sm font-bold text-gray-700">
                Page
              </label>
              <select defaultValue={form.input.page} onChange={form.onChange('page')} id="page" name="page" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm disabled:bg-gray-50">
                <option value={'home'}>Home</option>
              </select>
              <InputError error={form.errors('page')} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="section" className="block text-sm font-bold text-gray-700">
                Section
              </label>
              <select defaultValue={form.input.section} onChange={form.onChange('section')} id="section" name="section" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={'todayspick'}>Today's Pick</option>
                <option value={'hero'}>Hero Section</option>
              </select>
              <InputError error={form.errors('section')} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="link" className="block text-sm font-bold text-gray-700">
                Link
              </label>
              <input type="text" defaultValue={form.input.link} onChange={form.onChange('link')} name="link" id="link" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('link')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="type" className="block text-sm font-bold text-gray-700">
                Type
              </label>
              <select defaultValue={form.input.type} onChange={form.onChange('type')} id="type" name="type" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={'image'}>Image</option>
                <option value={'slide'}>Slide</option>
              </select>
              <InputError error={form.errors('type')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                Status <sup className='text-red-primary'>*</sup>
              </label>
              <select defaultValue={form.input.status} id="status" onChange={form.onChange('status')} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={'active'}>Active</option>
                <option value={'in-active'}>In-Active</option>
              </select>
              <InputError error={form.errors('status')} />
            </div>

          </div>
        </Resources.Form>
      </div>
    </div>
  </>
}
