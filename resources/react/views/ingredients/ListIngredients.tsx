import {useFlash} from '@/hooks'
import Skeleton from './skeleton'
import {Ingredient} from '@/types/models'
import * as Index from '~/components/Index'
import * as Alert from '~/components/alerts'
import Pagination from '~/components/Pagination'
import TrashModal from '@/components/TrashModal'
import {PaginatorMeta} from '@/types/paginators'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {TableRowsSkeleton} from '@/components/skeletons'
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom'
import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import IngredientsPaginator from '@/types/paginators/IngredientsPaginator'
import {BookmarkIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline'
import {Axios} from "@/helpers";

export default function ListIngredients() {
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()

  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [meta, setMeta] = useState<PaginatorMeta>({} as PaginatorMeta)
  const [ingredients, setIngredients] = useState<Ingredient[]>([])

  const [checked, setChecked] = useState(false)
  const checkbox = useRef<HTMLInputElement>(null)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selected, setSelected] = useState<Ingredient[]>([])

  const [ingredient, setIngredient] = useState<Ingredient>({} as Ingredient)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  useEffect(() => {
    fetchIngredients()
  }, [location])

  useLayoutEffect(() => {
    setChecked(selected.length === ingredients.length)
    setIndeterminate(selected.length > 0 && selected.length < ingredients.length)
    if (checkbox.current) {
      checkbox.current.indeterminate = indeterminate
    }
  }, [selected])

  function fetchIngredients(): void {
    setIsLoading(true)
    Axios().get('/ingredients', {params: {page: searchParams.get('page') ?? 1}})
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


  /**
   * Toggle all checkboxes.
   *
   * @return void
   */
  function toggleAll() {
    setSelected(checked || indeterminate ? [] : ingredients)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  function onDelete() {
    setIsTrashing(false)
    flash.set('ingredient_deleted', true)
    navigateTo('/app/ingredients')
  }

  function onClose() {
    setIsTrashing(false)
    setIngredient({} as Ingredient)
  }

  function ingredientCategory(ingredient) {
    let [category] = ingredient.categories

    if (category.id) {
      return (<Link to={`/app/categories/${category.id}`} className={'text-red-primary'}>{category.name}</Link>)
    }
    return '-'
  }

  return <>
    {isLoaded ?
      <>
        <div className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <Breadcrumb pages={[{name: 'Ingredients'}]}/>
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">

            {flash.get('ingredient_deleted') && <>
              <Alert.Success className={'mb-6'}>Ingredient deleted successfully</Alert.Success>
            </>}

            <Index.Filters sortBy={[
              {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
              {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
            ]} create={{url: '/app/ingredients/create', label: 'Add Ingredient'}}/>

            <Index.Table>
              <Index.THead>
                <Index.Tr>
                  <Index.ThCheck checked={checked} ref={checkbox} onChange={toggleAll}/>
                  <Index.Th>ID</Index.Th>
                  <Index.Th className={'text-left'}>Ingredient Name</Index.Th>
                  <Index.Th> UoM </Index.Th>
                  <Index.Th> QTY </Index.Th>
                  <Index.Th> MIN QTY </Index.Th>
                  <Index.Th> MAX QTY </Index.Th>
                  <Index.Th> Price </Index.Th>
                  <Index.Th className={"text-left"}> Category </Index.Th>
                  <Index.Th className={'text-center'}> Image </Index.Th>
                  <Index.Th> Action </Index.Th>
                </Index.Tr>
              </Index.THead>

              <Index.TBody>
                {isLoading ? <>
                  <TableRowsSkeleton limit={10} actions={true} checkboxes={true} columns={[
                    {label: ''}, {label: ''}, {label: ''}, {label: ''}, {label: ''}, {label: ''}, {label: ''}, {label: ''}, {label: ''},
                  ]}/>
                </> : <>
                  {ingredients.map(ingredient => (
                    <Index.Tr key={ingredient.id}>
                      <Index.TdCheck checked={selected.includes(ingredient)} onChange={(e) => setSelected(
                        e.target.checked ? [...selected, ingredient] : selected.filter((i) => i !== ingredient)
                      )} value={ingredient.id}/>
                      <Index.Td> {ingredient.id} </Index.Td>
                      <Index.Td className={'text-left'}>
                        <Link to={`/app/ingredients/${ingredient.id}`} className={'text-red-primary'}> {ingredient.name} </Link>
                      </Index.Td>
                      <Index.Td> {ingredient.unit} </Index.Td>
                      <Index.Td> {ingredient.quantity} </Index.Td>
                      <Index.Td> {ingredient.minQuantity} </Index.Td>
                      <Index.Td> {ingredient.maxQuantity} </Index.Td>
                      <Index.Td> {ingredient.price}L </Index.Td>
                      <Index.Td className={"text-left"}> {ingredientCategory(ingredient)} </Index.Td>
                      <Index.Td>
                        <img className={'w-9 h-9 rounded-full object-cover mx-auto border-2 shadow'} src={ingredient.thumbnailUrl} alt={ingredient.name}/>
                      </Index.Td>
                      <Index.Td className={'text-center'}>
                        <div className="flex item-center justify-center gap-x-1">
                          <Link to={`/app/ingredients/${ingredient.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                            <PencilSquareIcon className={'w-5 h-5'}/>
                          </Link>

                          <Link to={`/app/ingredients/${ingredient.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                            <EyeIcon className={'w-5 h-5'}/>
                          </Link>
                          <button onClick={() => {
                            setIngredient(ingredient);
                            setIsTrashing(true);
                          }} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                            <TrashIcon className={'w-5 h-5'}/>
                          </button>
                        </div>
                      </Index.Td>
                    </Index.Tr>
                  ))}
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
