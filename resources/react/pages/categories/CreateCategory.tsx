import { Category } from '~/contracts/schema'
import Resources from '@/components/resources'
import { useCategoryForm } from '@/hooks/forms'
import { useLoaderData } from 'react-router-dom'
import InputError from '@/components/Form/InputError'
import Breadcrumb from '@/layouts/AuthLayout/Breadcrumb'

export default function CreateCategory() {

  const { categories } = useLoaderData() as { categories: Category[] }

  const form = useCategoryForm({ name: '', description: '', parent: null, type: 'All', status: 'private' })
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Categories', href: '/app/categories' }, { name: 'Add Category' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <Resources.Form title='Add Category' backUrl='/app/categories' onSubmit={form.onSubmit.create} processing={form.isProcessing}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.name} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700">
                Image
              </label>
              <input type="file" accept={'image/*'} name={'thumbnail'} id={'thumbnail'} onChange={form.input.onChange.thumbnail} className={'mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none'} />
              <InputError error={form.errors?.thumbnail} />
            </div>

            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea rows={3} name={'description'} id={'description'} onChange={form.input.onChange.description} className={'mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'} />
              <InputError error={form.errors?.description} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="parent" className="block text-sm font-bold text-gray-700">
                Parent
              </label>
              <select onChange={form.input.onChange.parent} disabled={categories.length === 0} id="parent" name="parent" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm disabled:bg-gray-50">
                <option value={''}>Select Category</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <InputError error={form.errors?.parent} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="type" className="block text-sm font-bold text-gray-700">
                Type
              </label>
              <select onChange={form.input.onChange.type} id="type" name="type" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={'All'}>All</option>
                <option value={'Cuisine'}>Cuisine</option>
                <option value={'Ingredient'}>Ingredient</option>
                <option value={'Product'}>Product</option>
                <option value={'Variant'}>Variant</option>
              </select>
              <InputError error={form.errors?.type} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                Status <sup className='text-red-primary'>*</sup>
              </label>
              <select id="status" onChange={form.input.onChange.status} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={'public'}>Public</option>
                <option value={'private'}>Private</option>
              </select>
              <InputError error={form.errors?.status} />
            </div>

          </div>
        </Resources.Form>
      </div>
    </div>
  </>
}
