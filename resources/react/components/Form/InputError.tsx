import React, {ReactNode} from "react";

export default function InputError({error, children}: {error: any, children?: JSX.Element | ReactNode }) {
  if (!!error) {
    return <>
      <p className={'text-xs border border-red-500 text-red-500 mt-2 font-semibold py-2 px-4 bg-red-100 rounded-lg shadow-md relative before:content-[""] before:absolute before:bg-red-100 before:h-3 before:w-3 before:-top-[7px] before:left-5 before:rotate-45 before:border-l before:rounded-tl before:border-t before:border-red-500'}>
        {children ?? error}
      </p>
    </>
  }

  return <></>
}
