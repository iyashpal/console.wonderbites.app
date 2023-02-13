export default function Th({className, children}: { className: string, children: JSX.Element | JSX.Element[] }) {
  return <>
    <th className={`py-3.5 px-3 text-sm font-semibold text-gray-900 uppercase ${className}`}>
      {children}
    </th>
  </>
}
