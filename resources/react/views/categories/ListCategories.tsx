import {useFetch} from "@/hooks";
import {Category} from "~/types/models";
import {useEffect, useState} from "react";
import * as Index from '~/components/Index'
import * as Alert from '~/components/alerts'
import Pagination from '~/components/Pagination'
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {Link, useLocation, useSearchParams} from "react-router-dom";
import {CategoriesPaginator, PaginatorMeta} from "@/types/paginators";
import {ListPageSkeleton, TableRowsSkeleton} from "@/components/skeletons";
import {BookmarkIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";

export default function ListCategories() {
  const fetcher = useFetch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [meta, setMeta] = useState<PaginatorMeta>({} as PaginatorMeta)
  const [selected] = useState<number[]>([])

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

  return <>
    {isLoaded ?
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Categories'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          <Index.Filters sortBy={[
            {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
            {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
          ]} create={{url: '/app/categories/create', label: 'Add Category'}}/>

          <Index.Table>
            <Index.THead>
              <Index.Tr>
                <Index.ThCheck isChecked={false}/>
                <Index.Th>
                  ID
                </Index.Th>
                <Index.Th className={'text-left'}>
                  Category Name
                </Index.Th>
                <Index.Th>
                  Type
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
                  <Index.TdCheck isChecked={false} onChange={(e) => selected.push(Number(e.target.value ?? 0))} value={1}/>
                  <Index.Td>
                    {category.id}
                  </Index.Td>
                  <Index.Td className={'text-left'}>
                    <Link to={`/app/categories/${category.id}`}>
                      {category.name}
                    </Link>
                  </Index.Td>
                  <Index.Td>
                    {category.type}
                  </Index.Td>
                  <Index.Td className={'text-center'}>
                    <div className="flex item-center justify-center gap-x-1">
                      <Link to={`/app/categories/${category.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                        <PencilSquareIcon className={'w-5 h-5'}/>
                      </Link>

                      <Link to={`/app/cuisines/${category.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                        <EyeIcon className={'w-5 h-5'}/>
                      </Link>
                      <button className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
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
      : <ListPageSkeleton columns={[{label: 'ID'}, {label: 'Category Name'}, {label: 'Type', align: 'center'}]} limit={10}/>}
  </>
}
