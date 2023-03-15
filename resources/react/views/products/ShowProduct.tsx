import {useFlash} from '@/hooks'
import Modal from "@/components/Modal";
import {Details} from '@/components/Show'
import * as Alerts from '@/components/alerts'
import React, {Fragment, useState} from 'react'
import TrashModal from '@/components/TrashModal'
import {Ingredient, Product} from '@/types/models'
import {Combobox, Transition} from '@headlessui/react'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {Link, useLoaderData, useNavigate} from 'react-router-dom'
import {ChevronUpDownIcon, CloudArrowUpIcon, EyeIcon, PencilSquareIcon, QueueListIcon, TrashIcon, XMarkIcon} from '@heroicons/react/24/outline'

export default function ShowProduct() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const {product, ingredients} = useLoaderData() as { product: Product, ingredients: Ingredient[] }
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
        <Breadcrumb pages={[{name: 'Products', href: '/app/products'}, {name: 'Product Details'}]}/>
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
              {name: 'Name', value: product.name},
              {name: 'ID', value: product.id},
              {name: 'Cuisine', value: cuisine.name},
              {name: 'Price', value: `${product.price}L`},
              {name: 'Category', value: category.name},
              {name: 'Description', value: product.description, onModal: true},
              {name: 'Image', value: <img alt={product.name} src={product.thumbnail_url} className="w-10 h-10 rounded-full"/>}
            ]}
          />

          <div className='shadow mt-4 sm:mt-6 lg:mt-8'>
            <ProductIngredients product={product} ingredients={ingredients}/>
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

