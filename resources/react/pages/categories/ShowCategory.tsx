import { Axios } from '@/helpers'
import { useFlash } from '@/hooks'
import React, { useState } from 'react'
import { Category } from '~/contracts/schema'
import { Details } from '@/components/Show'
import * as Alert from '@/components/alerts'
import TrashModal from '@/components/TrashModal'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import { useLoaderData, useNavigate } from 'react-router-dom'

export default function ShowCategory() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  const { category } = useLoaderData() as { category: Category }
  function onDelete() {
    flash.set('category_deleted', true)
    navigateTo('/app/categories')
  }

  function onCloseTrash() {
    setIsTrashing(false)
  }
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{ name: 'Categories', href: '/app/categories' }, { name: 'Category Detail' }]} />
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {flash.get('category_created') && <>
          <Alert.Success className={'mt-4'}>Category created successfully.</Alert.Success>
        </>}

        {flash.get('category_updated') && <>
          <Alert.Success className={'mt-4'}>Category updated successfully.</Alert.Success>
        </>}
        <div className="py-4">
          <Details
            module="Product"
            title={category.name}
            by={''}
            date={category.created_at}
            onEdit={() => navigateTo(`/app/categories/${category.id}/edit`)}
            onTrash={() => setIsTrashing(true)}
            fields={[
              { name: 'Name', value: category.name },
              { name: 'ID', value: category.id },
              { name: 'Type', value: category.type },
              { name: 'Parent', value: category?.category?.name ?? '-' },
              { name: 'Description', value: category.description, onModal: true },
              { name: 'Image', value: <img alt={category.name} src={category.thumbnail_url} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 ring-offset-1" /> },
              { name: 'Status', value: <span className='text-red-primary capitalize'>{category.status}</span> },
            ]}
          />

          <CheckoutItems category={category} />

          <TrashModal
            show={isTrashing}
            onDelete={onDelete}
            onClose={onCloseTrash}
            title={'Delete Category'}
            url={`/categories/${category.id}`}
            description={<>Are you sure you want to delete "<b>{category.name}</b>" category?</>}
          />
        </div>
      </div>
    </div>
  </>
}


function CheckoutItems({ category }: { category: Category }) {
  const [items, setItems] = useState(category.options?.extras ?? [
    { id: 'bread', type: 'freebies', title: 'Bread', checked: false },
    { id: 'setOfSpoonKnifeAndFork', type: 'freebies', title: 'Set of Spoon, Knife and Fork', checked: false },
    { id: 'chopsticks', type: 'freebies', title: 'Chopsticks', checked: false },
    { id: 'napkins', type: 'freebies', title: 'Napkins', checked: false },
  ])



  function onChangeState(event: React.ChangeEvent<HTMLInputElement>) {
    setItems(data => data.map(current => {
      if (current.id === event.target.value) {
        current.checked = event.target.checked
      }
      return current
    }))

    Axios().post(`/categories/${category.id}/extras`, {extras: items})
  }

  return (
    <div className='shadow-md p-4 sm:p-6 md:p-8 mt-4 bg-white'>
      <div>
        <label className="text-base font-semibold text-gray-900">Checkout Items</label>
        <p className="text-sm text-gray-500">Select all applicable checkout items for <b>{category.name}</b>?</p>
        <fieldset className="mt-4 border-t pt-4">
          <legend className="sr-only">Notification method</legend>
          <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
            {items.map(({ id, title, checked }) => (
              <div key={id} className="flex items-center">
                <input id={id} type="checkbox" defaultChecked={checked} value={id} onChange={onChangeState} className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600 rounded" />
                <label htmlFor={id} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                  {title}
                </label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>
    </div>

  )
}
