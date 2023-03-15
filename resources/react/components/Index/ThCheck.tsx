import {ChangeEvent, forwardRef, ForwardedRef} from "react";

type CheckPropsType = {
  value?: number,
  className?: string,
  checked?: boolean,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
}

const ThCheck = forwardRef(({className, checked, onChange, value}: CheckPropsType, forwardedRef: ForwardedRef<HTMLInputElement>) => (
  <th scope="col" className={["relative w-12 px-6 sm:w-16 sm:px-8", className].join(' ')}>
    <input type="checkbox" ref={forwardedRef} checked={checked} onChange={onChange} value={value} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
  </th>
))

export default ThCheck
