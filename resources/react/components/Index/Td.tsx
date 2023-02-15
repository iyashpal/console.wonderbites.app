export default function Td(props) {
  return <>
    <th className={['whitespace-nowrap py-3 px-3 text-sm font-medium', props.className].join(' ')}>
      {props.children}
    </th>
  </>
}
