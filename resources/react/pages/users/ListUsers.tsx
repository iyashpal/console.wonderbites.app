import {DateTime} from 'luxon'
import Icons from '~/helpers/icons'
import {User} from '~/contracts/schema'
import {useEffect, useState} from 'react'
import * as Alert from '@/components/alerts'
import {MetaData} from '@/contracts/pagination'
import Pagination from '@/components/Pagination'
import TrashModal from '@/components/TrashModal'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {ListFilters, ListTable} from '@/components/page'
import {useDataLoader, useFlash, useSelector} from '@/hooks'
import {Link, useLocation, useNavigate, useSearchParams} from 'react-router-dom'

const columns = [
  {name: 'ID', options: {className: 'text-center'}},
  {name: 'Name', options: {className: 'text-left'}},
  {name: 'Role', options: {className: 'text-left'}},
  {name: 'Email', options: {className: 'text-left'}},
  {name: 'Created On', options: {className: 'text-left'}},
  {name: 'status', options: {className: 'text-left'}},
]

const sortByFilters = [
  {label: 'ID', value: 'id', icon: <Icons.Outline.Hashtag className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Date', value: 'date', icon: <Icons.Outline.CalendarDays className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Name', value: 'name', icon: <Icons.Outline.Bookmark className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Email', value: 'email', icon: <Icons.Outline.Envelope className="h-5 w-5" aria-hidden="true"/>},
]

export default function ListUsers() {
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const loader = useDataLoader<{ data: User[], meta: MetaData }>(`/users`)
  const {user: authUser} = useSelector(state => state.authSlice)

  const [user, setUser] = useState<User>({} as User)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  useEffect(() => {
    loader.sync({params: {page: searchParams.get('page') ?? 1}})
  }, [searchParams, location])

  function toggleTrash(o: User) {
    setUser(o)
    setIsTrashing(true)
  }

  function onDelete() {
    setIsTrashing(false)
    flash.set('user_deleted', true)
    navigateTo(location)
  }

  function onCloseTrash() {
    setIsTrashing(false)
    setUser({} as User)
  }

  return <>
    {loader.isProcessed() && (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Users'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
          <ListFilters sortBy={sortByFilters} create={{url: '/app/users/create', label: 'Create User'}}/>

          <ListTable
            thead={columns}
            tbody={loader.response.data.map(user => ([
              user.id,
              user.name,
              user.role?.title,
              user.email,
              user.created_at ? DateTime.fromISO(user.created_at).toLocaleString(DateTime.DATETIME_SHORT) : '-',
              user.status === 1 ? 'Active' : 'In-active',
              <div className="flex item-center justify-center gap-x-1">
                <Link to={`/app/users/${user.id}/edit`} className={'action:button button:blue'}>
                  <Icons.Outline.PencilSquare className={'w-5 h-5'}/>
                </Link>

                <Link to={`/app/users/${user.id}`} className={'action:button button:green'}>
                  <Icons.Outline.Eye className={'w-5 h-5'}/>
                </Link>

                {authUser?.id !== user.id ? (
                  <button onClick={() => toggleTrash(user)} className={'action:button button:red'}>
                    <Icons.Outline.Trash className={'w-5 h-5'}/>
                  </button>
                ) : (
                  <button disabled className={'action:button button:disabled'}>
                    <Icons.Outline.Trash className={'w-5 h-5'}/>
                  </button>
                )}
              </div>
            ]))}

            empty={(
              <Alert.Warning>
                No users available.{' '}
                <Link to={'/app/users/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                  Click here to add more users.
                </Link>
              </Alert.Warning>
            )}
          />

          <Pagination meta={loader.response.meta}/>
        </div>
      </div>
    )}


    <TrashModal
      show={isTrashing}
      title={'Delete User'}
      url={`/users/${user.id}`}
      description={<>Are you sure you want to delete "<b>{user.first_name}</b>"?</>}
      onDelete={onDelete}
      onClose={onCloseTrash}
    />
  </>
}
