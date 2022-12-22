import {siteTitle} from "./layout"
import CopyButton from "./copy_button"
import dynamic from 'next/dynamic'

const Trim = dynamic(() => import("./trim"), { ssr: false })

const TitleWithAddress = ({ address }) => {
    return (
        <h1 className={"flex space-x-2"}>
            <span className={""}>{siteTitle}</span>
            <span>
                <span className="px-2 text-xs leading-5 font-semibold rounded-full bg-grey-500 text-grey-100 uppercase align-middle">beta</span>
                </span>
            <span>•</span>
            <Trim text={address}/>
            <span>
                <CopyButton text={address}/>
            </span>
        </h1>
    )
}

export default TitleWithAddress