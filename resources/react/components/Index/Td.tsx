export default function Td({className, children}: { className: string, children: JSX.Element | JSX.Element[] }) {
  return <>
    <th className={`whitespace-nowrap py-3 pr-3 text-sm font-medium text-center`}>
      {children}
    </th>
  </>
}
