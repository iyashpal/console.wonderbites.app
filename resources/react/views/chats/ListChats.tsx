import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";

export default function ListChats() {
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Chats'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="h-96 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-500">Coming soon...</span>
          </div>
        </div>
      </div>
    </div>
  </>
}
