export default function Table(props) {
  return <>
    <div className="inline-block min-w-full align-middle">

      <div className="overflow-x-auto overflow-y-hidden">

        <table className="min-w-full table-fixed divide-y divide-gray-300 border">
          {props.children}
        </table>
      </div>
    </div>
  </>
}
