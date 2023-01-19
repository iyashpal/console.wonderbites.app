import Breadcrumb from "~/layouts/AuthLayout/Breadcrumb";

export default function ListClients() {
  return <>
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <Breadcrumb pages={[{name: 'Clients'}]}/>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="h-96 rounded-lg border-4 border-dashed border-gray-200"/>
        </div>
      </div>
    </div>
  </>
}
