export default function ThCheck(props) {
  return <th scope="col" className={["relative w-12 px-6 sm:w-16 sm:px-8", props.className].join(' ')}>
    <input type="checkbox" className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
  </th>
}
