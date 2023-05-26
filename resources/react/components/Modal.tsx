import {classNames} from "@/helpers";
import React, {Fragment} from 'react'
import {Dialog, Transition} from '@headlessui/react'

type ModalProps = {
  show: boolean,
  className?: string,
  onClose?: () => void,
  children: JSX.Element | JSX.Element[] | React.ReactElement | React.ReactElement[],
}

export default function Modal({show = false, onClose, children, className = ''}: ModalProps) {

  return <>
    <Transition appear show={show} as={Fragment}>

      <Dialog as="div" className="relative z-10" onClose={onClose ?? (() => {})}>

        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25"/>
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className={classNames('w-full relative transform overflow-hidden bg-white shadow-xl transition-all', className)}>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  </>
}
