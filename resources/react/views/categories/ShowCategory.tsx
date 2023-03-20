import {useFlash} from '@/hooks'
import React, {useState} from 'react'
import {Category} from '@/types/models'
import {Details} from '@/components/Show'
import * as Alert from '@/components/alerts'
import TrashModal from '@/components/TrashModal'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {useLoaderData, useNavigate} from 'react-router-dom'

export default function ShowCategory() {
  const flash = useFlash()
  const navigateTo = useNavigate()
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  const {category} = useLoaderData() as { category: Category }
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
        <Breadcrumb pages={[{name: 'Categories', href: '/app/categories'}, {name: 'Category Detail'}]}/>
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
              {name: 'Name', value: category.name},
              {name: 'ID', value: category.id},
              {name: 'Type', value: category.type},
              {name: 'Parent', value: category?.category?.name ?? '-'},
              {name: 'Description', value: category.description, onModal: true},
              {name: 'Image', value: <img alt={category.name} src={category.thumbnail_url} className="w-10 h-10 rounded-full"/>}
            ]}
          />

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
