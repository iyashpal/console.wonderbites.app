import {CheckCircleIcon} from "@heroicons/react/24/solid";

export default function Success(props) {
  return <>
    <div className="border-l-4 border-green-400 bg-green-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-green-700">
            {props.children}
          </p>
        </div>
      </div>
    </div>
  </>
}
