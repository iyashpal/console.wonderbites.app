import { Fragment } from "react";
import Icons from "@/helpers/icons";
import { Menu, Transition } from "@headlessui/react";

function MenuTransition(props) {
    return (
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
        >{props.children}</Transition>
    )
}

function MenuIcon({ open, className }: { open: boolean, className: string }) {
    if (open) {
        return <Icons.Outline.ChevronUp className={className} />
    }

    return <Icons.Outline.ChevronDown className={className} />
}

export {
    Menu,
    MenuIcon,
    MenuTransition,
}
