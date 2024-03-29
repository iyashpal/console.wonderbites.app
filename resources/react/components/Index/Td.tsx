export default function Td(props) {
  return <>
    <td colSpan={props.colSpan} className={['whitespace-nowrap py-3 px-3 text-sm font-medium', props.className].join(' ')}>
      {props.children}
    </td>
  </>
}
