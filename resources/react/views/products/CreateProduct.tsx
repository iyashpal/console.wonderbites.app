import { useState } from 'react';
import { useFetch } from '@/hooks';
import InputError from '@/components/Form/InputError'
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import { Link, Form, useNavigate, useLoaderData } from "react-router-dom";
import { ChevronDownIcon, ChevronRightIcon, PauseCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Category } from '@/types/models';

type CreateProductForm = {

  categoryId: number,

  name: string,

  description: string,

  price: number,

  sku: string,

  publishedAt: string,

}

export default function CreateProduct() {
  const fetcher = useFetch()
  const navigateTo = useNavigate()
  const [isShowFiles, setIsShowFiles] = useState<boolean>(false)
  const {categories} = useLoaderData() as { categories: Category[] }
  const [form, setForm] = useState<CreateProductForm>({} as CreateProductForm)
  const [errors, setErrors] = useState<{ name?: string, sku?: string, categoryId?: string, price?: string, description?: string }>({})

  function toggleUploadProgress() {
    setIsShowFiles(e => !e)
  }


  function handleSubmit(e) {
    e.preventDefault()
    fetcher.post('products', form).then(() => {
      alert('Success')
      navigateTo('/app/products')
    }).catch(({data}) => {
      setErrors(data?.errors)
    })
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
          <Form method='post' onSubmit={handleSubmit} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={(e) => setForm(f => (f.name = e.target.value, f))} name="name" id="name" autoComplete="given-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                  <InputError show={errors?.name}>{errors.name}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="sku" className="block text-sm font-bold text-gray-700">
                    ID <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" onChange={(e) => setForm(f => (f.sku = e.target.value, f))} name="sku" id="sku" autoComplete="family-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                  <InputError show={errors?.sku}>{errors.sku}</InputError>
                </div>


                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700">
                    Category <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="categoryId" onChange={(e) => setForm(f => (f.categoryId = Number(e.target.value), f))} name="categoryId" autoComplete="categoryId" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option >Select Category</option>
                    {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
                  </select>
                  <InputError show={errors?.categoryId}>{errors.categoryId}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-bold text-gray-700">
                    Price <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="number" onChange={(e) => setForm(f => (f.price = Number(e.target.value), f))} name="price" id="price" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                  <InputError show={errors?.price}>{errors.price}</InputError>
                </div>

                <div className="col-span-6">
                  <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                    Description <sup className='text-red-primary'>*</sup>
                  </label>
                  <textarea name="description" onChange={(e) => setForm(f => (f.description = e.target.value, f))} id="description" autoComplete="description" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
                  <InputError show={errors?.description}>{errors.description}</InputError>
                </div>

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
