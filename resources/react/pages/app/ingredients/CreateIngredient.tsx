import { DateTime } from "luxon";
import { useForm } from "@/hooks";
import { Category } from "~/contracts/schema";
import Resources from "@/components/resources";
import InputError from "@/components/Form/InputError";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import { useLoaderData, useNavigate } from "react-router-dom";

export default function CreateIngredient() {
  const navigateTo = useNavigate()
  const form = useForm({
    name: '',
    description: '',
    category_id: '',
    price: 0,
    unit: '',
    quantity: 0,
    max_quantity: 0,
    min_quantity: 0,
    thumbnail: '',
    published_at: ''
  })

  const { categories } = useLoaderData() as { categories: Category[] }


  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.post('ingredients').then(({ data }) => {
      navigateTo('/app/ingredients')
    })
  }

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Ingredients', href: '/app/ingredients' }, { name: 'Add Ingredient' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">

        <Resources.Form title="Add Ingredient" onSubmit={onSubmit} backUrl="/app/ingredients" processing={form.isProcessing}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" value={form.input.name} onChange={form.onChange('name')} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('name')} />
            </div>

            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea value={form.input.description} onChange={form.onChange('description')} name="description" id="description" autoComplete="family-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
              <InputError error={form.errors('description')} />
            </div>


            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700">
                Category <sup className='text-red-primary'>*</sup>
              </label>
              <select id="categoryId" value={form.input.category_id} onChange={form.onChange('category_id')} name="categoryId" autoComplete="categoryId" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={''}>Select Category</option>
                {categories.map((category, index) => (<option key={index} value={category.id}>{category.name}</option>))}
              </select>
              <InputError error={form.errors('category_id')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-bold text-gray-700">
                Price <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" value={form.input.price} onChange={form.onChange('price')} name="price" id="price" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('price')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="unit" className="block text-sm font-bold text-gray-700">
                Unit of Measure <sup className='text-red-primary'>*</sup>
              </label>
              <select id="unit" value={form.input.unit} onChange={form.onChange('unit')} name="unit" autoComplete="unit" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={''}>Select a measure</option>
                <option value={'gr'}>gr</option>
                <option value={'kg'}>kg</option>
                <option value={'ml'}>ml</option>
                <option value={'l'}>l</option>
                <option value={'units'}>units</option>
              </select>
              <InputError error={form.errors('unit')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="quantity" className="block text-sm font-bold text-gray-700">
                Quantity <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" value={form.input.quantity} onChange={form.onChange('quantity')} name="quantity" id="quantity" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('quantity')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="min-quantity" className="block text-sm font-bold text-gray-700">
                Min Quantity <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" value={form.input.min_quantity} onChange={form.onChange('min_quantity')} name="min-quantity" id="min-quantity" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('min_quantity')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="max-quantity" className="block text-sm font-bold text-gray-700">
                Max Quantity <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" value={form.input.max_quantity} onChange={form.onChange('max_quantity')} name="max-quantity" id="max-quantity" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors('max_quantity')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700">
                Image
              </label>
              <input type="file" accept={'image/*'} onChange={form.onChange('thumbnail')} name="thumbnail" id="thumbnail" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none" />
              <InputError error={form.errors('thumbnail')} />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                Status <sup className='text-red-primary'>*</sup>
              </label>
              <select id="status" onChange={form.onChange('published_at')} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={DateTime.now().toString()}>Public</option>
                <option value={''}>Private</option>
              </select>
              <InputError error={form.errors('published_at')} />
            </div>
          </div>
        </Resources.Form>
      </div>
    </div>
  </>
}
