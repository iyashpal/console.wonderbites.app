import Skeleton from './skeleton'
import Icons from '~/helpers/icons'
import { useEffect, useState } from 'react'
import { Product } from '~/contracts/schema'
import * as Alert from '@/components/alerts'
import TrashModal from '@/components/TrashModal'
import { useDataLoader, useFlash } from '~/hooks'
import { MetaData } from '~/contracts/pagination'
import Resources from '@/components/resources'
import Breadcrumb from '~/layouts/AuthLayout/Breadcrumb'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

const columns = [
  { name: 'ID', options: { className: 'text-center' } },
  { name: 'SKU', options: { className: 'text-left' } },
  { name: 'Product Name', options: { className: 'text-left' } },
  { name: 'Price', options: { className: 'text-center' } },
  { name: 'Image', options: { className: 'text-center' } },
  { name: 'Type', options: { className: 'text-center' } },
  { name: 'Status', options: { className: 'text-left' } },
]
const sortByFilters = [
  { label: 'ID', value: 'id' },
  { label: 'Date', value: 'date' },
  { label: 'Name', value: 'name' },
  { label: 'Price', value: 'price' },
]

export default function ListProducts() {
  const flash = useFlash()
  const location = useLocation()
  const navigateTo = useNavigate()
  const [searchParams] = useSearchParams()
  const loader = useDataLoader<{ data: Product[], meta: MetaData }>(`/products`)

  const [product, setProduct] = useState<Product>({} as Product)
  const [isTrashing, setIsTrashing] = useState<boolean>(false)

  useEffect(() => {
    loader.sync({ params: { page: searchParams.get('page') ?? 1 } })
  }, [searchParams, location])

  function onDeleteProduct() {
    setIsTrashing(false)
    flash.set('product_deleted', true)
    navigateTo('/app/products')
  }

  function onCloseTrash() {
    setIsTrashing(false)
    setProduct({} as Product)
  }


  function toggleTrash(product: Product) {
    setProduct(product);
    setIsTrashing(true);
  }

  return <>
    {loader.isProcessed() ? (
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <Breadcrumb pages={[{ name: 'Products' }]} />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8 mt-5 flex flex-col">
          {flash.get('product_deleted') && <>
            <Alert.Success className={'mb-6'}>Product deleted successfully</Alert.Success>
          </>}

          <Resources.List
            columns={columns}
            sorting={sortByFilters}
            data={loader.response.data}
            metadata={loader.response.meta}
            createLink={{ label: 'Add Product', href: '/app/products/create' }}
          >
            {({ data }) => data.map((product) => ([
              product.id,
              product.sku,
              <Link to={`/app/products/${product.id}`}>
                {product.name}
              </Link>,
              product.price,
              <div className={'rounded-full overflow-hidden group w-9 h-9 mx-auto relative cursor-pointer z-0'}>
                <img className={'w-9 h-9 rounded-full object-cover'} src={product.thumbnail_url} alt={product.name} />
                {((product.meta.media_count ?? 0) > 0) && <>
                  <span className="hidden group-hover:flex items-center justify-center font-semibold text-xs absolute inset-0 text-white bg-gray-900/30">+{product.meta.media_count}</span>
                </>}
              </div>,
              <span className={'uppercase'}>{product.type}</span>,
              <span className='capitalize'>{product.status}</span>,
              <div className="flex item-center justify-center gap-x-1">
                <Link to={`/app/products/${product.id}/edit`} className={'action:button button:blue'}>
                  <Icons.Outline.PencilSquare className={'w-5 h-5'} />
                </Link>

                <Link to={`/app/products/${product.id}`} className={'action:button button:green'}>
                  <Icons.Outline.Eye className={'w-5 h-5'} />
                </Link>

                <button onClick={() => toggleTrash(product)} className={'action:button button:red'}>
                  <Icons.Outline.Trash className={'w-5 h-5'} />
                </button>
              </div>
            ]))}
          </Resources.List>
        </div>
        <TrashModal
          show={isTrashing}
          url={`/products/${product.id}`}
          title={'Delete Product'}
          description={<>Are you sure you want to delete "<b>{product.name}</b>"?</>}
          onClose={onCloseTrash}
          onDelete={onDeleteProduct}
        />
      </div>
    ) : (<Skeleton.List.Page />)}
  </>
}
