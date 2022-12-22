import {RefreshIcon} from "@heroicons/react/solid";

export default function Loader(props) {
    return <RefreshIcon className={`h-5 w-5 loader ${props.className || ''}`} />
}