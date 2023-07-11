import {DateTime} from "luxon";
import Icons from '~/helpers/icons'
import { useDataLoader } from "@/hooks";
import { Banner } from "~/contracts/schema";
import { useEffect, useState } from "react";
import Resources from '@/components/resources';
import TrashModal from "@/components/TrashModal";
import { MetaData } from "@/contracts/pagination";
import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";

const columns = [
  { name: 'id', options: { className: 'text-center' } },
  { name: 'Image', options: { className: 'text-left' } },
  { name: 'Name', options: { className: 'text-left' } },
  { name: 'Group', options: { className: 'text-left' } },
  { name: 'Type', options: { className: 'text-left' } },
  { name: 'Update Date', options: { className: 'text-left' } },
  { name: 'status', options: { className: 'text-left' } },
]

const sortByFilters = [
  { label: 'ID', value: 'id', icon: <Icons.Outline.Hashtag className={'w-5 h-5'} /> },
  { label: 'Name', value: 'name', icon: <Icons.Outline.Bookmark className={'w-5 h-5'} /> }
]

export default function ListBanners() {
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const [banner, setBanner] = useState<Banner>({} as Banner)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  const loader = useDataLoader<{ data: Banner[], meta: MetaData }>(`/banners`)


  useEffect(() => {
    loader.sync({ params: { page: searchParams.get('page') ?? 1 } })
  }, [location, searchParams])


  function toggleTrash(payload: Banner) {
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
          <Breadcrumb pages={[{ name: 'Banners' }]} />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5">
          <Resources.List
            columns={columns}
            sorting={sortByFilters}
            data={loader.response.data}
            metadata={loader.response.meta}
            createLink={{ label: 'Add Banner', href: '/app/banners/create' }}
          >

            {({ data }) => data.map(banner => ([
              banner.id,
              <img alt={banner.title} className={'h-6 aspect-video bg-gray-100 rounded overflow-hidden ring-2 ring-offset-1 ring-red-300'} src={banner.attachment_url}/>,
              banner.title,
              banner.options?.page,
              banner.options?.type,
              DateTime.fromISO(banner.updated_at).toISODate(),
              banner.status === 'active' ? <span className={`font-semibold uppercase text-red-primary`}>Active</span> : <span className={`font-semibold uppercase`}>In-Active</span>,
              <div className="flex item-center justify-center gap-x-1">

                <Link to={`/app/banners/${banner.id}/edit`} className={'action:button button:blue'}>
                  <Icons.Outline.PencilSquare className={'w-5 h-5'} />
                </Link>

                <Link to={`/app/banners/${banner.id}`} className={'action:button button:green'}>
                  <Icons.Outline.Eye className={'w-5 h-5'} />
                </Link>

                <button onClick={() => toggleTrash(banner)} className={'action:button button:red'}>
                  <Icons.Outline.Trash className={'w-5 h-5'} />
                </button>

              </div>
            ]))}

          </Resources.List>
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
