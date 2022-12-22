import {CheckIcon, DocumentDuplicateIcon} from "@heroicons/react/solid";
import {useEffect, useState} from "react";

export default function CopyButton(props) {
    const [copied, setCopied] = useState(false)

    const onClick = () => {
        navigator.clipboard.writeText(props.text)
        setCopied(true)
    }

    useEffect(() => {
        if (copied) {
            const timer = setTimeout(() => {
                setCopied(false)
            }, 2000)
            return () => clearTimeout(timer);
        }
    }, [copied])

    return (
        <button className={`btn btn-sm ${props.className || ''}`} onClick={onClick}>
            {copied ? <CheckIcon className={`h-5 w-5 ${props.label ? 'inline-block' : ''}`} /> : <DocumentDuplicateIcon className={`h-5 w-5 ${props.label ? 'inline-block' : ''}`} />}
            {props.label ? <span className={"ml-1"}>{props.label}</span> : ''}
        </button>
    )
}