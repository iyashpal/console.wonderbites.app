import React from "react";

interface AvatarProps extends React.ComponentProps<'img'> {

}

export default function Avatar({className, ...n}: AvatarProps ) {
    return <img {...n} className={`object-cover ring-gray-300 ${className}`} />
}
