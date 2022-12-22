import _ from "lodash";
import {marketplaces} from "../../lib/marketplaces";
import Image from "next/image";

export default function Floors(props) {

    const { identifier, sources } = props

    if (!sources || _.values(sources).length < 1) {
        return ''
    }

    return (
        _.map(sources, (value, key) => {
            const marketplace = _.find(marketplaces, (m) => {
                return m.name === key
            })
            const link = marketplace && marketplace.external_link ? marketplace.external_link .replace('${ticker}', identifier) : null
            return (
                <span key={identifier + '_' + key} className={"mx-1 inline-block"}>
                {link ?
                    <a href={link} target={"_blank"} className={"text-white hover:text-grey-100"}>
                        <span className={"mx-1 align-middle"}>
                            <Image src={marketplace.favicon} width={16} height={16} placeholder={marketplace.name}/>
                        </span>{value}
                    </a> :
                    <>
                        <span className={"mx-1 align-middle"}>
                            <Image src={marketplace.favicon} width={16} height={16} placeholder={marketplace.name}/>
                        </span>{value}
                    </>
                }
                </span>
            )
        })
    )
}