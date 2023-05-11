import { Form, Link } from "react-router-dom";
import * as Loaders from "@/components/loaders";
import { FormEvent } from "react";
type FormCardProps = {
    title: string;
    backUrl: string;
    processing: boolean;
    onSubmit: (e: FormEvent) => void;
    children: JSX.Element | JSX.Element[];
}
export default function FormCard({ onSubmit, backUrl, title, children, processing }: FormCardProps) {
    return <>
        <Form className="divide-y divide-gray-200 overflow-hidden bg-white shadow" method='post' onSubmit={onSubmit} encType='multipart/form-data'>
            <div className="px-4 py-5 sm:px-6">
                <h1 className={'font-semibold'}>{title}</h1>
            </div>
            <div className="px-4 py-5 sm:p-6">
                {children}
            </div>
            <div className="px-4 py-4 sm:px-6 flex items-center justify-end">
                <Link to={backUrl} className="rounded-md border border-gray-300 bg-white py-2 px-8 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Cancel
                </Link>

                <button type="submit" className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-8 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    {processing ? <Loaders.Circle className={'animate-spin h-5 w-5'} /> : 'Save'}
                </button>
            </div>
        </Form>
    </>
}
