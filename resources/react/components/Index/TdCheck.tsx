import {ChangeEvent} from "react";

export default function TdCheck({isChecked, onChange, value}: { isChecked?: boolean, onChange: (e: ChangeEvent<HTMLInputElement>) => void, value: number }) {
  return <td className="relative w-12 px-6 sm:w-16 sm:px-8">
    {isChecked && (<div className="absolute inset-y-0 left-0 w-0.5 bg-red-600"/>)}
    <input checked={isChecked} type="checkbox" onChange={onChange} value={value} className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-primary sm:left-6"/>
  </td>
}
