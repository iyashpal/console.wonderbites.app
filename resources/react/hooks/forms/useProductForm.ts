import { DateTime } from "luxon";
import { useFetch, useFlash } from "@/hooks";
import { useNavigate } from "react-router-dom";
import { ChangeEvent, FormEvent, useState } from "react";

export default function useProductForm(fields: ProductFormFields) {
    const flash = useFlash()
    const fetcher = useFetch()
    const navigateTo = useNavigate()
    const [thumbnail, setThumbnail] = useState<string | Blob>('')
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [errors, setErrors] = useState<FormErrors>({} as FormErrors)
    const [createForm, setCreateForm] = useState<ProductFormFields>(fields)

    /**
     * Event handler for the name field.
     * @param event
     */
    function onChangeName(event: ChangeEvent<HTMLInputElement>) {
        setCreateForm(payload => ({ ...payload, name: event.target.value }))
    }

    /**
     * Event handler for the description field.
     * @param event
     */
    function onChangeDescription(event: ChangeEvent<HTMLTextAreaElement>) {
        setCreateForm(payload => ({ ...payload, description: event.target.value }))
    }

    /**
     * Event handler for the status field.
     * @param event
     */
    function onChangeCategoryId(event: ChangeEvent<HTMLSelectElement>) {
        setCreateForm(payload => ({ ...payload, categoryId: Number(event.target.value) }))
    }

    /**
     * Event handler for the status field.
     * @param event
     */
    function onChangeSku(event: ChangeEvent<HTMLInputElement>) {
        setCreateForm(payload => ({ ...payload, sku: event.target.value }))
    }

    /**
     * Event handler for the status field.
     * @param event
     */
    function onChangePublishedAt(event: ChangeEvent<HTMLSelectElement>) {
        setCreateForm(payload => ({ ...payload, publishedAt: event.target.value }))
    }

    /**
     * Event handler for the status field.
     * @param event
     */
    function onChangePrice(event: ChangeEvent<HTMLInputElement>) {
        setCreateForm(payload => ({ ...payload, price: Number(event.target.value) }))
    }


    /**
     * Event handler for the thumbnail field.
     * @param event
     */
    function onChangeThumbnail(event: ChangeEvent<HTMLInputElement>) {
        if (!event.target.files) return;

        setThumbnail(event.target.files[0])

        setCreateForm(payload => ({ ...payload, thumbnail: event.target.value }))
    }

    /**
     * Generate FormData instance.
     * 
     * @returns FormData
     */
    function generateFormData() {
        let form = new FormData()

        for (let key in createForm) {
            if (key === 'thumbnail') {
                form.append('thumbnail', thumbnail, createForm[key])
                continue
            }

            if (createForm[key]) {
                form.append(key, createForm[key])
            }
        }

        return form
    }


    function onUpdate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setIsProcessing(true)
        fetcher.put(`products/${createForm?.id}`, generateFormData()).then(({ data }) => {
            setIsProcessing(false)
            flash.set('product_updated', true)
            navigateTo(`/app/products/${data.id}`)
        }).catch(({ data }) => {
            setIsProcessing(false)
            flash.set('product_updated', false)
            setErrors(data?.errors)
        })
    }

    function onCreate(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()

        setIsProcessing(true)

        fetcher.post('products', generateFormData()).then(({ data }) => {
            setIsProcessing(false)
            flash.set('product_created', true)
            navigateTo(`/app/products/${data.id}`)
        }).catch(({ response }) => {
            setIsProcessing(false)
            setErrors(response?.data?.errors ?? {})
        })

    }

    return {
        errors,
        isProcessing,
        input: {
            value(key) {
                return createForm[key]
            },
            onChange: {
                sku: onChangeSku,
                name: onChangeName,
                price: onChangePrice,
                thumbnail: onChangeThumbnail,
                categoryId: onChangeCategoryId,
                description: onChangeDescription,
                publishedAt: onChangePublishedAt,
            },
        },
        onSubmit: {
            create: onCreate,
            update: onUpdate,
        }
    }
}

type ProductFormFields = {
    id?: number,
    categoryId: number,
    name: string,
    sku: string,
    price: number | null,
    description: string,
    status?: number,
    publishedAt: DateTime | string,
    createdAt?: DateTime | string,
    updatedAt?: DateTime | string,
}
type FormErrors = {
    sku: string,
    name: string,
    price: string,
    status: string,
    thumbnail: string,
    categoryId: string,
    description: string,
    publishedAt: string,
}