function ProductIngredients({product}: { product: Product }) {
  return (
    <>
      <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Ingredients
            </h1>
            <p className="mt-2 text-sm text-gray-700 hidden">
              A list of all the ingredients added to the product.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              <CloudArrowUpIcon className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true"/>
              Import
            </button>
          </div>
        </div>
        <div className="mt-4 sm:mt-6 flow-root">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                <tr className='bg-gray-100 border-gray-300 border-t'>

                  <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                    <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                    Image
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
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                    Locked
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                    Required
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                    Optional
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 text-center text-sm font-semibold text-gray-900 uppercase">
                    Action
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {product?.ingredients?.map((ingredient, index) => (
                  <tr key={index}>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
                    </th>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <img alt={ingredient.name} src={ingredient.thumbnailUrl} className="w-10 h-10 rounded-full border-2 shadow-md" />
                    </td>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {ingredient.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ingredient.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ingredient.meta.pivot_quantity}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ingredient.meta.pivot_price}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      Member
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 text-center">
                      <input type="checkbox" checked={ingredient.meta.pivot_is_locked} disabled className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4"/>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 text-center">
                      <input type="checkbox" checked={ingredient.meta.pivot_is_required} disabled className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4"/>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 text-center">
                      <input type="checkbox" checked={ingredient.meta.pivot_is_optional} disabled className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4"/>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                      <div className="flex item-center justify-center gap-x-1">
                        <Link to={``} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                          <PencilSquareIcon className={'w-5 h-5'} />
                        </Link>

                        <Link to={``} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                          <EyeIcon className={'w-5 h-5'} />
                        </Link>
                        <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                          <TrashIcon className={'w-5 h-5'} />
                        </button>
                      </div>
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

      <CreateNewIngredient/>
    </>

  )
}

function CreateNewIngredient() {

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Ingredient>({} as Ingredient)
  const {ingredients, product} = useLoaderData() as { ingredients: Ingredient[], product: Product }

  const filteredIngredients = (query === '' ? ingredients : ingredients.filter(queryIngredients)).filter(excludeSelectedIngredients)

  function excludeSelectedIngredients(ingredient) {
    let IDs = product.ingredients?.map(({id}) => id)
    return !IDs?.includes(ingredient.id)
  }
  function queryIngredients(ingredient) {
    return ingredient.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase().replace(/\s+/g, ''))
  }

  function resolveCategoryName(ingredient: Ingredient) {
    const [category] = ingredient.categories ?? []

    if (category.id) {
      return category.name
    }

    return null
  }

  return <>
    <div className='flex border-y border-gray-300 divide-x divide-gray-300'>
      <div className={'text-sm text-gray-500 flex-auto relative'}>
        <Combobox value={selected} onChange={setSelected}>
          <div className="relative">
            <div className="relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Button className="absolute inset-y-0 left-0 flex items-center pl-2">
                <QueueListIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
              </Combobox.Button>
              <Combobox.Input placeholder={'Search Ingredient'} displayValue={(ingredient: Ingredient) => ingredient.name} onChange={(event) => setQuery(event.target.value)} className="w-full border-none py-5 px-10 text-sm leading-5 text-gray-900 focus:ring-0"/>
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-400 " aria-hidden="true"/>
              </Combobox.Button>
            </div>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
              <Combobox.Options className="absolute bottom-14 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredIngredients.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filteredIngredients.map((ingredient) => (
                    <Combobox.Option value={ingredient} key={ingredient.id} className={({active}) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-gray-600 text-white' : 'text-gray-900'}`}>
                      {({selected, active}) => (
                        <>
                          <div className="flex items-center">
                            <img src={ingredient.thumbnailUrl} alt="" className="h-5 w-5 flex-shrink-0 rounded-full border-2"/>
                            <span className={`${selected ? 'font-semibold' : 'font-normal'} ml-3 block truncate'`}>
                              {ingredient.name} <span className={'text-gray-400 font-light'}>({resolveCategoryName(ingredient)})</span>
                            </span>
                          </div>
                          {(!!selected.id && active) && (
                            <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-gray-600'}`}></span>
                          )}
                        </>
                      )}
                    </Combobox.Option>
                  ))
                )}
              </Combobox.Options>
            </Transition>
          </div>
        </Combobox>
      </div>
    </div>

    <Modal show={selected.id !== undefined} className={'max-w-4xl'}>
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Add Ingredient</h3>
            <p className="mt-1 text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit quam corrupti consectetur.
            </p>
          </div>
          <div className="ml-4 mt-4 flex-shrink-0">
            <button onClick={() => setSelected({} as Ingredient)} type="button" className="hidden">
              <XMarkIcon className={'w-6 h-6'}/>
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 p-5 sm:p-6">
        <div className="grid grid-cols-6 gap-6">

          <div className="col-span-6 sm:col-span-6 lg:col-span-2">
            <label htmlFor="quantity" className="block text-sm font-medium leading-6 text-gray-900">Qty</label>
            <input type="number" min={1} defaultValue={selected.quantity} name="quantity" id="quantity" autoComplete="address-level2" className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"/>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label htmlFor="min-quantity" className="block text-sm font-medium leading-6 text-gray-900">Min Qty</label>
            <input type="number" min={1} defaultValue={selected.minQuantity} name="min-quantity" id="min-quantity" autoComplete="address-level1" className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"/>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label htmlFor="max-quantity" className="block text-sm font-medium leading-6 text-gray-900">Max Qty</label>
            <input type="number" min={1} defaultValue={selected.maxQuantity} name="max-quantity" id="max-quantity" autoComplete="postal-code" className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"/>
          </div>


          <div className="col-span-6 sm:col-span-6 lg:col-span-2">
            <label htmlFor="is-locked" className="block text-sm font-medium leading-6 text-gray-900">Locked</label>
            <input type="text" name="is-locked" id="is-locked" autoComplete="address-level2" className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"/>
            <p className="text-xs text-gray-400 mt-1">This is input help text</p>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label htmlFor="is-required" className="block text-sm font-medium leading-6 text-gray-900">Required</label>
            <input type="text" name="is-required" id="is-required" autoComplete="address-level1" className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"/>
            <p className="text-xs text-gray-400 mt-1">This is input help text</p>
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-2">
            <label htmlFor="is-optional" className="block text-sm font-medium leading-6 text-gray-900">Optional</label>
            <input type="text" name="is-optional" id="is-optional" autoComplete="postal-code" className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"/>
            <p className="text-xs text-gray-400 mt-1">This is input help text</p>
          </div>

        </div>
      </div>
      <div className="border-t border-gray-200 bg-white px-4 py-5 sm:px-6">
        <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="ml-4 mt-4">
          </div>
          <div className="ml-4 mt-4 flex-shrink-0 space-x-3">
            <button onClick={() => setSelected({} as Ingredient)} type="button" className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
              Cancel
            </button>
            <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  </>
}
