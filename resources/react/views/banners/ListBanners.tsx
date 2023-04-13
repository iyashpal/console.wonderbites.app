import {useDataLoader} from "@/hooks";
import {Banner} from "@/types/models";
import {useEffect, useState} from "react";
import {PaginatorMeta} from "@/types/paginators";
import Pagination from "@/components/Pagination";
import TrashModal from "@/components/TrashModal";
import {Link, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import ListTable from "@/components/page/ListTable";
import ListFilters from "@/components/page/ListFilters";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import {BookmarkIcon, EyeIcon, HashtagIcon, PencilSquareIcon, TrashIcon} from "@heroicons/react/24/outline";

export default function ListBanners() {
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const [banner, setBanner] = useState<Banner>({} as Banner)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const loader = useDataLoader<{ data: Banner[], meta: PaginatorMeta }>(`/banners`)

  const columns = {
    id: {name: 'id', options: {className: 'text-center'}},
    product_name: {name: 'Name', options: {className: 'text-left'}},
    description: {name: 'Group', options: {className: 'text-left'}},
    sku: {name: 'Type', options: {className: 'text-left'}},
    updated_at: {name: 'Update Date', options: {className: 'text-left'}},
    status: {name: 'status', options: {className: 'text-left'}},
  }

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

            <ListFilters
              create={{url: '/app/banners/create', label: 'Add Banner'}}
              sortBy={[
                {label: 'ID', value: 'id', icon: <HashtagIcon className={'w-5 h-5'}/>},
                {label: 'Name', value: 'name', icon: <BookmarkIcon className={'w-5 h-5'}/>}
              ]}
            />

            <ListTable
              thead={Object.values(columns)}
              tbody={loader.response.data.map(banner => {
                return [
                  banner.id, banner.title, banner.options.page, banner.options.type, banner.updated_at,
                  banner.status === 'active' ? <span className={`font-semibold uppercase text-red-primary`}>Active</span> : <span className={`font-semibold uppercase`}>In-Active</span>,
                  <div className="flex item-center justify-center gap-x-1">
                    <Link to={`/app/banners/${banner.id}/edit`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-blue-700 hover:bg-blue-100 hover:text-blue-700 transition-colors ease-in-out duration-300'}>
                      <PencilSquareIcon className={'w-5 h-5'}/>
                    </Link>

                    <Link to={`/app/banners/${banner.id}`} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-green-700 hover:bg-green-100 hover:text-green-700 transition-colors ease-in-out duration-300'}>
                      <EyeIcon className={'w-5 h-5'}/>
                    </Link>

                    <button onClick={() => toggleTrash(banner)} className={'bg-gray-100 border border-gray-400 text-gray-500 rounded-lg p-1 hover:border-red-700 hover:bg-red-100 hover:text-red-700 transition-colors ease-in-out duration-300'}>
                      <TrashIcon className={'w-5 h-5'}/>
                    </button>
                  </div>
                ]
              })}
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
