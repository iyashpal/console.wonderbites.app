import { DateTime } from "luxon";
import FormCard from "@/components/FormCard";
import { useLoaderData } from "react-router-dom";
import { useIngredientForm } from "@/hooks/forms";
import InputError from "@/components/Form/InputError";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";
import { Category, Ingredient } from "~/contracts/schema";

type RouteLoaderData = {
  category: Category,
  categories: Category[],
  ingredient: Ingredient
}

export default function EditIngredient() {

  const { categories, category, ingredient } = useLoaderData() as RouteLoaderData

  const form = useIngredientForm({
    id: ingredient.id,
    categoryId: category?.id ?? 0,
    name: ingredient.name,
    description: ingredient.description,
    price: ingredient.price,
    unit: ingredient.unit,
    quantity: ingredient.quantity,
    minQuantity: ingredient.minQuantity,
    maxQuantity: ingredient.maxQuantity,
    publishedAt: ingredient.publishedAt,
  })

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Ingredients', href: '/app/ingredients' }, { name: 'Modify Ingredient' }]} />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">

        <FormCard title="Modify Ingredient" onSubmit={form.onSubmit.update} backUrl="/app/ingredients" processing={form.isProcessing}>
          <div className="grid grid-cols-6 gap-6">

            <div className="col-span-6 relative">
              <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                Name <sup className='text-red-primary'>*</sup>
              </label>
              <input type="text" defaultValue={ingredient.name} onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.name}>{form.errors.name}</InputError>
            </div>

            <div className="col-span-6">
              <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                Description
              </label>
              <textarea defaultValue={ingredient.description} onChange={form.input.onChange.description} name="description" id="description" autoComplete="family-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
              <InputError error={form.errors?.description}>{form.errors.description}</InputError>
            </div>


            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700">
                Category <sup className='text-red-primary'>*</sup>
              </label>
              <select id="categoryId" defaultValue={category?.id ?? 0} onChange={form.input.onChange.categoryId} name="categoryId" autoComplete="categoryId" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={0}>Select Category</option>
                {categories.map((category, index) => (<option key={index} value={category.id}>{category.name}</option>))}
              </select>
              <InputError error={form.errors?.categoryId}>{form.errors.categoryId}</InputError>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="price" className="block text-sm font-bold text-gray-700">
                Price <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" defaultValue={ingredient.price} onChange={form.input.onChange.price} name="price" id="price" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.price}>{form.errors.price}</InputError>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="unit" className="block text-sm font-bold text-gray-700">
                Unit of Measure <sup className='text-red-primary'>*</sup>
              </label>
              <select id="unit" defaultValue={ingredient.unit} onChange={form.input.onChange.unit} name="unit" autoComplete="unit" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={''}>Select a measure</option>
                <option value={'gr'}>gr</option>
                <option value={'kg'}>kg</option>
                <option value={'ml'}>ml</option>
                <option value={'l'}>l</option>
                <option value={'units'}>units</option>
              </select>
              <InputError error={form.errors?.unit}>{form.errors.unit}</InputError>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="quantity" className="block text-sm font-bold text-gray-700">
                Quantity <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" defaultValue={ingredient.quantity} onChange={form.input.onChange.quantity} name="quantity" id="quantity" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.price}>{form.errors.price}</InputError>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="min-quantity" className="block text-sm font-bold text-gray-700">
                Min Quantity <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" defaultValue={ingredient.minQuantity} onChange={form.input.onChange.minQuantity} name="min-quantity" id="min-quantity" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.price}>{form.errors.price}</InputError>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="max-quantity" className="block text-sm font-bold text-gray-700">
                Max Quantity <sup className='text-red-primary'>*</sup>
              </label>
              <input type="number" defaultValue={ingredient.maxQuantity} onChange={form.input.onChange.maxQuantity} name="max-quantity" id="max-quantity" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
              <InputError error={form.errors?.price}>{form.errors.price}</InputError>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700">
                Image
              </label>
              <input type="file" accept={'image/*'} onChange={form.input.onChange.thumbnail} name="thumbnail" id="thumbnail" className="mt-1 p-0.5 block w-full border border-gray-300 text-sm text-slate-500 file:mr-4 file:py-1.5 file:px-4  file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none" />
              <InputError error={form.errors?.thumbnail}>{form.errors.thumbnail}</InputError>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                Status <sup className='text-red-primary'>*</sup>
              </label>
              <select id="status" defaultValue={ingredient.status} onChange={form.input.onChange.publishedAt} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                <option value={DateTime.now().toString()}>Public</option>
                <option value={''}>Private</option>
              </select>
              <InputError error={form.errors?.publishedAt}>{form.errors.publishedAt}</InputError>
            </div>
          </div>
        </FormCard>
      </div>
    </div>
  </>
}
