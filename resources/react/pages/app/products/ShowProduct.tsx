import Icons from '@/helpers/icons'
import Modal from '@/components/Modal'
import Avatar from "@/components/Avatar"
import { useFlash, useForm } from '@/hooks'
import * as Alerts from '@/components/alerts'
import Resources from '@/components/resources'
import * as Loaders from '~/components/loaders'
import TrashModal from '@/components/TrashModal'
import { Select, Input } from '@/components/forms'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import { IngredientProduct } from '@/contracts/schema/pivot'
import { Combobox, Menu, Transition } from '@headlessui/react'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useIngredientProductForm, useMediaProductForm } from '@/hooks/forms'
import { Category, Ingredient, Media, Product, Variant } from '~/contracts/schema'
import { Form, Link, useLoaderData, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const columns = [
  { name: 'Name', options: { className: 'text-left' } },
  { name: 'ID', options: { className: 'text-left' } },
  { name: 'Cuisine', options: { className: 'text-left' } },
  { name: 'Price', options: { className: 'text-center' } },
  { name: 'Category', options: { className: 'text-left' } },
  { name: 'Description', options: { className: 'text-center', onModal: true } },
  { name: 'Images', options: { className: 'text-left' } },
  { name: 'Type', options: { className: 'text-left' } },
  { name: 'Status', options: { className: 'text-left' } },
]

export default function ShowProduct() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const { product } = useLoaderData() as { product: Product, ingredients: Ingredient[] }

  const [category] = product.categories ?? []

  const [cuisine] = category?.cuisines ?? []

  function onDeleteProduct() {
    setIsTrashing(false)
    flash.set('product_deleted', true)
    navigateTo('/app/products')
  }


  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Products', href: '/app/products' }, { name: 'Product Details' }]} />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <Resources.Detail module='Product' title={product.name} by={product?.user.name} date={product.created_at} columns={columns}>
            {() => ([
              product.name,
              product.id,
              cuisine?.name ?? '-',
              `${product.price}L`,
              category?.name ?? '-',
              product.description,
              <Avatar className={'w-12 h-12 rounded-full ring-2'} src={product.thumbnail_url} alt={product.name} />,
              <span className="uppercase">{product.type}</span>,
              <span className='capitalize'>{product.status}</span>,
              <div className="flex items-center justify-center gap-x-3">
                <Link to={`/app/products/${product.id}/edit`} className={'action:button button:green'}>
                  <Icons.Outline.PencilSquare className={'w-5 h-5'} />
                </Link>

                <button onClick={() => setIsTrashing(true)} className={'action:button button:red'}>
                  <Icons.Outline.Trash className={'w-5 h-5'} />
                </button>
              </div>
            ])}
          </Resources.Detail>

          <ProductImages />

          {(Boolean(product.is_customizable) && product.type === 'general') && (
            <div className='shadow mt-4 sm:mt-6 lg:mt-8'>
              <ProductIngredients product={product} />
            </div>
          )}

          {(product.type === 'variable') && (
            <ProductVariants product={product} />
          )}
        </div>
      </div>
    </div>

    <TrashModal
      show={isTrashing}
      title={'Delete Product'}
      onDelete={onDeleteProduct}
      url={`/products/${product.id}`}
      onClose={() => setIsTrashing(false)}
      description={<>Are you sure you want to delete "<b>{product.name}</b>"?</>}
    />
  </>
}

