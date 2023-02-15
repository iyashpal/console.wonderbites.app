export default function THead(props) {
  return <thead className={['bg-gray-50', props.className].join(' ')}>{props.children}</thead>
}
