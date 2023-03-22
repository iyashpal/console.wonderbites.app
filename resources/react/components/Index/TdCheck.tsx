import {ChangeEvent, forwardRef, ForwardedRef} from "react";

type CheckPropsType = {
  value?: number,
  checked?: boolean,
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void,
}

const TdCheck = forwardRef(({checked, onChange, value}: CheckPropsType, forwardedRef: ForwardedRef<HTMLInputElement>) => {

  return (
    <td className="relative w-12 px-6 sm:w-16 sm:px-8">
      {checked && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600"/>)}
      <input ref={forwardedRef} defaultChecked={checked} type="checkbox" onChange={onChange} value={value} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
    </td>
  )
})


export default TdCheck
