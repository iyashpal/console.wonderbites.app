import { FormEvent, useState } from "react"
import { Axios } from "@/helpers"
import { useAuth } from "~/hooks"
import { useNavigate } from "react-router-dom"
type ErrorsType = { email: string, password: string }
type FormFields = { email: string, password: string }
export default function useLoginForm() {
    const auth = useAuth()
    const navigateTo = useNavigate()
    const [errorCode, setErrorCode] = useState(null)
    const [form, setForm] = useState({} as FormFields)
    const [errors, setErrors] = useState({} as ErrorsType)
    const [isProcessing, setIsProcessing] = useState(false)
    const [redirectURL, setRedirectURL] = useState('/app/dashboard')

    function useRedirectURL(url: string) {
        setRedirectURL(url)
    }

    function goToRedirectURL() {
        navigateTo(redirectURL)
    }

    function login(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        Axios().post('login', form).then(({ data }) => {
            setErrors({} as ErrorsType)
            setIsProcessing(false)
            auth.useToken(data.token)
            navigateTo(redirectURL)
        }).catch(({ response: { data } }) => {
            setIsProcessing(false)
            setErrorCode(data?.code)
            setErrors(data?.errors)
        })
    }

    return {
        auth,
        errors,
        errorCode,
        goToRedirectURL,
        isProcessing,
        useRedirectURL,
        input: {
            set(key: string, value: any = null) {
                setForm(fields => ({ ...fields, [key]: value }))
            },
            value(key: string, value: any = null) {
                return form[key] ?? value
            }
        },

        onSubmit: {
            login
        }
    }
}
