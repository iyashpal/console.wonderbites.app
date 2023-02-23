import {useFetch} from "@/hooks";
import {Fragment, useState} from "react";
import * as Loaders from '@/components/loaders';
import {Dialog, Transition} from "@headlessui/react";
import {TrashIcon} from "@heroicons/react/24/outline";

type TrashProps = { show: boolean, title: string, description: string | JSX.Element | JSX.Element[], type?: string, url: string, onClose: () => void, onDelete: () => void }
export default function TrashModal({show = false, onClose, onDelete, title, description, url}: TrashProps) {

  const fetcher = useFetch()

  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  function onSubmit() {
    setIsProcessing(true)
    fetcher.delete(url).then(onDelete).catch((error) => {
      console.log(error)
      setIsProcessing(false)
    })
  }
  return <>
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  {title}
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {description}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-x-3">
                  <button type="button" className="inline-flex justify-center rounded-md border border bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none" onClick={onClose}>
                    Close
                  </button>
                  <button type="button" className="inline-flex items-center gap-x-1 justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2" onClick={onSubmit}>
                    {isProcessing ? <>
                      <Loaders.Circle className={'animate-spin h-5 w-5'}/> Deleting
                    </> : <>
                      <TrashIcon className={'w-4 h-4'}/> Delete
                    </>}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>
}
