import {useFlash} from '@/hooks'
import {Details} from '@/components/Show'
import * as Alerts from '@/components/alerts'
import React, {Fragment, useState} from 'react'
import TrashModal from '@/components/TrashModal'
import {Ingredient, Product} from '@/types/models'
import {Combobox, Transition} from '@headlessui/react'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {useLoaderData, useNavigate} from 'react-router-dom'
import {ChevronUpDownIcon, CloudArrowUpIcon, QueueListIcon, TrashIcon} from '@heroicons/react/24/outline'

export default function ShowProduct() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const {product} = useLoaderData() as { product: Product, ingredients: Ingredient[] }
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  const [category] = product.categories ?? []

  const [cuisine] = category?.cuisines ?? []

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
            onEdit={onEditHandler}
            onTrash={onTrashHandler}
            fields={[
              {name: 'Name', value: product.name},
              {name: 'ID', value: product.id},
              {name: 'Cuisine', value: cuisine?.name ?? '-'},
              {name: 'Price', value: `${product.price}L`},
              {name: 'Category', value: category?.name ?? '-'},
              {name: 'Description', value: product.description, onModal: true},
              {name: 'Image', value: <img alt={product.name} src={product.thumbnail_url} className="w-10 h-10 rounded-full"/>}
            ]}
          />

          <div className='shadow mt-4 sm:mt-6 lg:mt-8'>
            <ProductIngredients product={product}/>
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
                  {/*<th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">*/}
                  {/*  Locked*/}
                  {/*</th>*/}
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                    Add <span className="sr-only">Required</span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                    Remove <span className="sr-only">Optional</span>
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                    Image
                  </th>
                  <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 text-center text-sm font-semibold text-gray-900 uppercase w-14">
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

                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
                      {ingredient.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ingredient.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ingredient.meta.pivot_quantity} {ingredient.unit}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {ingredient.meta.pivot_price}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      Member
                    </td>
                    {/*<td className="px-3 py-4 text-sm text-gray-500 text-center">*/}
                    {/*  <input type="checkbox" checked={ingredient.meta.pivot_is_locked} disabled className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4"/>*/}
                    {/*</td>*/}
                    <td className="px-3 py-4 text-sm text-gray-500 text-center">
                      <input type="checkbox" checked={ingredient.meta.pivot_is_required} disabled className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4"/>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-500 text-center">
                      <input type="checkbox" checked={ingredient.meta.pivot_is_optional} disabled className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4"/>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <img alt={ingredient.name} src={ingredient.thumbnailUrl} className="w-10 h-10 rounded-full border-2 shadow-md"/>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
                      <div className="flex item-center justify-center gap-x-1">
                        <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                          <TrashIcon className={'w-5 h-5'}/>
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

      <div className="flex items-center justify-end">

      </div>
    </>

  )
}

function CreateNewIngredient() {

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Ingredient>({} as Ingredient)
  const {ingredients, product} = useLoaderData() as { ingredients: Ingredient[], product: Product }

  const filteredIngredients = (query === '' ? ingredients : ingredients.filter(queryIngredients)).filter(excludeSelectedIngredients)

  function excludeSelectedIngredients(ingredient) {
    if (ingredient) {
      let IDs = product.ingredients?.map(({id}) => id)
      return !IDs?.includes(ingredient.id)
    }
    return false
  }

  function queryIngredients(ingredient) {
    return ingredient.name
      .toLowerCase()
      .replace(/\s+/g, '')
      .includes(query.toLowerCase().replace(/\s+/g, ''))
  }

  function resolveCategoryName(ingredient: Ingredient, placeholder: string = '-') {
    const [category] = ingredient.categories ?? []

    return category?.id ? category.name : placeholder
  }

  return <>
    <div className='grid grid-cols-10 border border-gray-300 divide-x divide-gray-300'>
      <div className={'col-span-2 text-sm text-gray-500 flex-auto relative max-w-sm'}>
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
                  filteredIngredients.map((ingredient, index) => (
                    <Combobox.Option value={ingredient} key={index} className={({active}) => `relative cursor-default select-none py-2 px-4 ${active ? 'bg-gray-600 text-white' : 'text-gray-900'}`}>
                      {({selected, active}) => (
                        <>
                          <div className="flex items-center">
                            <img src={ingredient.thumbnailUrl} alt="" className="h-5 w-5 flex-shrink-0 rounded-full border-2"/>
                            <span className={`${selected ? 'font-semibold' : 'font-normal'} ml-3 block truncate'`}>
                              {ingredient.name} {(!!ingredient?.categories?.length) && <span className={'text-gray-400 font-light'}>({resolveCategoryName(ingredient)})</span>}
                            </span>
                          </div>
                          {(selected && active) && (
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
      <div className={'flex items-center justify-center'}>
        {selected.id}
      </div>
      <div className={''}>
        {(!!selected?.id) && <input type={'number'} min={0} defaultValue={selected.quantity} name="" id="" className={'w-full h-full border-0'}/>}
      </div>
      <div className={''}>
        {(!!selected?.id) && <input type={'number'} min={0} defaultValue={selected.price} name="" id="" className={'w-full h-full border-0'}/>}
      </div>
      <div className={'flex items-center justify-center bg-gray-100'}>
        {resolveCategoryName(selected)}
      </div>
      <div className={'flex items-center justify-center'}>
        {(!!selected?.id) && <input type={'checkbox'} name="" id="" className={'border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4'}/>}
      </div>
      <div className={'flex items-center justify-center'}>
        {(!!selected?.id) && <input type={'checkbox'} name="" id="" className={'border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4'}/>}
      </div>
      <div className={'bg-gray-100 flex items-center justify-center'}>
        <img alt={selected.name} src={selected.thumbnailUrl} className="w-10 h-10 rounded-full border-2 shadow-md"/>
      </div>
      <div className={''}>
        {/*Actions*/}
      </div>
    </div>
  </>
}
