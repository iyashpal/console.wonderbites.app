export default function AuthPageCard({ children }: { children: JSX.Element | JSX.Element[] | React.ReactNode | React.ReactNode[] }) {
  return <>
    <div className="min-h-screen flex flex-col justify-center items-center py-16 px-3">

      <div className="max-w-lg mx-auto w-full p-4 sm:p-10 shadow rounded-lg border border-gray-50">
        <div className="flex flex-col items-center ">
          <img src="/images/logo.svg" width={70} height={70} alt="Management Console" />
          <h2 className="uppercase font-semibold mt-3 text-lg sm:text-2xl">Management Console</h2>
        </div>
        {/* Form Wrapper */}
        <div className="flex flex-col items-center max-w-sm mx-auto space-y-6 mt-10">
          {children}
        </div>
      </div>
    </div>
  </>
}
