import { useFlash } from '@/hooks'
import { Product } from '@/types/models'
import { Fragment, useState } from "react"
import * as Alerts from '@/components/alerts'
import { Details } from '@/components/Show'
import TrashModal from '@/components/TrashModal'
import { Listbox, Transition } from '@headlessui/react'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { PlusIcon } from '@heroicons/react/24/outline'

export default function ShowProduct() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const { product } = useLoaderData() as { product: Product }
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  const [category] = product.categories ?? []

  const [cuisine] = category.cuisines ?? []

  function onEditHandler() {
    navigateTo(`/app/products/${product.id}/edit`)
  }

  function onTrashHandler() {
    setIsTrashing(true)
  }

  function onDeleteProduct() {
    setIsTrashing(false)
    flash.set('product_deleted', true)
    navigateTo('/app/products')
  }

  function onCloseTrash() {
    setIsTrashing(false)
  }

  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Products', href: '/app/products' }, { name: 'Product Details' }]} />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Details
            module="Product"
            title={product.name}
            by={product?.user.name}
            date={product.created_at}
            onClickEdit={onEditHandler}
            onClickTrash={onTrashHandler}
            fields={[
              { name: 'Name', value: product.name },
              { name: 'ID', value: product.id },
              { name: 'Cuisine', value: cuisine.name },
              { name: 'Price', value: `${product.price}L` },
              { name: 'Category', value: category.name },
              { name: 'Description', value: product.description, textWrap: true },
              { name: 'Image', value: <img src={product.thumbnail_url} className="w-10 h-10 rounded-full" /> }
            ]}
          />

          <div className='shadow mt-4 sm:mt-6 lg:mt-8'>
            <ProductIngredients product={product} />
          </div>
        </div>
      </div>
    </div>

    <TrashModal
      show={isTrashing}
      onClose={onCloseTrash}
      title={'Delete Product'}
      onDelete={onDeleteProduct}
      url={`/products/${product.id}`}
      description={<>Are you sure you want to delete "<b>{product.name}</b>"?</>}
    />
  </>
}

function ProductIngredients({ product }: { product: Product }) {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Ingredients
            </h1>
            <p className="mt-2 text-sm text-gray-700 hidden">
              A list of all the ingredients added to the product.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none"></div>
        </div>
        <div className="mt-4 sm:mt-6 lg:mt-8 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className='bg-gray-100 border-gray-300 border-t'>

                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
                    </th>
                    <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6 lg:pl-8 text-left text-sm font-semibold text-gray-900 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      QTY
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Category
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Locked
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Required
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Optional
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Image
                    </th>
                    <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 text-right text-sm font-semibold text-gray-900 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {product?.ingredients?.map((ingredient, index) => (
                    <tr key={index}>
                      <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
                      </th>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                        {ingredient.name}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Front-end Developer
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        lindsay.walton@example.com
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Member
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Member
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        <input type="checkbox" className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4" />
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        <input type="checkbox" className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4" />
                      </td>
                      <td className="px-3 py-4 text-sm text-gray-500 text-center">
                        <input type="checkbox" className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4" />
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        Member
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, Lindsay Walton</span>
                        </a>
                      </td>
                    </tr>
                  ))}

                  {product?.ingredients?.length === 0 && (
                    <tr>
                      <td colSpan={11} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <Alerts.Warning>
                          No ingredients available.
                        </Alerts.Warning>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <CreateNewIngredient />

      <div className='flex items-center justify-start px-3 py-4'>
        <button className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          <PlusIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
          Add New
        </button>
      </div>
    </>

  )
}

function CreateNewIngredient() {

  const ingredients = [
    { id: '001', name: 'Mascarpone', qty: '20 gr', price: '100 L', category: 'Cheese', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '002', name: 'Parmesan', qty: '20 gr', price: '100 L', category: 'Cheese', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '003', name: 'Monterey Jack cheese', qty: '20 gr', price: '100 L', category: 'Cheese', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '004', name: 'Mushrooms', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '005', name: 'Tomatoes', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '006', name: 'Black Pepper', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '007', name: 'Garlic', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
  ]

  const [defaultSelectedIngredients] = ingredients

  const [ingredientSelected, setIngredientSelected] = useState(defaultSelectedIngredients)

  return (
    <div className='flex border-y border-gray-300 divide-x divide-gray-300'>
      <div className={'text-sm text-gray-500 flex-auto'}>
        <Listbox value={ingredientSelected} onChange={setIngredientSelected}>
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default bg-white py-3 sm:py-4 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{ingredientSelected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute bottom-14 max-h-60 w-full overflow-auto bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {ingredients.map((ingredient, index) => (
                  <Listbox.Option value={ingredient} key={index} className={({ active }) => `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-900'}`}>
                    {({ selected }) => <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {ingredient.name}
                      </span>

                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </Listbox>
      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
      <div className={'px-3 py-4 text-sm text-gray-500 flex-auto'}>

      </div>
    </div>
  )
}
