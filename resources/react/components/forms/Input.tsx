import { classNames } from "@/helpers"
import { useEffect, useState } from "react"

type InputProps = React.ComponentProps<'input'> & {
    override?: boolean
    error?: string
}

export default function Input({ error, override, className, ...props }: InputProps) {
    const [hasError, setHasError] = useState(!!error)
    const [classList, setClassList] = useState<string[]>([])

    useEffect(() => {
        setHasError(!!error)
    }, [error])

    useEffect(() => {
        setClassList([
            (hasError ?
                'text-red-500 border-red-200 focus:ring-red-200 focus:border-red-500 placeholder:text-red-500'
                :
                'text-gray-500 border-gray-200 focus:ring-gray-200 focus:border-gray-500 placeholder:text-gray-500'
            )

        ])
    }, [hasError])

    return (
        <div className="relative">
            <input {...props} className={classNames(override ? className : `focus:border-gray-500 focus:ring-4 ${className}`, classList)} />
            {hasError && <p className="absolute capitalize text-red-500 text-xs pt-1">{error}</p>}
        </div>
    )
}
