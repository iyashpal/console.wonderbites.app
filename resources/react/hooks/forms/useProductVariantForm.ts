import { useState } from "react"
import { Axios } from "@/helpers"
import { ErrorsType } from "@/contracts"

export default function useProductVariantForm<T>() {
    const [form, setForm] = useState({} as T)
    const [errors, setErrors] = useState<ErrorsType<T>>({} as ErrorsType<T>)

    function sync(data: T) {
        setForm(data)
    }


    function create() {
        return Axios()
            .post(`variants`, form)
            .then(() => {
                return Promise.resolve()
            }).catch(({ response }) => {
                setErrors(response?.data?.errors ?? {})
                return Promise.reject()
            })
    }

    function update() {

    }

    return { sync, create, update, errors, data: form }
}
