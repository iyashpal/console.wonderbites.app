import {useFetch} from '~/hooks'
import Skeleton from './skeleton'
import {className} from '~/helpers'
import Pagination from '~/components/Pagination'
import {Menu, Transition} from '@headlessui/react'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {PaginationMeta, ProductsPaginationResponse} from '~/types'
import {Link, useLocation, useSearchParams} from 'react-router-dom'
import {EllipsisVerticalIcon} from "@heroicons/react/24/outline"
import {Product} from '@/types/models'
import IndexFilters from "@/components/IndexFilters";
import {BookmarkIcon, CurrencyDollarIcon, HashtagIcon, CalendarDaysIcon} from "@heroicons/react/24/outline";
import * as Index from "@/components/Index";
import * as Alert from "@/components/alerts";

const sortByFilters = [
  {label: 'ID', value: 'id', icon: <HashtagIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Date', value: 'date', icon: <CalendarDaysIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Name', value: 'name', icon: <BookmarkIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Price', value: 'price', icon: <CurrencyDollarIcon className="h-5 w-5" aria-hidden="true"/>},
]

export default function ListProducts() {

  const fetcher = useFetch()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [meta, setMeta] = useState<PaginationMeta>({} as PaginationMeta)

  const [checked, setChecked] = useState(false)
  const checkbox = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<Product[]>([])
  const [indeterminate, setIndeterminate] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [location])

  useLayoutEffect(() => {
    const isIndeterminate = selected.length > 0 && selected.length < products.length
    setChecked(selected.length === products.length)
    setIndeterminate(isIndeterminate)
    if (checkbox.current) {
      checkbox.current.indeterminate = isIndeterminate
    }
  }, [selected])

  /**
   * Toggle all checkboxes.
   *
   * @return void
   */
  function toggleAll() {
    setSelected(checked || indeterminate ? [] : products)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  /**
   * Fetch products from server.
   *
   * @returns void
   */
  function fetchProducts(): void {
    setIsLoading(true)
    fetcher.get('/products', {params: {page: searchParams.get('page') ?? 1}})
      .then(({data: response}: { data: ProductsPaginationResponse }) => {
        setIsLoading(false)
        setIsLoaded(true)
        setProducts(response.data)
        setMeta(response.meta)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }


  return <>
    {isLoaded ? (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Products'}]}/>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
          <IndexFilters create={{url: '/app/products/create', label: 'Add Product'}} sortBy={sortByFilters}/>
          <div className="">
            <div className="inline-block min-w-full align-middle">

              <div className="overflow-x-auto overflow-y-hidden">

                <table className="min-w-full table-fixed divide-y divide-gray-300 border">
                  <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" ref={checkbox} checked={checked} onChange={toggleAll}/>
                    </th>
                    <th scope="col" className="w-14 py-3.5 pr-3 text-center text-sm font-semibold text-gray-900 uppercase">
                      ID
                    </th>
                    <th scope="col" className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900 uppercase">
                      Product Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Price
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 uppercase">
                      Description
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 uppercase">
                      Image
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-center w-10 text-sm font-semibold text-gray-900 uppercase">
                      Action
                    </th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                  {isLoading ? <><TableRowsSkeleton/></> : <>
                    {products.map((person, index) => (
                      <tr key={index} className={selected.includes(person) ? 'bg-gray-50' : undefined}>
                        <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                          {selected.includes(person) && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600"/>)}
                          <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6" value={person.id} checked={selected.includes(person)} onChange={(e) => setSelected(
                            e.target.checked ? [...selected, person] : selected.filter((p) => p !== person)
                          )}
                          />
                        </td>
                        <td {...className('whitespace-nowrap py-3 pr-3 text-sm font-medium text-center', selected.includes(person) ? 'text-red-600' : 'text-gray-900')}>
                          {person.sku}
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          <Link to={`/app/products/${person.id}`}>
                            {person.name}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">{person.price}</td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500 truncate max-w-xs">
                          {person.description}
                        </td>
                        <td className="whitespace-nowrap text-center">
                          <div className={'rounded-full overflow-hidden group w-9 h-9 mx-auto relative cursor-pointer z-0'}>
                            <img className={'w-9 h-9 rounded-full'} src="/images/placeholder/square.svg" alt="Product Name"/>
                            <span className="hidden group-hover:flex items-center justify-center font-semibold text-xs absolute inset-0 text-white bg-gray-900/30">+4</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <Menu>
                            <Menu.Button>
                              <EllipsisVerticalIcon {...className('h-5 w-5')} />
                            </Menu.Button>
                            <Transition
                              enter="transition duration-100 ease-out"
                              enterFrom="transform scale-95 opacity-0"
                              enterTo="transform scale-100 opacity-100"
                              leave="transition duration-75 ease-out"
                              leaveFrom="transform scale-100 opacity-100"
                              leaveTo="transform scale-95 opacity-0"
                            >
                              <Menu.Items className="fixed right-0 mt-2 w-20 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
                                <Menu.Item>
                                  {({active}) => (
                                    <button className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center px-2 py-2 text-sm`}>
                                      Edit
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({active}) => (
                                    <button className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center px-2 py-2 text-sm`}>
                                      Delete
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({active}) => (
                                    <button className={`${active ? 'bg-red-primary text-white' : 'text-gray-900'} group flex w-full items-center px-2 py-2 text-sm`}>
                                      Disable
                                    </button>
                                  )}
                                </Menu.Item>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </td>
                      </tr>
                    ))}
                    {products.length === 0 && <>
                      <Index.Tr>
                        <Index.Td colSpan={11}>
                          <Alert.Warning>
                            No products available.{' '}
                            <Link to={'/app/products/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                              Click here to add more products.
                            </Link>
                          </Alert.Warning>
                        </Index.Td>
                      </Index.Tr>
                    </>}
                  </>}

                  </tbody>
                </table>
              </div>

            </div>
          </div>

          <Pagination meta={meta}/>
        </div>
      </div>
    ) : (<Skeleton.List.Page/>)}
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
      </tr>
    ))}
  </>
}
