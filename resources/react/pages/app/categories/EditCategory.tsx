import { useForm } from '@/hooks'
import { Category } from '~/contracts/schema'
import Resources from '@/components/resources'
import { useLoaderData, useNavigate } from 'react-router-dom'
import InputError from '@/components/Form/InputError'
import Breadcrumb from '@/layouts/AuthLayout/Breadcrumb'

export default function EditCategory() {
  const navigateTo = useNavigate()
  const { categories, category } = useLoaderData() as { category: Category, categories: Category[] }

  const form = useForm({
    id: category.id,
    name: category.name,
    type: category.type,
    status: category.status,
    thumbnail: '',
    description: category.description,
    parent: category.parent?.toString(),
  })

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.put(`categories/${form.input.id}`).then(() => {
      navigateTo(`/app/categories/${form.input.id}`)
    })
  }

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Categories', href: '/app/categories' }, { name: 'Edit Category' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">

        <Resources.Form title='Edit Category' backUrl='/app/categories' onSubmit={onSubmit} processing={form.isProcessing}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" defaultValue={form.input.name} onChange={form.onChange('name')} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('name')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700">
                Image
              </label>
              <input type="file" accept={'image/*'} name={'thumbnail'} id={'thumbnail'} onChange={form.onChange('thumbnail')} className={'mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none'} />
              <InputError error={form.errors('thumbnail')} />
            </div>

            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea rows={3} name={'description'} id={'description'} defaultValue={form.input.description} onChange={form.onChange('description')} className={'mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm'} />
              <InputError error={form.errors('description')} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="parent" className="block text-sm font-bold text-gray-700">
                Parent
              </label>
              <select defaultValue={form.input.parent} onChange={form.onChange('parent')} disabled={categories.length === 0} id="parent" name="parent" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm disabled:bg-gray-50">
                <option value={''}>Select Category</option>
                {categories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <InputError error={form.errors('parent')} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="type" className="block text-sm font-bold text-gray-700">
                Type
              </label>
              <select defaultValue={form.input.type} onChange={form.onChange('type')} id="type" name="type" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={'All'}>All</option>
                <option value={'Cuisine'}>Cuisine</option>
                <option value={'Ingredient'}>Ingredient</option>
                <option value={'Product'}>Product</option>
                <option value={'Variant'}>Variant</option>
              </select>
              <InputError error={form.errors('type')} />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                Status <sup className='text-red-primary'>*</sup>
              </label>
              <select id="status" defaultValue={form.input.status} onChange={form.onChange('status')} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={'public'}>Public</option>
                <option value={'private'}>Private</option>
              </select>
              <InputError error={form.errors('status')} />
            </div>
          </div>
        </Resources.Form>
      </div>
    </div>
  </>
}
