export default function Th(props) {
  return <>
    <th colSpan={props.colSpan} className={['py-3.5 px-3 text-sm font-semibold text-gray-900 uppercase', props.className].join(' ')}>
      {props.children}
    </th>
  </>
}
