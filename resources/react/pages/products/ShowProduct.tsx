import { useFlash } from '@/hooks'
import Icons from '@/helpers/icons'
import Modal from '@/components/Modal'
import Avatar from "@/components/Avatar";
import { Details } from '@/components/Show'
import * as Alerts from '@/components/alerts'
import * as Loaders from '~/components/loaders'
import TrashModal from '@/components/TrashModal'
import InputError from "@/components/Form/InputError";
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import { IngredientProduct } from '@/contracts/schema/pivot'
import { Combobox, Menu, Transition } from '@headlessui/react'
import CreateProductVariant from './partials/CreateProductVariant'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Attribute, Ingredient, Media, Product, Variant } from '~/contracts/schema'
import { useAttributeForm, useIngredientProductForm, useMediaProductForm } from '@/hooks/forms'
import { Form, useLoaderData, useLocation, useNavigate, useSearchParams } from 'react-router-dom'


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
          <Details
            module="Product"
            title={product.name}
            by={product?.user.name}
            date={product.created_at}
            onTrash={() => setIsTrashing(true)}
            onEdit={() => navigateTo(`/app/products/${product.id}/edit`)}
            fields={[
              { name: 'Name', value: product.name },
              { name: 'ID', value: product.id },
              { name: 'Cuisine', value: cuisine?.name ?? '-' },
              { name: 'Price', value: `${product.price}L` },
              { name: 'Category', value: category?.name ?? '-' },
              { name: 'Description', value: product.description, onModal: true },
              { name: 'Images', value: <ProductImages /> },
              { name: 'Type', value: product.type },
              { name: 'Status', value: <span className='capitalize'>{product.status}</span> }
            ]}
          />
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

  const [show, setShow] = useState(false)
  const form = useMediaProductForm({ attachment: '' })
  const { product } = useLoaderData() as { product: Product }
  const imageField = useRef<HTMLInputElement>(null)
  const [fileType, setFileType] = useState('image')

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
      <input onChange={form.input.onChange.update} className={'w-24 rounded border-gray-300 focus:ring-gray-500 focus:border-gray-500'} type="number" min={0} defaultValue={media.meta.pivot_order} />
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
      <button onClick={moveToTrash} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
        {form.isProcessing ? <Loaders.Circle className={'w-5 h-5 animate-spin'} /> : <Icons.Outline.Trash className={'w-5 h-5'} />}
      </button>
    )
  }

  return <>
    <div className="relative group">
      <Avatar className={'w-12 h-12 rounded-full'} src={product.thumbnail_url} alt={product.name} />

      <button onClick={() => setShow(true)} className="hidden group-hover:inline-flex group-hover:items-center group-hover:justify-center absolute top-0 left-0 w-12 h-12 rounded-full ring-2 ring-white bg-gray-900/70 hover:bg-gray-900/70 border-0 focus:outline-none text-white transition-colors ease-in-out duration-300">
        {product.media?.length === 0 ? <Icons.Outline.Plus className={'inline-flex h-5 w-5'} /> : `+${product.media?.length}`}
      </button>
    </div>

    <Modal show={show} className={'max-w-3xl divide-y'} onClose={() => setShow(false)}>
      <div className={'p-3 sm:p-4 flex items-center justify-between'}>
        <div>
          <h3 className={'font-semibold'}>Images</h3>
        </div>

        <button onClick={() => setShow(false)}>
          <Icons.Outline.XMark className={'w-5 h-5'} />
        </button>
      </div>
      <div className="flow-root">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr className="divide-x divide-gray-200">
                  <th scope="col" className="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 w-28">Preview</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Caption</th>
                  <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 ">Order</th>
                  <th scope="col" className="py-3.5 pl-4 pr-4 text-center text-sm font-semibold text-gray-900 sm:pr-0">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {product.media?.map((media, index) => {
                  return (
                    <tr key={index} className="divide-x divide-gray-200">

                      <td className="whitespace-nowrap py-2 px-4 text-sm font-medium text-gray-900">
                        <img src={media.attachment_url} alt={media.title} className={'h-10 aspect-video object-cover rounded-md'} />
                      </td>

                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        {media.title}
                      </td>

                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        <MediaOrder media={media} />
                      </td>

                      <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-0">
                        <div className="flex item-center justify-center gap-x-1">
                          <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
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
                      <select defaultValue={fileType} onChange={(e) => setFileType(e.target.value)} className={'py-1.5 bg-white text-sm border-0 focus:border-0 focus:outline-none focus:ring-0'}>
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
    </Modal>
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
              <button type="button" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
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
                      <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
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
            <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
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

function IngredientRow({ ingredient, onTrash }: { ingredient: IngredientProduct, onTrash: (ingredient: IngredientProduct) => void }) {
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

  return <tr>
    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
      <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
    </th>

    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8">
      {ingredient.name}
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      {ingredient.id}
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      <input onChange={onChangeQuantity} defaultValue={ingredient.meta.pivot_quantity} type="number" name="" id="" className={'w-20 border border-gray-300 rounded-md focus:outline-none active:outline-none focus:ring-red-primary focus:border-red-primary'} />
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      <input onChange={onChangePrice} defaultValue={ingredient.meta.pivot_price} type="number" name="" id="" className={'w-20 border border-gray-300 rounded-md focus:outline-none active:outline-none focus:ring-red-primary focus:border-red-primary'} />
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      {resolveCategoryName(ingredient)}
    </td>
    <td className="px-3 py-4 text-sm text-gray-500 text-center">
      <input onChange={onChangeAddable} type="checkbox" value={1} defaultChecked={ingredient.meta.pivot_is_required} className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4" />
    </td>
    <td className="px-3 py-4 text-sm text-gray-500 text-center">
      <input onChange={onChangeRemovable} type="checkbox" value={1} defaultChecked={ingredient.meta.pivot_is_optional} className="border-gray-300 focus:ring-red-primary h-4 rounded text-red-600 w-4" />
    </td>
    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
      <img alt={ingredient.name} src={ingredient.thumbnailUrl} className="w-10 h-10 rounded-full border-2 shadow-md" />
    </td>
    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 lg:pr-8">
      <div className="flex item-center justify-center gap-x-1">
        <button onClick={() => onTrash(ingredient)} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
          <Icons.Outline.Trash className={'w-5 h-5'} />
        </button>
      </div>
    </td>
  </tr>
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
            <div className="relative w-full cursor-default overflow-hidden bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Button className="absolute inset-y-0 left-0 flex items-center">
                <Icons.Outline.MagnifyingGlass className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </Combobox.Button>
              <Combobox.Input placeholder={'Search Ingredient'} displayValue={(ingredient: Ingredient) => ingredient.name} onChange={(event) => setQuery(event.target.value)} className="w-full border-none py-4 px-10 text-sm leading-5 text-gray-900 focus:ring-0" />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <Icons.Outline.ChevronUpDown className="h-5 w-5 text-gray-400 " aria-hidden="true" />
              </Combobox.Button>
            </div>
            <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0" afterLeave={() => setQuery('')}>
              <Combobox.Options className="absolute bottom-14 mt-1 max-h-60 w-full overflow-auto bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filtered.length === 0 ? (
                  <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                    Nothing found.
                  </div>
                ) : (
                  filtered.map((ingredient, index) => (
                    <Combobox.Option value={ingredient} key={index} className={({ active }) => `relative cursor-pointer select-none py-2 px-4 ${active ? 'bg-gray-100' : 'text-gray-900'}`}>
                      {({ selected }) => (
                        <>
                          <div className="flex items-center">
                            <img src={ingredient.thumbnailUrl} alt="" className="h-5 w-5 flex-shrink-0 rounded-md border-2" />
                            <span className={`${selected ? 'font-semibold' : 'font-normal'} ml-3 block truncate'`}>
                              {ingredient.name} {(!!ingredient?.categories?.length) && <span className={'text-gray-400 font-light'}>({resolveCategoryName(ingredient)})</span>}
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
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false)
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

  if (!!showVariable.id) {
    return <ShowProductVariant product={product} variant={showVariable} onClose={handleCloseVariantDetailEvent} />
  }

  return (
    <div className="divide-y divide-gray-200 overflow-hidden bg-white shadow mt-10 relative">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="">
            <h3 className="text-base font-semibold leading-6 text-gray-900">Variants</h3>
          </div>
          <div className="flex-shrink-0">
            <Menu as="div" className="relative">
              <Menu.Button className={'action:button button:blue'}>
                <Icons.Outline.EllipsisVertical className="h-6" />
              </Menu.Button>
              <Menu.Items className={'absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden'}>
                <Menu.Item as={'button'} onClick={() => setShowCreateForm(true)} className={`w-full flex items-center gap-x-2 text-gray-600 px-3 sm:px-4 py-2 hover:text-gray-700 hover:bg-gray-100 text-sm font-semibold`}>
                  <Icons.Outline.Plus className="w-5 h-5" /> Add New
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        </div>
      </div>
      <div className="">
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 w-36">Proteins</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 w-36">Vegetables</th>
              <th scope="col" className="px-4 py-3.5 text-left text-sm font-semibold text-gray-900 w-36">Price</th>
              <th scope="col" className="px-4 py-3.5 text-center text-sm font-semibold text-gray-900 w-28">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {(product.variants ?? []).map((variant: Variant, index: number) => (
              <tr key={index} className='relative overflow-hidden'>
                <td className="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900">
                  <div className="font-medium text-gray-900">{variant.name}</div>
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  <div className="relative">
                    <input type="number" defaultValue={variant.meta.pivot_proteins} className={'peer block w-full border-0 focus-within:bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6'} />
                    <div className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-slate-600" aria-hidden="true" />
                  </div>
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  <div className="relative">
                    <input type="number" defaultValue={variant.meta.pivot_vegetables} className={'peer block w-full border-0 focus-within:bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6'} />
                    <div className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-slate-600" aria-hidden="true" />
                  </div>
                </td>
                <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                  <div className="relative">
                    <input type="number" defaultValue={variant.meta.pivot_price} className={'peer block w-full border-0 focus-within:bg-gray-50 py-1.5 text-gray-900 focus:ring-0 sm:text-sm sm:leading-6'} />
                    <div className="absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-slate-600" aria-hidden="true" />
                  </div>
                </td>

                <td className="p-4">
                  <div className="flex items-center justify-center">
                    <button onClick={() => setSearch({ variant: variant.id.toString() })} className='action:button button:blue'>
                      <Icons.Outline.Eye className={`h-5 w-5`} />
                    </button>

                    <button onClick={() => setIsTrashing(variant)} className='ml-3 action:button button:red'>
                      <Icons.Outline.Trash className={`h-5 w-5`} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {product.variants?.length === 0 && <>
              <tr>
                <td colSpan={6} className="whitespace-nowrap py-4 px-4 text-sm font-medium">
                  <Alerts.Warning>No data available.</Alerts.Warning>
                </td>
              </tr>
            </>}
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
      <CreateProductVariant product={product} open={showCreateForm} onClose={() => setShowCreateForm(false)} />
    </div>
  )
}


function ShowProductVariant({ product, variant, onClose }: {product: Product, variant: Variant, onClose: () => void }) {
  const navigateTo = useNavigate()
  const [isTrashing, setIsTrashing] = useState(false)
  const [isTrashingAttribute, setIsTrashingAttribute] = useState<Attribute>({} as Attribute)
  const [attributes, setAttributes] = useState<Attribute[]>([] as Attribute[])
  useEffect(() => {
    setAttributes(variant.attributes ?? [])
  }, [variant])
  function onDelete() {
    navigateTo('')
    onClose()
  }

  function onDeleteAttribute() {
    setAttributes(attributes.filter(({ id }) => id !== isTrashingAttribute.id))
    setIsTrashingAttribute({} as Attribute)
  }

  function onSuccess(attribute: Attribute) {
    setAttributes(data => [...data, { ...attribute }])
  }

  return <>{!!variant.id && (
    <div className="divide-y divide-gray-200 overflow-hidden bg-white shadow mt-10 relative">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between sm:flex-nowrap">
          <div className="">
            <div className="flex items-center">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                <span className='text-gray-400'>{product.name} /</span> {variant.name}
              </h3>
            </div>
          </div>
          <div className="flex flex-shrink-0 gap-x-2">

            <button onClick={onClose} className="inline-flex items-center action:button button:blue px-4 text-sm uppercase font-medium">
              <Icons.Outline.ArrowLongLeft className="h-5" /> Back
            </button>
            <Menu as="div" className="relative">
              <Menu.Button className={'action:button button:blue'}>
                <Icons.Outline.EllipsisVertical className="h-6" />
              </Menu.Button>
              <Menu.Items className={'absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'}>
                <Menu.Item as={'button'} className={`w-full flex items-center gap-x-2 text-gray-600 px-3 sm:px-4 py-2 hover:text-gray-700 hover:bg-gray-100 text-sm font-semibold`}>
                  <Icons.Outline.Plus className="w-5 h-5" /> Add Group
                </Menu.Item>
                <Menu.Item as={'button'} className={`w-full flex items-center gap-x-2 text-gray-600 px-3 sm:px-4 py-2 hover:text-gray-700 hover:bg-gray-100 text-sm font-semibold`}>
                  <Icons.Outline.PencilSquare className="w-5 h-5" /> Modify
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
        <CreateAttributeForm variant={variant} onSuccess={onSuccess} />
        <div className="flow-root border-t">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase w-10">ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase w-24">Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">Category</th>
                    <th scope="col" className="py-3.5 pl-3 pr-4 sm:pr-6 lg:pr-8 text-center text-sm font-semibold text-gray-900 uppercase w-14">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {attributes.map(attribute => (
                    <tr key={attribute.id}>
                      <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                        <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" />
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">{attribute.id}</td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">{attribute.name}</td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">{attribute.price}</td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">-</td>
                      <td className="whitespace-nowrap p-4 text-sm text-gray-500">
                        <div className="flex item-center justify-end gap-x-1">
                          <button className="action:button button:blue">
                            <Icons.Outline.PencilSquare className="w-5 h-5" />
                          </button>
                          <button onClick={() => setIsTrashingAttribute(attribute)} className="action:button button:red">
                            <Icons.Outline.Trash className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {(attributes.length === 0) && (
                    <tr>
                      <td colSpan={6} className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <Icons.Solid.ExclamationTriangle className="h-5 w-5 text-yellow-400" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700">No attributes available.</p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <TrashModal
        title={'Delete Attribute'}
        onDelete={onDeleteAttribute}
        show={isTrashingAttribute.id !== undefined}
        url={`/attributes/${isTrashingAttribute.id}`}
        onClose={() => setIsTrashingAttribute({} as Attribute)}
        description={<>Are you sure you want to delete "<b>{isTrashingAttribute.name}</b>"? This action cannot be undone.</>}
      />
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

type CreateAttributeFormProps = {
  variant: Variant,
  onSuccess: (attribute: Attribute) => void
}
function CreateAttributeForm({ variant, onSuccess }: CreateAttributeFormProps) {
  type AttributeFormType = { variant_id: number, name: string, description: string, price: string, category_id: number }
  const [showForm, setShowForm] = useState(false)
  const form = useAttributeForm<AttributeFormType>({ variant_id: variant.id } as AttributeFormType)

  function onSubmit(event) {
    form.onSubmit.store(event).then((data: Attribute) => {
      onSuccess(data)
      setShowForm(false)
    })
  }
  return (
    <div className="relative">
      <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-x-1 text-sm pl-4 my-3 sm:pl-6 bg-white px-2 font-semibold text-red-600">
        <span>Add New Attribute</span>
        {showForm ? <Icons.Outline.ChevronDown className="w-4 h-4" /> : <Icons.Outline.ChevronRight className="w-4 h-4" />}
      </button>
      {showForm && (
        <Form onSubmit={onSubmit}>
          <div className="bg-white px-4 pb-5 sm:px-6">
            <div className="flex gap-x-3">
              <div className="flex-1 relative">
                <input value={form.data.name} onChange={form.onChange('name')} className="block w-full border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" type="text" placeholder="Name *" />
                <InputError error={form.errors.name} />
              </div>
              <div className="flex-1 relative">
                <input value={form.data.description} onChange={form.onChange('description')} className="block w-full border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" type="text" placeholder="Description" />
                <InputError error={form.errors.description} />
              </div>
              <div className="flex-1 relative">
                <input value={form.data.price} onChange={form.onChange('price')} className="block w-full border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" type="number" placeholder="Price *" />
                <InputError error={form.errors.price} />
              </div>
              <div className="shrink-0">
                <button type="submit" className="inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2.5 text-sm font-medium leading-4 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                  Add Attribute
                </button>
              </div>
            </div>
          </div>
        </Form>
      )}

    </div>
  )
}
