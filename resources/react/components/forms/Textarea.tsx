import { classNames } from "@/helpers"
import { useEffect, useState } from "react"

type InputProps = React.ComponentProps<'textarea'> & {
    variant?: 'underlined'
    override?: boolean
    error?: string
}
export default function Textarea({ variant, ...props }: InputProps) {
    if (variant === 'underlined') {
        return <Underlined {...props} />
    }

    return <Basic {...props} />
}


function Basic({ error, override, className, ...props }: InputProps) {
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
            <textarea {...props} className={classNames(override ? className : `focus:border-gray-500 focus:ring-4 ${className}`, classList)} ></textarea>
        </div>
    )
}

function Underlined({ error, override, className, ...props }: InputProps) {
    const [hasError, setHasError] = useState(!!error)
    const [classList, setClassList] = useState<string[]>([])

    useEffect(() => {
        setHasError(!!error)
    }, [error])

    useEffect(() => {
        setClassList([
            (hasError ? 'focus-within:bg-red-50 text-red-600 placeholder:text-red-500' : 'focus-within:bg-gray-50 text-gray-900')
        ])
    }, [hasError])

    return (
        <div className="relative">
            <textarea {...props} className={classNames(override ? className : `peer block w-full border-0 py-1.5 focus:ring-0 sm:text-sm sm:leading-6 ${className}`, classList)} ></textarea>
            <div className={`absolute inset-x-0 bottom-0 border-t peer-focus:border-t-2 ${hasError ? 'border-red-300 peer-focus:border-red-600' : 'border-gray-300 peer-focus:border-slate-600'}`} aria-hidden="true" />
        </div>
    )
}
