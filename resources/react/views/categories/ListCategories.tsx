import {Category} from '~/types/models'
import {useEffect, useState} from 'react'
import {useFetch, useFlash} from '@/hooks'
import * as Index from '~/components/Index'
import * as Alert from '~/components/alerts'
import Pagination from '~/components/Pagination'
import TrashModal from '@/components/TrashModal'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {CategoriesPaginator, PaginatorMeta} from '@/types/paginators'
import {ListPageSkeleton, TableRowsSkeleton} from '@/components/skeletons'
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import {BookmarkIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline'

export default function ListCategories() {
  const flash = useFlash()
  const fetcher = useFetch()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const [selected] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [category, setCategory] = useState<Category>({} as Category)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [meta, setMeta] = useState<PaginatorMeta>({} as PaginatorMeta)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchCategories()
  }, [location])

  function fetchCategories(): void {
    setIsLoading(true)
    fetcher.get('/categories', {params: {page: searchParams.get('page') ?? 1}})
      .then(({data: response}: { data: CategoriesPaginator }) => {
        setIsLoading(false)
        setIsLoaded(true)
        setCategories(response.data)
        setMeta(response.meta)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

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
    {isLoaded ? <>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Categories'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          {flash.get('category_deleted') && <>
            <Alert.Success className={'mb-6'}>Category deleted successfully</Alert.Success>
          </>}

          <Index.Filters sortBy={[
            {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
            {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
          ]} create={{url: '/app/categories/create', label: 'Add Category'}}/>

          <Index.Table>
            <Index.THead>
              <Index.Tr>
                <Index.ThCheck checked={false}/>
                <Index.Th>
                  ID
                </Index.Th>
                <Index.Th className={'text-left'}>
                  Category Name
                </Index.Th>
                <Index.Th>
                  Parent
                </Index.Th>
                <Index.Th className={'text-left'}>
                  Group
                </Index.Th>
                <Index.Th>
                  Image
                </Index.Th>
                <Index.Th>
                  Status
                </Index.Th>
                <Index.Th className={'w-24'}>
                  Action
                </Index.Th>
              </Index.Tr>
            </Index.THead>

            <Index.TBody>
              {isLoading ? <>
                <TableRowsSkeleton columns={[{label: 'ID'}, {label: 'Category Name'}, {label: 'Type'}]} limit={10}/>
              </> : <>
                {categories.map(category => <Index.Tr key={category.id}>
                  <Index.TdCheck checked={false} onChange={(e) => selected.push(Number(e.target.value ?? 0))} value={1}/>
                  <Index.Td>
                    {category.id}
                  </Index.Td>
                  <Index.Td className={'text-left'}>
                    <Link to={`/app/categories/${category.id}`}>
                      {category.name}
                    </Link>
                  </Index.Td>
                  <Index.Td>
                    {category.parent ?? '-'}
                  </Index.Td>
                  <Index.Td className={'text-left'}>
                    {category.type}
                  </Index.Td>
                  <Index.Td>
                    <img className={'w-9 h-9 rounded-full mx-auto'} src={category.thumbnail_url} alt={category.name} />
                  </Index.Td>
                  <Index.Td className={'font-semibold'}>
                    {category.status ? <><span className={'text-red-primary'}>Active</span></> : 'In-active'}
                  </Index.Td>
                  <Index.Td className={'text-center'}>
                    <div className="flex item-center justify-center gap-x-1">
                      <Link to={`/app/categories/${category.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                        <PencilSquareIcon className={'w-5 h-5'}/>
                      </Link>

                      <Link to={`/app/categories/${category.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                        <EyeIcon className={'w-5 h-5'}/>
                      </Link>
                      <button onClick={() => toggleTrash(category)} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                        <TrashIcon className={'w-5 h-5'}/>
                      </button>
                    </div>
                  </Index.Td>
                </Index.Tr>)}
                {categories.length === 0 && <>
                  <Index.Tr>
                    <Index.Td colSpan={5}>
                      <Alert.Warning>
                        No categories available.{' '}
                        <Link to={'/app/categories/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                          Click here to add more categories.
                        </Link>
                      </Alert.Warning>
                    </Index.Td>
                  </Index.Tr>
                </>}
              </>}
            </Index.TBody>
          </Index.Table>
          <Pagination meta={meta}/>
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
