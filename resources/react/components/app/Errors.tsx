import { isRouteErrorResponse, useNavigate, useRouteError } from "react-router-dom";

export default function Errors() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        if (error.status === 404) {
            return <ErrorContent status={error.status} title="Page not found" message="Sorry, we couldn’t find the page you’re looking for." />
        }
    }
    else if (error instanceof Error) {
        return (
            <div id="error-page">
                <h1>Oops! Unexpected Error</h1>
                <p>Something went wrong.</p>
                <p>
                    <i>{error.message}</i>
                </p>
            </div>
        );
    } else {
        return <ErrorContent
            status="500"
            title="Oops! Something went wrong."
            message="An unknown error has occurred. Please try again later."
        />;
    }

    return <ErrorContent status={error.status} title={error.statusText} message={error.data} />
}


export function ErrorContent({ status, title, message }: { status: React.ReactNode, title: React.ReactNode, message: React.ReactNode }) {
    const navigateTo = useNavigate();
    return <>
        <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-red-600">{status}</p>
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">{title}</h1>
                <p className="mt-6 text-base leading-7 text-gray-600">{message}</p>
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <button onClick={() => navigateTo(-1)} className="rounded-md bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                        Go back
                    </button>
                    <a href="#" onClick={(e) => e.preventDefault()} className="text-sm font-semibold text-gray-900">Contact support <span aria-hidden="true">&rarr;</span></a>
                </div>
            </div>
        </main>
    </>
}
