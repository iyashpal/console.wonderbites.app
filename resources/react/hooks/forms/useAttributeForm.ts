import { useState } from "react"
import { Axios } from "@/helpers"
import { ErrorsType } from "@/contracts"

export default function useAttributeForm<T>(defaults: T = {} as T) {
    const [form, setForm] = useState<T>(defaults)
    const [isProcessing, setIsProcessing] = useState(false)
    const [errors, setErrors] = useState<ErrorsType<T>>({} as ErrorsType<T>)

    function handleOnChangeEvent(field: keyof T) {
        return (event) => {
            setForm(data => ({ ...data, [field]: event.target.value }))
        }
    }

    function store(event: React.FormEvent) {
        event.preventDefault()
        setIsProcessing(true)
        return Axios().post(`/attributes`, form).then(({ data }) => {
            setForm({} as T)
            setIsProcessing(false)
            setErrors({} as ErrorsType<T>)
            return Promise.resolve(data)
        }).catch(({ response }) => {
            setIsProcessing(false)
            setErrors(response.data.errors)
            return Promise.reject(response)
        })
    }
    return {
        errors,
        data: form,
        onSubmit: { store },
        onChange: handleOnChangeEvent,
        isProcessing: () => isProcessing,
    }
}