function ProductImages() {
  const imageField = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState('image')
  const form = useMediaProductForm({ attachment: '' })
  const { product } = useLoaderData() as { product: Product }

  useEffect(() => {
    form.sync(product)
  }, [product])

  function onChangeImage(e) {
    form.input.onChange.create(e).then(() => {
      if (imageField.current) {
        imageField.current.value = ''
      }
    })
  }

  function MediaOrder({ media }: { media: Media }) {
    const form = useMediaProductForm({ id: media.id })
    useEffect(() => {
      form.sync(product)
    }, [])
    return (
      <input onChange={form.input.onChange.update}
        className={'w-24 rounded border-gray-300 focus:ring-gray-500 focus:border-gray-500'} type="number" min={0}
        defaultValue={media.meta.pivot_order} />
    )
  }

  function TrashMedia({ media }: { media: Media }) {
    const form = useMediaProductForm({ id: media.id })

    useEffect(() => {
      form.sync(product)
    }, [])


    function moveToTrash() {
      form.deleteProductMedia()
    }

    return (
      <button onClick={moveToTrash}
        className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
        {form.isProcessing ? <Loaders.Circle className={'w-5 h-5 animate-spin'} /> :
          <Icons.Outline.Trash className={'w-5 h-5'} />}
      </button>
    )
  }

  return <>
    <div className="bg-white mt-10 shadow-md divide-y">
      <div className={'p-3 sm:p-4 flex items-center justify-between'}>
        <div>
          <h3 className={'font-semibold'}>Images</h3>
        </div>
      </div>
      <div className="flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  <th scope="col"
                    className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 w-28">Preview
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Caption</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 ">Order</th>
                  <th scope="col"
                    className="py-3.5 pl-4 pr-4 text-center text-sm font-semibold text-gray-900 sm:pr-0">Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {product.media?.map((media, index) => {
                  return (
                    <tr key={index} className="divide-x divide-gray-200">

                      <td className="whitespace-nowrap py-2 px-4 text-sm font-medium text-gray-900">
                        <img src={media.attachment_url} alt={media.title}
                          className={'h-10 aspect-video object-cover rounded-md'} />
                      </td>

                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {media.title}
                      </td>

                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        <MediaOrder media={media} />
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                        <div className="flex item-center justify-center gap-x-1">
                          <button
                            className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                            <Icons.Outline.Star className={'w-5 h-5'} />
                          </button>
                          <TrashMedia media={media} />
                        </div>
                      </td>

                    </tr>
                  )
                })}

                {product.media?.length === 0 && (
                  <tr>
                    <td colSpan={4} className={'whitespace-nowrap p-4 text-sm text-gray-500'}>
                      <Alerts.Warning>
                        Product images not available.
                      </Alerts.Warning>
                    </td>
                  </tr>
                )}

                <tr className="bg-gray-50">
                  <td colSpan={4} className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">
                    <div className={'flex items-center border border-gray-300 text-slate-500 bg-white divide-x'}>
                      <select defaultValue={fileType} onChange={(e) => setFileType(e.target.value)}
                        className={'py-1.5 bg-white text-sm border-0 focus:border-0 focus:outline-none focus:ring-0'}>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                      <input ref={imageField} onChange={onChangeImage} type="file" accept={fileType === 'image' ? 'image/*' : 'video/*'} name="attachment" id="attachment" className="p-0.5 text-sm block w-full file:mr-4 file:py-1.5 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 focus:outline-none" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </>
}

function ProductIngredients({ product }: { product: Product }) {
  const location = useLocation()
  const navigateTo = useNavigate()
  const ingredientProduct = useIngredientProductForm({ product })
  const [ingredient, setIngredient] = useState({} as IngredientProduct)

  function onTrash(ingredient: IngredientProduct) {
    setIngredient(ingredient)
  }

  function onClose() {
    setIngredient({} as IngredientProduct)
  }

  function executeTrash() {
    ingredientProduct.detach([ingredient.id]).then(() => {
      navigateTo(location)
      onClose()
    })
  }

  return (
    <>
      <div className="divide-y divide-gray-200 overflow-hidden bg-white shadow">
        <div className="px-4 py-5 sm:px-6">
          <div className="-ml-4 -mt-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
            <div className="ml-4 mt-4">
              <h3 className="text-base font-semibold leading-6 text-gray-900">Product Ingredients</h3>
              <p className="mt-1 text-sm text-gray-500">
                A list of all the ingredients added to the product.
              </p>
            </div>
            <div className="ml-4 mt-4 flex-shrink-0">
              <button type="button"
                className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                <Icons.Outline.CloudArrowUp className="-ml-0.5 mr-2 h-4 w-4" aria-hidden="true" />
                Import
              </button>
            </div>
          </div>
        </div>


        <div className="flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className='bg-gray-100'>

                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input type="checkbox"
                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
                    </th>

                    <th scope="col" className="py-3.5 pl-4 pr-3 sm:pl-6 lg:pl-8 text-left text-sm font-semibold text-gray-900 uppercase">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase w-24">
                      QTY
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase w-24">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Category
                    </th>
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

                  {product?.ingredients?.map((ingredient, index) => (<IngredientRow key={index} ingredient={ingredient} onTrash={onTrash} />))}


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
        <CreateNewIngredient />
      </div>
      <Modal show={ingredient?.id !== undefined} onClose={onClose} className={'max-w-lg'}>
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div
              className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <Icons.Outline.ExclamationTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Delete Ingredient</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">Are you sure you want to remove <b>{ingredient.name}</b> from the product? All of the ingredient configuration data will be permanently removed. This action cannot be undone.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button onClick={executeTrash} type="button" className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">
            {ingredientProduct.isProcessing ? <Loaders.Circle className={'animate-spin h-5 w-5'} /> : 'Delete'}
          </button>
          <button onClick={onClose} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">
            Cancel
          </button>
        </div>
      </Modal>
    </>
  )
}

