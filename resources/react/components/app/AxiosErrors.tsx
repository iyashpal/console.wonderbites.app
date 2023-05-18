import axios from "axios"
import { ErrorContent } from "./Errors"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function AxiosErrors({ children }: { children: React.ReactNode }) {
    const location = useLocation()
    const [statusCode, setStatusCode] = useState(200)

    useEffect(() => {
        axios.interceptors.response.use((response) => {
            setStatusCode(response.status)
            return response
        }, (error) => {
            setStatusCode(error.response.status)
            return Promise.reject(error)
        })
    }, [])

    useEffect(() => {
        setStatusCode(200)
    }, [location])

    if ([404].includes(statusCode)) {
        return <ErrorContent
            status={statusCode}
            title="Something went wrong"
            message="The server encountered an internal error and was unable to complete your request"
        />
    }
    return <>{children}</>
}
