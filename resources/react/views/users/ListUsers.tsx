import {DateTime} from 'luxon'
import {useState} from 'react'
import {User} from '@/types/models'
import * as Index from '@/components/Index'
import * as Alert from '@/components/alerts'
import {useFlash, useSelector} from '@/hooks'
import {UserPaginator} from '@/types/paginators'
import Pagination from '@/components/Pagination'
import TrashModal from '@/components/TrashModal'
import IndexFilters from '@/components/IndexFilters'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import {Link, useLoaderData, useLocation, useNavigate} from 'react-router-dom'
import {BookmarkIcon, CalendarDaysIcon, EnvelopeIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline'

const sortByFilters = [
  {label: 'ID', value: 'id', icon: <HashtagIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Date', value: 'date', icon: <CalendarDaysIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Name', value: 'name', icon: <BookmarkIcon className="h-5 w-5" aria-hidden="true"/>},
  {label: 'Email', value: 'email', icon: <EnvelopeIcon className="h-5 w-5" aria-hidden="true"/>},
]

export default function ListUsers() {
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const {user: authUser} = useSelector(state => state.authSlice)
  const {data: users, meta} = useLoaderData() as UserPaginator

  const [user, setUser] = useState<User>({} as User)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

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
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Users'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
        <IndexFilters create={{url: '/app/users/create', label: 'Create User'}} sortBy={sortByFilters}/>
        <Index.Table>
          <Index.THead>
            <Index.Tr className={'shadow-inner'}>
              <Index.ThCheck checked={false}/>
              <Index.Th className={'text-left'}>
                Name
              </Index.Th>
              <Index.Th className={'text-left'}>
                Role
              </Index.Th>
              <Index.Th className={'text-left'}>
                Email
              </Index.Th>
              <Index.Th className={'text-left'}>
                Created On
              </Index.Th>
              <Index.Th className={'text-left'}>
                Status
              </Index.Th>
              <Index.Th className={'w-24'}>
                Action
              </Index.Th>
            </Index.Tr>
          </Index.THead>

          <Index.TBody>
            {users.map((user, index) => (
              <Index.Tr key={index}>
                <Index.TdCheck/>
                <Index.Td className={"inline-flex items-center gap-x-1"}>
                  <img alt={user.name} src={user.avatar_url} className={'w-8 h-8 rounded-full'}/> {user.name}
                </Index.Td>
                <Index.Td>
                  {user.role?.title}
                </Index.Td>
                <Index.Td>
                  {user.email}
                </Index.Td>
                <Index.Td>
                  {DateTime.fromISO(user.created_at).toLocaleString(DateTime.DATETIME_SHORT)}
                </Index.Td>
                <Index.Td className={`uppercase text-xs font-semibold ${user.status === 1 ? 'text-red-primary' : 'text-gray-600'}`}>
                  {user.status === 1 ? 'Active' : 'In-active'}
                </Index.Td>
                <Index.Td>
                  <div className="flex item-center justify-center gap-x-1">
                    <Link to={`/app/users/${user.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                      <PencilSquareIcon className={'w-5 h-5'}/>
                    </Link>

                    <Link to={`/app/users/${user.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                      <EyeIcon className={'w-5 h-5'}/>
                    </Link>

                    {authUser?.id !== user.id ? (
                      <button onClick={() => toggleTrash(user)} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                        <TrashIcon className={'w-5 h-5'}/>
                      </button>
                    ) : (
                      <button className={'bg-gray-50 border border-gray-200 text-gray-300 rounded-lg p-1 cursor-not-allowed'}>
                        <TrashIcon className={'w-5 h-5'}/>
                      </button>
                    )}

                  </div>
                </Index.Td>
              </Index.Tr>
            ))}

            {users.length === 0 && <>
              <Index.Tr>
                <Index.Td colSpan={7}>
                  <Alert.Warning>
                    No users available.{' '}
                    <Link to={'/app/users/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                      Click here to add more users.
                    </Link>
                  </Alert.Warning>
                </Index.Td>
              </Index.Tr>
            </>}
          </Index.TBody>
        </Index.Table>

        <Pagination meta={meta}/>
      </div>
    </div>

    <TrashModal
      show={isTrashing}
      url={`/users/${user.id}`}
      title={'Delete User'}
      description={<>Are you sure you want to delete "<b>{user.first_name}</b>"?</>}
      onClose={onCloseTrash}
      onDelete={onDelete}
    />
  </>
}