function IngredientRow({ ingredient, onTrash }: {
  ingredient: IngredientProduct,
  onTrash: (ingredient: IngredientProduct) => void
}) {
  const [isTouched, setIsTouched] = useState('')
  const { product } = useLoaderData() as { product: Product }
  const ingredientProduct = useIngredientProductForm({ product })
  const [pivotIngredientProduct, setPivotIngredientProduct] = useState<IngredientProduct>(ingredient)

  useEffect(() => {
    if (isTouched) {
      ingredientProduct.sync(pivotIngredientProduct)
    }
  }, [isTouched])

  function resolveCategoryName(ingredient: IngredientProduct) {
    const [category] = ingredient.categories ?? []

    if (category?.id) {
      return category.name
    }

    return '-'
  }

  function onChangeQuantity(e) {
    setPivotIngredientProduct(i => ({ ...i, meta: { ...i.meta, pivot_quantity: e.target.value } }))
    setIsTouched(`quantity:${e.target.value}`)
  }

  function onChangePrice(e) {
    setPivotIngredientProduct(i => ({ ...i, meta: { ...i.meta, pivot_price: e.target.value } }))
    setIsTouched(`price:${e.target.value}`)
  }

  function onChangeAddable(e) {
    setPivotIngredientProduct(i => ({
      ...i, meta: {
        ...i.meta,
        pivot_is_required: e.target.checked,
        pivot_is_locked: !e.target.checked && !i.meta.pivot_is_optional,
      }
    }))
    setIsTouched(`is_required:${e.target.checked ? 'checked' : 'unchecked'}`)
  }

  function onChangeRemovable(e) {
    setPivotIngredientProduct(i => ({
      ...i, meta: {
        ...i.meta,
        pivot_is_optional: e.target.checked,
        pivot_is_locked: !e.target.checked && !i.meta.pivot_is_required,
      }
    }))
    setIsTouched(`is_optional:${e.target.checked ? 'checked' : 'unchecked'}`)
  }

  return (
    <tr>
      <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
        <input type="checkbox"
          className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
      </th>

      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
        {ingredient.name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {ingredient.id}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input onChange={onChangeQuantity} defaultValue={ingredient.meta.pivot_quantity} type="number" name="" id=""
          className={'w-20 border border-gray-300 rounded-md focus:outline-none active:outline-none focus:ring-red-primary focus:border-red-primary'} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <input onChange={onChangePrice} defaultValue={ingredient.meta.pivot_price} type="number" name="" id=""
          className={'w-20 border border-gray-300 rounded-md focus:outline-none active:outline-none focus:ring-red-primary focus:border-red-primary'} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {resolveCategoryName(ingredient)}
      </td>
      <td className="px-3 py-4 text-sm text-gray-500 text-center">
        <input onChange={onChangeAddable} type="checkbox" value={1} defaultChecked={ingredient.meta.pivot_is_required}
          className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4" />
      </td>
      <td className="px-3 py-4 text-sm text-gray-500 text-center">
        <input onChange={onChangeRemovable} type="checkbox" value={1} defaultChecked={ingredient.meta.pivot_is_optional}
          className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4" />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <img alt={ingredient.name} src={ingredient.thumbnailUrl} className="w-10 h-10 rounded-full border-2 shadow-md" />
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
        <div className="flex item-center justify-center gap-x-1">
          <button onClick={() => onTrash(ingredient)}
            className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
            <Icons.Outline.Trash className={'w-5 h-5'} />
          </button>
        </div>
      </td>
    </tr>
  )
}

function CreateNewIngredient() {
  const location = useLocation()
  const navigateTo = useNavigate()
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Ingredient>({} as Ingredient)
  const { ingredients, product } = useLoaderData() as { ingredients: Ingredient[], product: Product }
  const ingredientProduct = useIngredientProductForm({ product })
  const filtered = (query === '' ? ingredients : ingredients.filter(queryIngredients)).filter(excludeSelectedIngredients)

  function excludeSelectedIngredients(ingredient) {
    if (ingredient) {
      let IDs = product.ingredients?.map(({ id }) => id)
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

  function onChange(ingredient) {
    ingredientProduct.attach(ingredient).then(() => {
      navigateTo(location)
    })
  }

  function onSelectCategory(category) {
    onChange(category)
    setSelected({} as Ingredient)
  }

  return <>
    <div className='grid grid-cols-10 border-t border-gray-300 divide-x divide-gray-300 bg-white'>
      <div className={'col-span-3 text-sm text-gray-500 flex-auto relative max-w-sm pl-6'}>
        <Combobox value={selected} onChange={onSelectCategory}>
          <div className="relative">
            <div
              className="relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Button className="absolute inset-y-0 left-0 flex items-center">
                <Icons.Outline.MagnifyingGlass className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
              <Combobox.Input placeholder={'Search Ingredient'}
                displayValue={(ingredient: Ingredient) => ingredient.name}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full border-none py-4 px-10 text-sm leading-5 text-gray-900 focus:ring-0" />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Icons.Outline.ChevronUpDown className="h-5 w-5 text-gray-400 " aria-hidden="true" />
              </Combobox.Button>
            </div>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100"
              leaveTo="opacity-0" afterLeave={() => setQuery('')}>
              <Combobox.Options
                className="absolute bottom-14 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filtered.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filtered.map((ingredient, index) => (
                    <Combobox.Option value={ingredient} key={index}
                      className={({ active }) => `relative cursor-pointer select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'}`}>
                      {({ selected }) => (
                        <>
                          <div className="flex items-center">
                            <img src={ingredient.thumbnailUrl} alt=""
                              className="h-5 w-5 flex-shrink-0 rounded-md border-2" />
                            <span className={`${selected ? 'font-semibold' : 'font-normal'} ml-3 block truncate'`}>
                              {ingredient.name} {(!!ingredient?.categories?.length) &&
                                <span className={'text-gray-400 font-light'}>({resolveCategoryName(ingredient)})</span>}
                            </span>
                          </div>
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

      <div></div>
    </div>
  </>
}

function ProductVariants({ product }: { product: Product }) {
  const navigateTo = useNavigate()
  const [search, setSearch] = useSearchParams({ variant: '' })
  const [isTrashing, setIsTrashing] = useState({} as Variant)
  const [showVariable, setShowVariable] = useState<Variant>({} as Variant)

  useEffect(() => {
    setShowVariable(
      product.variants?.find(
        ({ id }) => Number(search.get('variant')) === id
      ) ?? {} as Variant
    )
  }, [search])

  /**
   * Handle the close event for the product variant.
   *
   * @returns void
   */
  function handleCloseVariantDetailEvent(): void {
    setSearch(queryParams => {
      queryParams.delete('variant')
      return queryParams
    })
    setShowVariable({} as Variant)
  }

  /**
   * Handles the delete variant event.
   *
   * @returns void
   */
  function handleDeleteVariantEvent(): void {
    navigateTo('')
    setIsTrashing({} as Variant)
  }


  function VariantRow({ variant }: { variant: Variant }) {
    const form = useForm({
      product_id: variant.meta.pivot_product_id,
      name: variant.name,
      description: variant.description,
      price: variant.meta.pivot_price,
    })

    function onKeyDown(e) {
      if (e.key === 'Enter') {
        form.put(`variants/${variant.id}`).then(() => {
          navigateTo('')
          form.reset()
        })
      }
    }
    return (
      <tr className='relative overflow-hidden'>
        <td className="whitespace-nowrap py-2 pl-4 pr-4 text-sm font-medium text-gray-900">
          <Input type="text" onKeyDown={onKeyDown} onChange={form.onChange('name')} error={form.errors('name')} defaultValue={variant.name} variant="underlined" placeholder="Name *" />
        </td>

        <td className="whitespace-nowrap py-2 pl-4 pr-4 text-sm font-medium text-gray-900">
          <Input type="text" onKeyDown={onKeyDown} onChange={form.onChange('description')} error={form.errors('description')} defaultValue={variant.description} variant="underlined" placeholder="Description" />
        </td>

        <td className="whitespace-nowrap px-4 py-2 text-sm text-gray-500">
          <Input type="number" onKeyDown={onKeyDown} onChange={form.onChange('price')} error={form.errors('price')} min={0} defaultValue={variant.meta.pivot_price} variant="underlined" placeholder="Price *" />
        </td>

        <td className="p-4">
          {form.isProcessing ? (
            <div className="flex items-center justify-center">
              <button className='action:button button:blue'>
                <Loaders.Circle className="h-5 w-5 animate-spin" />
              </button>
              <button className='ml-3 action:button button:red'>
                <Loaders.Circle className="h-5 w-5 animate-spin" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <button onClick={() => setSearch({ variant: variant.id.toString() })} className='action:button button:blue'>
                <Icons.Outline.Eye className={`h-5 w-5`} />
              </button>
              <button onClick={() => setIsTrashing(variant)} className='ml-3 action:button button:red'>
                <Icons.Outline.Trash className={`h-5 w-5`} />
              </button>
            </div>
          )}
        </td>
      </tr>
    )
  }

  function CreateVariant({ product }: { product: Product }) {
    const navigateTo = useNavigate()
    const form = useForm({ product_id: product.id, name: '', description: '', price: '' })

    function onKeyDown(e) {
      if (e.key === 'Enter') {
        form.post('variants').then(() => {
          navigateTo('')
          form.reset()
        })
      }
    }

    return <>
      <tr>
        <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900">
          <Input error={form.errors('name')} onKeyDown={onKeyDown} value={form.input.name} onChange={form.onChange('name')} type="text" variant="underlined" placeholder="Name *" />
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900">
          <Input error={form.errors('description')} onKeyDown={onKeyDown} value={form.input.description} onChange={form.onChange('description')} type="text" variant="underlined" placeholder="Description" />
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900">
          <Input error={form.errors('price')} onKeyDown={onKeyDown} value={form.input.price} onChange={form.onChange('price')} min={0} type="number" variant="underlined" placeholder="Price *" />
        </td>
        <td className="whitespace-nowrap px-4 py-2 text-sm font-medium text-gray-900 text-center">
          {form.isProcessing && (<button className='action:button button:red'><Loaders.Circle className="h-5 w-5 animate-spin" /></button>)}
        </td>
      </tr>
      {/* <tr>
        <td colSpan={4} className='px-4 pt-5'>
          <div className="flex items-center text-sm text-blue-500">
            <Icons.Outline.InformationCircle className='h-6 w-6 mr-2' /> To update or create the variable products simply enter/update the fields and press <b>"Enter"</b>
          </div>
        </td>
      </tr> */}
    </>
  }

  if (!!showVariable.id) {
    return <ShowProductVariant variant={showVariable} onClose={handleCloseVariantDetailEvent} />
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden bg-white shadow mt-10 relative">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Variants</h3>
          </div>
          <div className="flex-shrink-0">

          </div>
        </div>
      </div>
      <div className="pb-5">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 w-36">Price</th>
              <th scope="col" className="px-4 py-3.5 text-center text-sm font-semibold text-gray-900 w-28">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            <CreateVariant product={product} />
            {(product.variants ?? []).map((variant: Variant, index) => (<VariantRow variant={variant} key={index} />))}
          </tbody>
        </table>
      </div>
      <TrashModal
        show={!!isTrashing.id}
        title={'Delete Variant'}
        url={`/variants/${isTrashing.id}`}
        onDelete={handleDeleteVariantEvent}
        onClose={() => setIsTrashing({} as Variant)}
        description={<>Are you sure you want to delete "<b>{isTrashing.name}</b>"? This action cannot be undone.</>}
      />

    </div>
  )
}


function ShowProductVariant({ variant, onClose }: { variant: Variant, onClose: () => void }) {
  const navigateTo = useNavigate()
  const [categories, setCategories] = useState<Category[]>([])
  const [isTrashing, setIsTrashing] = useState(false)
  const [createCategory, setCreateCategory] = useState(false)

  function onDelete() {
    navigateTo('')
    onClose()
  }

  function onSuccess(category: Category) {
    setCreateCategory(false)
    setCategories(data => [...data, { ...category }])
  }

  useEffect(() => {
    setCategories(variant.categories ?? [])
  }, [variant])

  return <>{!!variant.id && (
    <div className="divide-y divide-gray-200 bg-white shadow mt-10 relative">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="flex items-center">
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              <span className='text-gray-600 hover:text-red-primary cursor-pointer' onClick={onClose}>Variants /</span> {variant.name}
            </h3>
          </div>
          <div className="flex items-center flex-shrink-0 gap-x-2">
            <button onClick={onClose} className="action:button button:blue">
              <Icons.Outline.XMark className="h-5" />
            </button>
            <Menu as="div" className="relative">
              <Menu.Button className={'action:button button:blue'}>
                <Icons.Outline.EllipsisVertical className="h-5" />
              </Menu.Button>
              <Menu.Items
                className={'absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'}>
                <Menu.Item as={'button'} onClick={() => setCreateCategory(true)}
                  className={`w-full flex items-center gap-x-2 text-gray-600 px-3 sm:px-4 py-2 hover:text-gray-700 hover:bg-gray-100 text-sm font-semibold`}>
                  <Icons.Outline.Plus className="w-5 h-5" /> Add Category
                </Menu.Item>

                <Menu.Item as={'button'} onClick={() => setIsTrashing(true)} className="w-full flex items-center gap-x-2 text-red-primary px-3 sm:px-4 py-2 hover:bg-red-100 uppercase text-sm font-semibold">
                  <Icons.Outline.Trash className="w-5 h-5" /> Delete
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
      <div>
        <div className="">
          <ul role="list" className="divide-y">
            {categories.map(category => (
              <li key={category.id} className="relative">
                <VariantCategory category={category} variant={variant} />
              </li>
            ))}
            {categories.length === 0 && (
              <li className='px-3 md:px-5 py-3 md:py-5'>
                <Alerts.Warning>No categories found for <b>{variant.name}</b> variant.</Alerts.Warning>
              </li>
            )}
          </ul>
        </div>
      </div>

      <CreateVariantCategory categories={categories} show={createCategory} variant={variant} onSuccess={onSuccess} onClose={() => setCreateCategory(false)} />

      <TrashModal
        show={isTrashing}
        onDelete={onDelete}
        title={'Delete Variant'}
        url={`/variants/${variant.id}`}
        onClose={() => setIsTrashing(false)}
        description={<>Are you sure you want to delete "<b>{variant.name}</b>"? This action cannot be undone.</>}
      />
    </div>
  )}</>
}

function VariantCategory({ category, variant }: { category: Category, variant: Variant }) {
  const [expand, setExpand] = useState<boolean>(false)
  const [ingredients, setIngredients] = useState<Ingredient[]>([] as Ingredient[])
  const [isTrashingIngredient, setIsTrashingIngredient] = useState<Ingredient>({} as Ingredient)

  useEffect(() => {
    setIngredients(variant.ingredients?.filter(ingredient => ingredient.meta.pivot_category_id === category.id) ?? [])
  }, [variant])

  function onSuccess(ingredient: Ingredient) {
    setIngredients(data => [...data, { ...ingredient, meta: { ...ingredient.meta, pivot_category_id: category.id } }])
  }

  function onDeleteAttribute() {
    setIngredients(ingredients.filter(({ id }) => id !== isTrashingIngredient.id))
    setIsTrashingIngredient({} as Ingredient)
  }

  return <>
    <div onClick={() => setExpand(!expand)}
      className={`w-full flex items-center justify-between space-x-4 hover:bg-gray-50 py-4 px-4 select-none cursor-pointer ${expand ? 'bg-gray-100' : ''}`}>
      <div className="flex items-center gap-x-3">
        <div className="flex-none rounded-full p-1 text-gray-500 bg-gray-100/10">
          <Icons.Outline.Tag className='w-4 h-4' />
        </div>
        <h2 className="min-w-0 text-sm font-semibold leading-6">
          <span className="truncate">{category.name}</span>
        </h2>
        <div
          className="rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset text-gray-400 bg-gray-400/10 ring-gray-400/20">
          {`${ingredients.length} Attribute${ingredients.length > 1 ? 's' : ''}`}
        </div>
      </div>

      {expand ? (
        <Icons.Solid.ChevronDown className="h-5 w-5 flex-none text-gray-400" />
      ) : (
        <Icons.Solid.ChevronRight className="h-5 w-5 flex-none text-gray-400" />
      )}

    </div>
    {expand && <>
      <div className="border-t p-4">
        <div className="flow-root">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="whitespace-nowrap px-2 pb-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th scope="col" className="whitespace-nowrap px-2 pb-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                  <th scope="col" className="whitespace-nowrap px-2 pb-3.5 text-left text-sm font-semibold text-gray-900 w-28">Unit</th>
                  <th scope="col" className="whitespace-nowrap px-2 pb-3.5 text-left text-sm font-semibold text-gray-900 w-24">Price</th>
                  <th scope="col" className="relative whitespace-nowrap pb-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className=" bg-white">
                <CreateVariantIngredientForm category={category} variant={variant} onSuccess={onSuccess} />
                {ingredients.map(ingredient => (
                  <VariantIngredientRow key={ingredient.id} category={category} ingredient={ingredient} variant={variant} onTrash={(t) => setIsTrashingIngredient(t)} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TrashModal
        title={'Delete Ingredient'}
        onDelete={onDeleteAttribute}
        show={isTrashingIngredient.id !== undefined}
        onClose={() => setIsTrashingIngredient({} as Ingredient)}
        url={`/ingredients/${isTrashingIngredient.id}/variant/${variant.id}`}
        description={<>Are you sure you want to delete "<b>{isTrashingIngredient.name}</b>"? This action cannot be undone.</>}
      />
    </>}
  </>
}

function CreateVariantCategory({ show, categories = [], variant, onClose, onSuccess }: { show: boolean, categories: Category[], variant: Variant, onSuccess: (category: Category) => void, onClose: () => void }) {
  const form = useForm({ name: '', description: '', totalItems: 0, order: categories.length, status: 'public' })

  useEffect(() => {
    form.set('order', categories.length)
  }, [categories])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    form.post(`variants/${variant.id}/categories`)
      .then(({ data }: { data: Category }) => {
        form.reset()
        onSuccess(data)
      })
      .catch(() => {

      })
  }

  return (
    <Modal show={show} className={'max-w-3xl'} onClose={onClose}>
      <Form onSubmit={onSubmit} className=''>
        <div className="overflow-hidden bg-white">
          <div className="px-4 py-5 sm:p-6 grid grid-cols-2 gap-5">
            <div className="col-span-2 relative">
              <label htmlFor="" className={'block text-sm font-medium leading-6 text-gray-900'}>
                Name <sup className='text-red-primary'>*</sup>
              </label>
              <Input type='text' value={form.value('name')} error={form.errors('name')} onChange={form.onChange('name')} className='w-full' />
            </div>
            <div className="col-span-2">
              <label htmlFor="" className={'block text-sm font-medium leading-6 text-gray-900'}>
                Description
              </label>
              <Input type="text" value={form.value('description')} onChange={form.onChange('description')} className='w-full' />
            </div>
            <div className="grid grid-cols-3 col-span-2 gap-3">
              <div className="">
                <label htmlFor="" className={'block text-sm font-medium leading-6 text-gray-900'}>
                  Items <span className='text-xs text-gray-500'>(included in product price)</span> <sup className='text-red-primary'>*</sup>
                </label>
                <Input type="number" min={0} value={form.value('totalItems')} onChange={form.onChange('totalItems')} className='w-full' />
              </div>
              <div className="">
                <label htmlFor="" className={'block text-sm font-medium leading-6 text-gray-900'}>
                  Order <sup className='text-red-primary'>*</sup>
                </label>
                <Input type="number" min={0} value={form.value('order')} onChange={form.onChange('order')} className='w-full' />
              </div>
              <div className="">
                <label htmlFor="" className={'block text-sm font-medium leading-6 text-gray-900'}>
                  Status <sup className='text-red-primary'>*</sup>
                </label>
                <select value={form.value('status')} onChange={form.onChange('status')}
                  className='w-full border-gray-200 focus:border-gray-500 focus:ring-4 focus:ring-gray-200'>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6 flex items-center gap-x-3 justify-end">
            <button onClick={onClose} type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              Close
            </button>
            <button
              className='rounded-md bg-red-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'>
              {form.isProcessing ? 'Saving...' : 'Add Category'}
            </button>
          </div>
        </div>
      </Form>
    </Modal>

  )
}

type CreateVariantIngredientFormProps = {
  variant: Variant,
  category: Category,
  onSuccess: (ingredient: Ingredient) => void
}

function CreateVariantIngredientForm({ variant, category, onSuccess }: CreateVariantIngredientFormProps) {
  const form = useForm({
    name: '',
    description: '',
    price: '',
    unit: '',
    quantity: 1,
    max_quantity: 1,
    min_quantity: 1,
    variant_id: variant.id,
    category_id: category.id,
  })

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      form.post('/ingredients').then(({ data }: { data: Ingredient }) => {
        onSuccess(data)
        form.reset()
      })
    }
  }

  return (
    <tr className='pb-2'>
      <td className="whitespace-nowrap p-2 text-sm font-medium text-gray-900 sm:pl-0">
        <Input type='text' defaultValue={form.value('name')} error={form.errors('name')} onChange={form.onChange('name')} onKeyDown={onKeyDown} variant='underlined' placeholder='Name *' />
      </td>
      <td className="whitespace-nowrap p-2 text-sm text-gray-900">
        <Input type='text' defaultValue={form.value('description')} error={form.errors('description')} onChange={form.onChange('description')} onKeyDown={onKeyDown} variant='underlined' placeholder='Description' />
      </td>
      <td className="whitespace-nowrap p-2 text-sm text-gray-900">
        <Select defaultValue={form.value('unit')} onChange={form.onChange('unit')} error={form.errors('unit')} onKeyDown={onKeyDown} variant='underlined' placeholder='Unit *'>
          <option value={''} disabled></option>
          <option>gr</option>
          <option>kg</option>
          <option>ml</option>
          <option>l</option>
          <option>units</option>
        </Select>
      </td>
      <td className="whitespace-nowrap p-2 text-sm text-gray-500">
        <Input type='number' min={0} defaultValue={form.value('price')} error={form.errors('price')} onChange={form.onChange('price')} onKeyDown={onKeyDown} variant='underlined' placeholder='Price *' />
      </td>
      <td className="whitespace-nowrap p-2 text-center sm:pr-0">
        {form.isProcessing && (<button className='action:button button:green'><Loaders.Circle className="h-5 w-5 animate-spin" /></button>)}
      </td>
    </tr>
  )
}

function VariantIngredientRow({ variant, ingredient, category, onTrash }: { ingredient: Ingredient, variant: Variant, category: Category, onTrash: (ingredient: Ingredient) => void }) {
  const form = useForm({
    category_id: category.id,
    variant_id: variant.id,
    name: ingredient.name,
    price: ingredient.meta.pivot_price ?? ingredient.price,
    unit: ingredient.unit,
    description: ingredient.description,
    quantity: ingredient.quantity,
    min_quantity: ingredient.minQuantity,
    max_quantity: ingredient.maxQuantity,
  })

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      form.put(`ingredients/${ingredient.id}`)
    }
  }
  return (
    <tr>
      <td className="whitespace-nowrap p-2 text-sm font-medium text-gray-900 sm:pl-0">
        <Input type='text' defaultValue={form.value('name')} onChange={form.onChange('name')} onKeyDown={onKeyDown} variant='underlined' placeholder='Name *' />
      </td>
      <td className="whitespace-nowrap p-2 text-sm text-gray-900">
        <Input type='text' defaultValue={form.value('description')} onChange={form.onChange('description')} onKeyDown={onKeyDown} variant='underlined' placeholder='Description' />
      </td>
      <td className="whitespace-nowrap p-2 text-sm text-gray-500">
        <Select defaultValue={form.value('unit')} onChange={form.onChange('unit')} onKeyDown={onKeyDown} variant='underlined' placeholder='Unit *'>
          <option value={''} disabled></option>
          <option>gr</option>
          <option>kg</option>
          <option>ml</option>
          <option>l</option>
          <option>units</option>
        </Select>
      </td>
      <td className="whitespace-nowrap p-2 text-sm text-gray-500">
        <Input type='number' min={0} defaultValue={form.value('price')} onChange={form.onChange('price')} onKeyDown={onKeyDown} variant='underlined' placeholder='Price *' />
      </td>
      <td className="whitespace-nowrap p-2 text-center sm:pr-0">
        {form.isProcessing ? (
          <button onClick={() => onTrash(ingredient)} type="button" className="action:button button:green">
            <Loaders.Circle className="h-5 w-5 animate-spin" />
          </button>
        ) : (
          <button onClick={() => onTrash(ingredient)} type="button" className="action:button button:red">
            <Icons.Outline.Trash className='w-5 h-5' />
          </button>
        )}
      </td>
    </tr>
  )
}
