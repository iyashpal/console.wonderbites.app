import { DateTime } from 'luxon';
import { useState } from 'react';
import { Category } from '@/types/models';
import { useProductForm } from '@/hooks/forms';
import InputError from '@/components/Form/InputError'
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import { Link, Form, useLoaderData } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon, PauseCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export default function CreateProduct() {
  const form = useProductForm({
    name: '',
    sku: '',
    price: 0,
    calories: '0',
    categoryId: 0,
    description: '',
    isCustomizable: false,
    publishedAt: DateTime.now(),
    status: 1,
  })
  const [isShowFiles, setIsShowFiles] = useState<boolean>(false)
  const { categories } = useLoaderData() as { categories: Category[] }

  function toggleUploadProgress() {
    setIsShowFiles(e => !e)
  }

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Products', href: '/app/products' }, { name: 'Add Product' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">
          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Add Product</h1>
          </div>
          <Form method='post' onSubmit={form.onSubmit.create} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" defaultValue={form.input.value('name')} onChange={form.input.onChange.name} name="name" id="name" autoComplete="given-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                  <InputError error={form.errors?.name} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="sku" className="block text-sm font-bold text-gray-700">
                    SKU <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" defaultValue={form.input.value('sku')} onChange={form.input.onChange.sku} name="sku" id="sku" autoComplete="family-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                  <InputError error={form.errors?.sku} />
                </div>


                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700">
                    Category <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="categoryId" onChange={form.input.onChange.categoryId} name="categoryId" autoComplete="categoryId" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option>Select Category</option>
                    {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                  <InputError error={form.errors?.categoryId} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-bold text-gray-700">
                    Price <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="number" defaultValue={form.input.value('price')} onChange={form.input.onChange.price} min={0} name="price" id="price" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                  <InputError error={form.errors?.price} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="calories" className="block text-sm font-bold text-gray-700">
                    Calories
                  </label>
                  <input type="text" defaultValue={form.input.value('calories')} onChange={form.input.onChange.calories} name="calories" id="calories" autoComplete="calories" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                  <InputError error={form.errors?.calories} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="customization" className="block text-sm font-bold text-gray-700">
                    Customization
                  </label>
                  <select defaultValue={form.input.value('isCustomizable')} onChange={form.input.onChange.isCustomizable} name="customization" id="customization" autoComplete="customization" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={1}>Enable</option>
                    <option value={0}>Disable</option>
                  </select>
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                    Description <sup className='text-red-primary'>*</sup>
                  </label>
                  <textarea name="description" defaultValue={form.input.value('description')} onChange={form.input.onChange.description} id="description" autoComplete="description" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
                  <InputError error={form.errors?.description} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700">
                    Image <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="file" accept={'image/*'} onChange={form.input.onChange.thumbnail} name="thumbnail" id="thumbnail" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none" />
                  <InputError error={form.errors?.thumbnail} />
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                    Status <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="publishedAt" defaultValue={form.input.value('publishedAt')} onChange={form.input.onChange.publishedAt} name="status" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={''}>Draft</option>
                    <option value={DateTime.now().toString()}>Published</option>
                  </select>
                  <InputError error={form.errors?.status} />
                </div>

                {isShowFiles && <>
                  <div className="col-span-6">
                    <label htmlFor="file-uploads" className="block text-sm font-bold text-gray-700">
                      Images  <sup className='text-gray-400'>(Not yet ready)</sup>
                    </label>
                    <div className={''}>
                      <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                        <div className="space-y-1 text-center">

                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>

                          <div className="flex text-sm text-gray-600">
                            <p className="pr-1">Drop your file(s) here or</p>
                            <label htmlFor="file-upload" className="relative cursor-pointer  bg-white font-medium text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2 hover:text-red-500">
                              <span>browse</span>
                              <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 20MB</p>
                        </div>
                      </div>

                      <div className={'py-4 space-y-3'}>
                        <div className={'flex items-center justify-center text-sm'}>
                          <button onClick={toggleUploadProgress} className={'inline-flex items-center space-x-3'}>
                            All Files {isShowFiles ? <ChevronDownIcon className={'w-5 h-5'} /> : <ChevronRightIcon className={'w-5 h-5'} />}
                          </button>
                        </div>

                        {isShowFiles && <>
                          <div className={'border rounded-lg shadow p-4 space-y-3'}>
                            <div className={'flex items-center font-semibold'}>
                              Uploading - <span className={'font-normal'}>img24687.jpg</span>
                            </div>
                            <div className={'flex items-center justify-between'}>
                              <div className={'flex items-center text-sm'}>50% - 12 seconds remaining</div>
                              <div className={'flex items-center'}>
                                <button className={'text-gray-300 hover:text-gray-500'}>
                                  <PauseCircleIcon className={'h-6 w-6'} />
                                </button>
                                <button className={'text-gray-300 hover:text-gray-500'}>
                                  <XCircleIcon className={'h-6 w-6'} />
                                </button>
                              </div>
                            </div>
                            <div className={'flex items-center'}>
                              <div className="w-full rounded-full bg-gray-200 h-2 relative">
                                <div className="h-full w-6/12 bg-red-primary rounded-full relative overflow-hidden"></div>
                              </div>
                            </div>
                          </div>
                        </>}

                      </div>
                    </div>

                  </div>
                </>}

              </div>

              <div className="pt-4 sm:pt-6 md:pt-8">

                <div className="flex justify-end">

                  <Link to="/app/products" className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Cancel</Link>

                  <button type="submit" className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Save</button>

                </div>

              </div>

            </div>
          </Form>
        </div>
      </div>
    </div>
  </>
}
