import Skeleton from './skeleton'
import Icons from '~/helpers/icons'
import {useEffect, useState} from 'react'
import {Ingredient} from '~/contracts/schema'
import * as Alert from '~/components/alerts'
import {useDataLoader, useFlash} from '@/hooks'
import Pagination from '~/components/Pagination'
import TrashModal from '@/components/TrashModal'
import {MetaData} from '@/contracts/pagination'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {ListFilters, ListTable} from "@/components/page";
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom'

const columns = [
  {name: 'ID', options: {className: 'text-center'}},
  {name: 'Ingredient Name', options: {className: 'text-left'}},
  {name: 'UoM', options: {className: 'text-left'}},
  {name: 'QTY', options: {className: 'text-center'}},
  {name: 'MIN QTY', options: {className: 'text-center'}},
  {name: 'MAX QTY', options: {className: 'text-center'}},
  {name: 'Price', options: {className: 'text-center'}},
  {name: 'Category', options: {className: 'text-center'}},
  {name: 'Image', options: {className: 'text-center'}},
]
const sortByFilters = [
  {label: 'ID', value: 'id', icon: <Icons.Outline.Hashtag className={'w-5 h-5'}/>},
  {label: 'Name', value: 'name', icon: <Icons.Outline.Bookmark className={'w-5 h-5'}/>}
]

export default function ListIngredients() {
  const loader = useDataLoader<{ data: Ingredient[], meta: MetaData }>(`/ingredients`)
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()

  const [ingredient, setIngredient] = useState<Ingredient>({} as Ingredient)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  useEffect(() => {
    loader.sync({params: {page: searchParams.get('page') ?? 1}})
  }, [location, searchParams])

  function onDelete() {
    setIsTrashing(false)
    flash.set('ingredient_deleted', true)
    navigateTo('/app/ingredients')
  }

  function onClose() {
    setIsTrashing(false)
    setIngredient({} as Ingredient)
  }

  function toggleTrash(ingredient: Ingredient) {
    setIngredient(ingredient);
    setIsTrashing(true);
  }

  function ingredientCategory(ingredient, placeholder: string = '-') {
    let [category] = ingredient.categories

    return category?.id ? (
      <Link to={`/app/categories/${category.id}`} className={'text-red-primary'}>{category.name}</Link>
    ) : placeholder
  }

  return <>
    {loader.isProcessed() ?
      <>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <Breadcrumb pages={[{name: 'Ingredients'}]}/>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">

            {flash.get('ingredient_deleted') && <>
              <Alert.Success className={'mb-6'}>Ingredient deleted successfully</Alert.Success>
            </>}

            <ListFilters sortBy={sortByFilters} create={{url: '/app/ingredients/create', label: 'Add Ingredient'}}/>

            <ListTable
              thead={columns}

              tbody={loader.response.data.map(ingredient => ([
                ingredient.id,
                <Link to={`/app/ingredients/${ingredient.id}`} className={'text-red-primary'}> {ingredient.name} </Link>,
                ingredient.unit,
                ingredient.quantity,
                ingredient.minQuantity,
                ingredient.maxQuantity,
                `${ingredient.price}L`,
                ingredientCategory(ingredient),
                <img className={'w-9 h-9 rounded-full object-cover mx-auto border-2 shadow'} src={ingredient.thumbnailUrl} alt={ingredient.name}/>,
                <div className="flex item-center justify-center gap-x-1">
                  <Link to={`/app/ingredients/${ingredient.id}/edit`} className={'action:button button:blue'}>
                    <Icons.Outline.PencilSquare className={'w-5 h-5'}/>
                  </Link>

                  <Link to={`/app/ingredients/${ingredient.id}`} className={'action:button button:green'}>
                    <Icons.Outline.Eye className={'w-5 h-5'}/>
                  </Link>
                  <button onClick={() => toggleTrash(ingredient)} className={'action:button button:red'}>
                    <Icons.Outline.Trash className={'w-5 h-5'}/>
                  </button>
                </div>
              ]))}

              empty={(
                <Alert.Warning>
                  No ingredients available.{' '}
                  <Link to={'/app/ingredients/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                    Click here to add more ingredients.
                  </Link>
                </Alert.Warning>
              )}/>

            <Pagination meta={loader.response.meta}/>
          </div>
        </div>

        <TrashModal
          show={isTrashing}
          onClose={onClose}
          onDelete={onDelete}
          title={'Delete Ingredient'}
          url={`/ingredients/${ingredient.id}`}
          description={<>Are you sure you want to delete "<b>{ingredient.name}</b>"?</>}
        />
      </>

      : <Skeleton.List.Page/>}
  </>
}
