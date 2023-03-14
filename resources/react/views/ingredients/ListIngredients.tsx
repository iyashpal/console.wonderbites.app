import {useFetch} from '@/hooks'
import Skeleton from './skeleton'
import {classNames} from '@/helpers'
import {useEffect, useState} from 'react'
import {Ingredient} from '@/types/models'
import * as Index from '~/components/Index'
import * as Alert from '~/components/alerts'
import Pagination from '~/components/Pagination'
import {PaginatorMeta} from '@/types/paginators'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {Link, useLocation, useSearchParams} from 'react-router-dom'
import IngredientsPaginator from '@/types/paginators/IngredientsPaginator'
import {BookmarkIcon, EllipsisVerticalIcon, HashtagIcon} from '@heroicons/react/24/outline'

export default function ListIngredients() {
  const fetcher = useFetch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [meta, setMeta] = useState<PaginatorMeta>({} as PaginatorMeta)
  const [selected] = useState<number[]>([])

  useEffect(() => {
    fetchIngredients()
  }, [location])

  function fetchIngredients(): void {
    setIsLoading(true)
    fetcher.get('/ingredients', {params: {page: searchParams.get('page') ?? 1}})
      .then(({data: response}: { data: IngredientsPaginator }) => {
        setIsLoading(false)
        setIsLoaded(true)
        setIngredients(response.data)
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
          <Breadcrumb pages={[{name: 'Ingredients'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          <Index.Filters sortBy={[
            {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
            {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
          ]} create={{url: '/app/ingredients/create', label: 'Add Ingredient'}}/>

          <Index.Table>
            <Index.THead>
              <Index.Tr>
                <Index.ThCheck isChecked={false}/>
                <Index.Th>
                  ID
                </Index.Th>
                <Index.Th className={'text-left'}>
                  Ingredient Name
                </Index.Th>
                <Index.Th>
                  UoM
                </Index.Th>
                <Index.Th>
                  QTY
                </Index.Th>
                <Index.Th>
                  MIN QTY
                </Index.Th>
                <Index.Th>
                  MAX QTY
                </Index.Th>
                <Index.Th>
                  Price
                </Index.Th>
                <Index.Th>
                  Category
                </Index.Th>
                <Index.Th className={'text-center'}>
                  Image
                </Index.Th>
                <Index.Th>
                  Action
                </Index.Th>
              </Index.Tr>
            </Index.THead>

            <Index.TBody>
              {isLoading ? <><TableRowsSkeleton/></> : <>
                {ingredients.map(ingredient => <Index.Tr key={ingredient.id}>
                  <Index.TdCheck isChecked={false} onChange={(e) => selected.push(Number(e.target.value ?? 0))} value={1}/>
                  <Index.Td>
                    {ingredient.id}
                  </Index.Td>
                  <Index.Td className={'text-left'}>
                    <Link to={`/app/ingredients/${ingredient.id}/edit`}>
                      {ingredient.name}
                    </Link>
                  </Index.Td>
                  <Index.Td>
                    {ingredient.unit}
                  </Index.Td>
                  <Index.Td>
                    {ingredient.quantity}
                  </Index.Td>
                  <Index.Td>
                    {ingredient.minQuantity}
                  </Index.Td>
                  <Index.Td>
                    {ingredient.maxQuantity}
                  </Index.Td>
                  <Index.Td>
                    {ingredient.price}
                  </Index.Td>
                  <Index.Td>
                    Category
                  </Index.Td>
                  <Index.Td>
                    <img className={'w-9 h-9 rounded-full object-cover mx-auto'} src={ingredient.thumbnailUrl} alt={ingredient.name}/>
                  </Index.Td>
                  <Index.Td className={'text-center'}>
                    <button>
                      <EllipsisVerticalIcon {...classNames('h-5 w-5')} />
                    </button>
                  </Index.Td>
                </Index.Tr>)}
                {ingredients.length === 0 && <>
                  <Index.Tr>
                    <Index.Td colSpan={11}>
                      <Alert.Warning>
                        No ingredients available.{' '}
                        <Link to={'/app/ingredients/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                          Click here to add more ingredients.
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
      : <Skeleton.List.Page/>}
  </>
}


function TableRowsSkeleton() {
  return <>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(item => (
      <tr key={`${item}-skeleton`} className={'animate-pulse'}>
        <td className={'px-3 py-3 '}>
          <div className={'w-5 h-5 rounded-md bg-gray-200 mx-auto'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-full h-4 rounded-md bg-gray-200'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-full h-4 rounded-md bg-gray-200'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-full h-4 rounded-md bg-gray-200'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-full h-4 rounded-md bg-gray-200'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-8 h-8 rounded-full bg-gray-200 mx-auto'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-3 h-8 rounded-md bg-gray-200 mx-auto'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-3 h-8 rounded-md bg-gray-200 mx-auto'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-3 h-8 rounded-md bg-gray-200 mx-auto'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-3 h-8 rounded-md bg-gray-200 mx-auto'}></div>
        </td>
        <td className={'px-3 py-3 '}>
          <div className={'w-3 h-8 rounded-md bg-gray-200 mx-auto'}></div>
        </td>
      </tr>
    ))}
  </>
}
