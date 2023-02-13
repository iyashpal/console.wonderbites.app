import {DateTime} from "luxon";
import {Form, Link } from "react-router-dom";
import {useCreateIngredient} from "@/hooks/forms";
import InputError from "@/components/Form/InputError";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function CreateIngredient() {

  const form = useCreateIngredient()


  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Ingredients', href: '/app/ingredients'}, {name: 'Add Ingredient'}]}/>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <div className="shadow border">

          <div className="p-4 sm:p-6 border-b">
            <h1 className={'font-semibold'}>Add Ingredient</h1>
          </div>

          <Form method='post' onSubmit={form.onSubmit} encType='multipart/form-data'>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-3 relative">
                  <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                    Name <sup className='text-red-primary'>*</sup>
                  </label>
                  <input value={form.data.name} type="text" onChange={form.input.onChange.name} name="name" id="name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.name}>{form.errors.name}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="sku" className="block text-sm font-bold text-gray-700">
                    ID <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="text" value={form.data.sku} onChange={form.input.onChange.id} name="sku" id="sku" autoComplete="family-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.sku}>{form.errors.sku}</InputError>
                </div>


                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="categoryId" className="block text-sm font-bold text-gray-700">
                    Category <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="categoryId" defaultValue={form.data.categoryId} onChange={form.input.onChange.categoryId} name="categoryId" autoComplete="categoryId" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option>Select Category</option>
                    <option value={1}>Category 1</option>
                    <option value={2}>Category 2</option>
                    <option value={3}>Category 3</option>
                  </select>
                  <InputError show={form.errors?.categoryId}>{form.errors.categoryId}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="price" className="block text-sm font-bold text-gray-700">
                    Price <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="number" value={form.data.price} onChange={form.input.onChange.price} name="price" id="price" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.price}>{form.errors.price}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="unit" className="block text-sm font-bold text-gray-700">
                    Unit of Measure <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="unit" value={form.data.unit} onChange={form.input.onChange.unit} name="unit" autoComplete="unit" className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={'gram'}>Gram</option>
                  </select>
                  <InputError show={form.errors?.categoryId}>{form.errors.categoryId}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="quantity" className="block text-sm font-bold text-gray-700">
                    Quantity <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="number" value={form.data.quantity} onChange={form.input.onChange.quantity} name="quantity" id="quantity" autoComplete="email" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.price}>{form.errors.price}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="min-quantity" className="block text-sm font-bold text-gray-700">
                    Min Quantity <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="number" value={form.data.minQuantity} onChange={form.input.onChange.minQuantity} name="min-quantity" id="min-quantity" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.price}>{form.errors.price}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="max-quantity" className="block text-sm font-bold text-gray-700">
                    Max Quantity <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="number" onChange={form.input.onChange.maxQuantity} name="max-quantity" id="max-quantity" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.price}>{form.errors.price}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="thumbnail" className="block text-sm font-bold text-gray-700">
                    Image <sup className='text-red-primary'>*</sup>
                  </label>
                  <input type="file" onChange={form.input.onChange.thumbnail} name="thumbnail" id="thumbnail" className="mt-1 block w-full  border border-gray-300 py-1.5 px-1.5 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"/>
                  <InputError show={form.errors?.price}>{form.errors.price}</InputError>
                </div>

                <div className="col-span-6 sm:col-span-3">
                  <label htmlFor="status" className="block text-sm font-bold text-gray-700">
                    Status <sup className='text-red-primary'>*</sup>
                  </label>
                  <select id="status" onChange={form.input.onChange.publishedAt} name="status" className="mt-1 block w-full border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm">
                    <option value={DateTime.now().toString()}>Public</option>
                    <option value={''}>Private</option>
                  </select>
                  <InputError show={form.errors?.publishedAt}>{form.errors.publishedAt}</InputError>
                </div>
              </div>

              <div className="pt-4 sm:pt-6 md:pt-8">

                <div className="flex justify-end">

                  <Link to="/app/ingredients" className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">Cancel</Link>

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
