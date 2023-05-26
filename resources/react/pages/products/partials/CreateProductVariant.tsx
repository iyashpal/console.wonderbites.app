import { useEffect } from "react"
import Modal from "@/components/Modal"
import { Product } from "@/contracts/schema"
import * as Loaders from '~/components/loaders'
import { Form, useNavigate } from "react-router-dom"
import { useProductVariantForm } from "@/hooks/forms"
import InputError from "@/components/Form/InputError"

export default function CreateProductVariant({ product, open, onClose, onSuccess }: { product: Product, open: boolean, onClose: () => void, onSuccess?: () => void }) {

    return (
        <Modal show={open} className={'max-w-3xl'} onClose={close}>
            <div className="overflow-hidden bg-white shadow">
                <div className="p-4">
                    <div className="grid grid-cols-2">
                        <div>
                            <button className="px-4 py-2 bg-red-50">
                                My Details
                            </button>
                        </div>
                        <div>
                            <button className="px-4 py-2">
                                Profile
                            </button>
                        </div>
                    </div>
                </div>
                <CreateForm product={product} onClose={onClose} />
            </div>
        </Modal>
    )
}

function CreateForm({ product, onClose }: { product: Product, onClose: () => void }) {
    type ProductVariantType = { productId: number, name: string, description: string, proteins: string, vegetables: string, price: string }
    const form = useProductVariantForm<ProductVariantType>()

    useEffect(() => {
        form.sync({ productId: product.id, name: '', description: '', proteins: '1', vegetables: '1', price: '0' })
    }, [])

    const navigateTo = useNavigate()
    function create(e: React.FormEvent) {
        form.onSubmit.create(e).then(() => {
            navigateTo('')
            onClose()
        })
    }

    function close() {
        onClose()
        setTimeout(form.reset.errors, 500)
    }
    return <>
        <Form onSubmit={create} className="">
            <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 relative">
                        <label htmlFor="name" className="block text-sm font-bold text-gray-700">
                            Name <sup className='text-red-primary'>*</sup>
                        </label>
                        <input type="text" onChange={form.onChange('name')} name="name" id="name" autoComplete="given-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                        <InputError error={form.errors('name')} />
                    </div>

                    <div className="col-span-6">
                        <label htmlFor="description" className="block text-sm font-bold text-gray-700">
                            Description
                        </label>
                        <textarea onChange={form.onChange('description')} name="description" rows={3} id="description" autoComplete="description" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"></textarea>
                        <InputError error={form.errors('description')} />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="proteins" className="block text-sm font-bold text-gray-700">
                            Proteins <sup className='text-red-primary'>*</sup>
                        </label>
                        <input type="number" name="proteins" id="proteins" onChange={form.onChange('proteins')} defaultValue={form.data.proteins} min={1} autoComplete="proteins" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                        <InputError error={form.errors('proteins')} />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="vegetables" className="block text-sm font-bold text-gray-700">
                            Vegetables <sup className='text-red-primary'>*</sup>
                        </label>
                        <input type="number" id="vegetables" name="vegetables" onChange={form.onChange('vegetables')} defaultValue={form.data.vegetables} min={1} className="mt-1 block w-full  border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                        <InputError error={form.errors('vegetables')} />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="price" className="block text-sm font-bold text-gray-700">
                            Price <sup className='text-red-primary'>*</sup>
                        </label>
                        <input type="number" name="price" id="price" onChange={form.onChange('price')} defaultValue={0} min={0} autoComplete="family-name" className="mt-1 block w-full  border border-gray-300 py-2 px-3 shadow-sm focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm" />
                        <InputError error={form.errors('price')} />
                    </div>
                </div>
            </div>
            <div className="px-4 py-4 sm:px-6 bg-gray-50 flex items-center justify-end gap-x-4">
                <button type="button" onClick={close} className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto">
                    Close
                </button>
                <button disabled={form.isProcessing} className="relative inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                    {form.isProcessing ? <Loaders.Circle className={'animate-spin h-5 w-5'} /> : 'Save'}
                </button>
            </div>
        </Form>
    </>
}
