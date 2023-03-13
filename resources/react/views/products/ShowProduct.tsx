import { classNames } from '@/helpers'
import { Product } from '@/types/models'
import { Fragment, useState } from "react"
import { Details } from '@/components/Show'
import TrashModal from '@/components/TrashModal'
import { Listbox, Transition } from '@headlessui/react'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/solid'
import { useFlash } from '@/hooks'

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
              { name: 'Price', value: `${product.price} L` },
              { name: 'Category', value: category.name },
              { name: 'Description', value: product.description, textWrap: true },
              { name: 'Image', value: <img src={product.thumbnail_url} className="w-10 h-10 rounded-full" /> }
            ]}
          />

          <div className="shadow px-4 sm:px-6 mt-6 w-full">
            <ProductIngredients />
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

function ProductIngredients() {

  const ingredients = [
    { id: '001', name: 'Mascarpone', qty: '20 gr', price: '100 L', category: 'Cheese', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '002', name: 'Parmesan', qty: '20 gr', price: '100 L', category: 'Cheese', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '003', name: 'Monterey Jack cheese', qty: '20 gr', price: '100 L', category: 'Cheese', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '004', name: 'Mushrooms', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '005', name: 'Tomatoes', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '006', name: 'Black Pepper', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
    { id: '007', name: 'Garlic', qty: '20 gr', price: '100 L', category: 'Topping', add: false, remove: false, image: '/images/placeholder/square.svg' },
  ]

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 py-4">
            Ingredients
          </h1>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-mx-4 sm:-mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="shadow-sm ring-1 ring-black ring-opacity-5 overflow-x-auto">
              <table className="min-w-full border-separate" style={{ borderSpacing: 0 }}>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell">
                      ID
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter">
                      Qty
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                      Price
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                      Category
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                      Add
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                      Remove
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                      Image
                    </th>
                    <th scope="col" className="uppercase sticky top-0 z-10 border-y border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-1 text-left text-sm font-semibold backdrop-blur backdrop-filter sm:pr-6 lg:pr-8">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">

                  {ingredients.map((ingredient, index) => (
                    <tr key={index}>
                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8')}>
                        {ingredient.name}
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell')}>
                        {ingredient.id}
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell')}>
                        {ingredient.qty}
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500')}>
                        {ingredient.price}
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500')}>
                        {ingredient.category}
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500')}>
                        <input type="checkbox" name="" id="" />
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500')}>
                        <input type="checkbox" name="" id="" />
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'whitespace-nowrap px-3 py-4 text-sm text-gray-500')}>
                        <img className={'w-10 h-10 rounded-full'} src={ingredient.image} alt={ingredient.name} />
                      </td>

                      <td {...classNames(index !== ingredients.length - 1 ? 'border-b border-gray-200' : '', 'relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8')}>
                        <a href="#" className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}

                  <CreateNewIngredient key={ingredients.length + 1} />

                </tbody>
              </table>
            </div>
          </div>
        </div>
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
    <tr>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>
        <Listbox value={ingredientSelected} onChange={setIngredientSelected}>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
              <span className="block truncate">{ingredientSelected.name}</span>
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </span>
            </Listbox.Button>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
              <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
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
      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
      <td className={'whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell border-y border-gray-200'}>

      </td>
    </tr>
  )
}

const people = [
  { name: 'Lindsay Walton', title: 'Front-end Developer', email: 'lindsay.walton@example.com', role: 'Member' },
  // More people...
]

function Example() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title, email and role.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-indigo-600 py-2 px-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add user
          </button>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {people.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {person.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.title}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.email}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{person.role}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
