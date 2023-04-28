export default function AuthPageCard({ children }: { children: JSX.Element | JSX.Element[] | React.ReactNode | React.ReactNode[] }) {
  return <>
    <div className="min-h-screen flex flex-col justify-center items-center py-16 px-3 overflow-auto">

      <div className="max-w-lg mx-auto w-full px-4 py-6 sm:px-10 shadow rounded-lg bg-white">
        <div className="flex flex-col items-center ">
          <img src="/images/logo.svg" className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16" alt="Management Console" />
          <h2 className="uppercase font-semibold mt-3 text-sm sm:text-lg md:text-2xl">Management Console</h2>
        </div>
        {/* Form Wrapper */}
        <div className="flex flex-col items-center max-w-sm mx-auto space-y-4 sm:space-y-5 md:space-y-6 mt-4 sm:mt-6 md:mt-10">
          {children}
        </div>
      </div>
    </div>
  </>
}
