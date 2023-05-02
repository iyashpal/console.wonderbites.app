import Icons from '~/helpers/icons'
import {Category} from '~/contracts/schema'
import {useEffect, useState} from 'react'
import * as Alert from '~/components/alerts'
import {useDataLoader, useFlash} from '@/hooks'
import Pagination from '~/components/Pagination'
import TrashModal from '@/components/TrashModal'
import {MetaData} from '@/contracts/pagination'
import {ListPageSkeleton} from '@/components/skeletons'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {ListFilters, ListTable} from "@/components/page";
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom'

const columns = [
  {name: 'ID', options: {className: 'text-center'}},
  {name: 'Category Name', options: {className: 'text-left'}},
  {name: 'PARENT', options: {className: 'text-left'}},
  {name: 'Group', options: {className: 'text-left'}},
  {name: 'Image', options: {className: 'text-center'}},
  {name: 'status', options: {className: 'text-left'}},
]

const sortByFilters = [
  {label: 'ID', value: 'id', icon: <Icons.Outline.Hashtag className={'w-5 h-5'}/>},
  {label: 'Name', value: 'name', icon: <Icons.Outline.Bookmark className={'w-5 h-5'}/>}
]

export default function ListCategories() {
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const [category, setCategory] = useState<Category>({} as Category)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const loader = useDataLoader<{ data: Category[], meta: MetaData }>(`/categories`)

  useEffect(() => {
    loader.sync({params: {page: searchParams.get('page') ?? 1}})
  }, [location, searchParams])

  function toggleTrash(category) {
    setCategory(category);
    setIsTrashing(!isTrashing);
  }

  function onDeleteCategory() {
    setIsTrashing(false)
    flash.set('category_deleted', true)
    navigateTo('/app/categories')
  }

  function onCloseTrash() {
    setIsTrashing(false)
    setCategory({} as Category)
  }

  return <>
    {loader.isProcessed() ? <>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Categories'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          {flash.get('category_deleted') && <>
            <Alert.Success className={'mb-6'}>Category deleted successfully</Alert.Success>
          </>}

          <ListFilters sortBy={sortByFilters} create={{url: '/app/categories/create', label: 'Add Category'}}/>

          <ListTable
            thead={columns}
            tbody={loader.response.data.map(category =>([
              category.id,
              <Link to={`/app/categories/${category.id}`}>
                {category.name}
              </Link>,
              category.parent ?? '-',
              category.type,
              <img className={'w-9 h-9 rounded-full mx-auto'} src={category.thumbnail_url} alt={category.name}/>,
              category.status ? <><span className={'text-red-primary'}>Active</span></> : 'In-active',
              <div className="flex item-center justify-center gap-x-1">
                <Link to={`/app/categories/${category.id}/edit`} className={'action:button button:blue'}>
                  <Icons.Outline.PencilSquare className={'w-5 h-5'}/>
                </Link>

                <Link to={`/app/categories/${category.id}`} className={'action:button button:green'}>
                  <Icons.Outline.Eye className={'w-5 h-5'}/>
                </Link>
                <button onClick={() => toggleTrash(category)} className={'action:button button:red'}>
                  <Icons.Outline.Trash className={'w-5 h-5'}/>
                </button>
              </div>
            ]))}
            empty={(
              <Alert.Warning>
                No categories available.{' '}
                <Link to={'/app/categories/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                  Click here to add more categories.
                </Link>
              </Alert.Warning>
            )}
          />

          <Pagination meta={loader.response.meta}/>
        </div>
      </div>
      <TrashModal
        show={isTrashing}
        onClose={onCloseTrash}
        onDelete={onDeleteCategory}
        title={'Delete Category'}
        url={`/categories/${category.id}`}
        description={<>Are you sure you want to delete "<b>{category.name}</b>" category?</>}
      />
    </> : <ListPageSkeleton columns={[{label: 'ID'}, {label: 'Category Name'}, {label: 'Type', align: 'center'}]} limit={10}/>}
  </>
}
