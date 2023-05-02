import {useDataLoader} from "@/hooks";
import {Banner} from "~/contracts/schema";
import React, {useState} from "react";
import {Details} from "@/components/Show";
import TrashModal from "@/components/TrashModal";
import {useNavigate, useParams} from "react-router-dom";
import Breadcrumb from "@/layouts/AuthLayout/Breadcrumb";

export default function ShowBanner() {
  const {id} =  useParams()
  const navigateTo = useNavigate()
  const loader = useDataLoader<{banner: Banner}>(`banners/${id}`)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)
  function onDelete() {
    navigateTo('/app/banners')
  }

  function onCloseTrash() {
    setIsTrashing(false)
  }

  if (loader.isProcessed()) {
    return <>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{name: 'Banners', href: '/app/banners'}, {name: 'Banner Detail'}]}/>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <Details
              module="Banner"
              title={loader.response.banner.title}
              by={loader.response.banner.user?.name ?? ''}
              date={loader.response.banner.created_at}
              onTrash={() => setIsTrashing(true)}
              onEdit={() => navigateTo(`/app/banners/${loader.response.banner.id}/edit`)}
              fields={[
                {name: 'ID', value: loader.response.banner.id},
                {name: 'Name', value: loader.response.banner.title},
                {name: 'Type', value: loader.response.banner.options.type},
                {name: 'Image', value: <img alt={loader.response.banner.title} src={loader.response.banner.attachment_url} className="w-auto h-10 rounded-md"/>}
              ]}
            />

            <TrashModal
              show={isTrashing}
              onDelete={onDelete}
              onClose={onCloseTrash}
              title={'Delete Banner'}
              url={`/banners/${loader.response.banner.id}`}
              description={<>Are you sure you want to delete "<b>{loader.response.banner.title}</b>" banner?</>}
            />
          </div>
        </div>
      </div>
    </>
  }
  return <></>
}
