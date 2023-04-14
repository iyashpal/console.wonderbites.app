import Icons from '~/helpers/icons'
import {useDataLoader} from "@/hooks";
import {Banner} from "@/types/models";
import {useEffect, useState} from "react";
import * as Alert from "@/components/alerts";
import {PaginatorMeta} from "@/types/paginators";
import Pagination from "@/components/Pagination";
import TrashModal from "@/components/TrashModal";
import {ListFilters, ListTable} from "@/components/page";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";

const columns = [
  {name: 'id', options: {className: 'text-center'}},
  {name: 'Name', options: {className: 'text-left'}},
  {name: 'Group', options: {className: 'text-left'}},
  {name: 'Type', options: {className: 'text-left'}},
  {name: 'Update Date', options: {className: 'text-left'}},
  {name: 'status', options: {className: 'text-left'}},
]

const sortByFilters = [
  {label: 'ID', value: 'id', icon: <Icons.Outline.Hashtag className={'w-5 h-5'}/>},
  {label: 'Name', value: 'name', icon: <Icons.Outline.Bookmark className={'w-5 h-5'}/>}
]

export default function ListBanners() {
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const [banner, setBanner] = useState<Banner>({} as Banner)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const loader = useDataLoader<{ data: Banner[], meta: PaginatorMeta }>(`/banners`)


  useEffect(() => {
    loader.sync({params: {page: searchParams.get('page') ?? 1}})
  }, [location, searchParams])


  function toggleTrash(payload) {
    setBanner(payload);
    setIsTrashing(!isTrashing);
  }

  function onDeleteCategory() {
    setIsTrashing(false)
    navigateTo('/app/banners')
  }

  function onCloseTrash() {
    setIsTrashing(false)
    setBanner({} as Banner)
  }

  if (loader.isProcessed()) {
    return <>

      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Banners'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          <div className={``}>
            <ListFilters sortBy={sortByFilters} create={{url: '/app/banners/create', label: 'Add Banner'}}/>

            <ListTable
              thead={columns}
              tbody={loader.response.data.map(banner => ([
                banner.id,
                banner.title,
                banner.options.page,
                banner.options.type,
                banner.updated_at,
                banner.status === 'active' ? <span className={`font-semibold uppercase text-red-primary`}>Active</span> : <span className={`font-semibold uppercase`}>In-Active</span>,
                <div className="flex item-center justify-center gap-x-1">

                  <Link to={`/app/banners/${banner.id}/edit`} className={'action-button button-blue'}>
                    <Icons.Outline.PencilSquare className={'w-5 h-5'}/>
                  </Link>

                  <Link to={`/app/banners/${banner.id}`} className={'action-button button-green'}>
                    <Icons.Outline.Eye className={'w-5 h-5'}/>
                  </Link>

                  <button onClick={() => toggleTrash(banner)} className={'action-button button-red'}>
                    <Icons.Outline.Trash className={'w-5 h-5'}/>
                  </button>

                </div>
              ]))}
              empty={(
                <Alert.Warning>
                  No banners available.{' '}
                  <Link to={'/app/banners/create'} className="font-medium text-yellow-700 underline hover:text-yellow-600">
                    Click here to add more banners.
                  </Link>
                </Alert.Warning>
              )}
            />

            <Pagination meta={loader.response.meta}/>
          </div>
        </div>
      </div>

      <TrashModal
        show={isTrashing}
        onClose={onCloseTrash}
        title={'Delete Banner'}
        onDelete={onDeleteCategory}
        url={`/banners/${banner.id}`}
        description={<>Are you sure you want to delete "<b>{banner.title}</b>" banner?</>}
      />
    </>
  }

  return <></>
}
