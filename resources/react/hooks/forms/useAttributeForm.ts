import { ErrorsType } from "@/contracts"
import { Axios } from "@/helpers"
import { useState } from "react"

export default function useAttributeForm<T>(defaults: T = {} as T) {
    const [form, setForm] = useState<T>(defaults)
    const [errors, setErrors] = useState<ErrorsType<T>>({} as ErrorsType<T>)

    function handleOnChangeEvent<E extends HTMLInputElement | HTMLSelectElement>(field: keyof T) {
        return (event: React.ChangeEvent<E>) => setForm(data => ({ ...data, [field]: event.target.value }))
    }

    function store(event: React.FormEvent) {
        event.preventDefault()
        return Axios().post(`/attributes`, form).then(({ data }) => {
            setForm({} as T)
            setErrors({} as ErrorsType<T>)
            return Promise.resolve(data)
        }).catch(({ response }) => {
            setErrors(response.data.errors)
            return Promise.reject(response)
        })
    }
    return {
        errors,
        data: form,
        onSubmit: {store},
        onChange: handleOnChangeEvent
    }
}
