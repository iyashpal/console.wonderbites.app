import { useState } from "react"
import { Axios } from "@/helpers"
import { ErrorsType } from "@/contracts"

export default function useProductVariantForm<T>() {
    const [form, setForm] = useState({} as T)
    const [isProcessing, setIsProcessing] = useState(false)
    const [errors, setErrors] = useState<ErrorsType<T>>({} as ErrorsType<T>)

    /**
     * Synchronize the whole form data.
     *
     * @param data {Object}
     * @returns void
     */
    const sync = (data: T): void => setForm(data)

    /**
     * Reset the form errors.
     *
     * @returns void
     */
    const resetErrors = (): void => setErrors({} as ErrorsType<T>)

    /**
     * Get the form error.
     *
     * @param key string
     * @returns string | undefined
     */
    const getError = (key: keyof T): undefined | string => errors[key]

    /**
     * Set a value to form input.
     *
     * @param key string
     * @param value any
     */
    function set<V>(key: keyof T, value: V) {
        setForm(e => ({ ...e, [key]: value }))
    }

    const create = (e: React.FormEvent) => {
        e.preventDefault()
        setIsProcessing(true)
        return Axios()
            .post(`variants`, form)
            .then((response) => {
                setIsProcessing(false)
                return Promise.resolve(response)
            }).catch(({ response }) => {
                setIsProcessing(false)
                setErrors(response?.data?.errors ?? {})
                return Promise.reject()
            })
    }

    const update = (e: React.FormEvent) => {
        e.preventDefault()
        return Axios()
            .put(`variants`, form)
            .then(() => {
                return Promise.resolve()
            }).catch(({ response }) => {
                setErrors(response?.data?.errors ?? {})
                return Promise.reject()
            })
    }

    return {
        sync,
        data: form,
        isProcessing,
        input: { set },
        errors: getError,
        onSubmit: { create, update },
        reset: { errors: resetErrors },
    }
}
