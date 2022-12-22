import _ from "lodash";
import Loader from "../loader";
import {marketplaces} from "../../lib/marketplaces";
import Thumbnail from "./thumbnail";
import Link from "next/link";
import Image from "next/image";
import Floors from "./floors";

export default function Gallery(props)
{
    let {items} = props.account
    const filterType = props.filterType

    const nftsGroupedByCollection = _.sortBy(_.filter(items, {type: 'nft'}), (item) => {
        return -item.valueEgld
    })

    if (nftsGroupedByCollection.length < 1)
        return (
            <div className="shadow overflow-hidden border border-grey-500 sm:rounded-lg bg-grey-300 p-4">
                {filterType !== '' ? 'No ' + filterType + ' found' : <Loader />}
            </div>
        )

    return (
        <section className={"grid grid-cols-2 sm:grid-cols-3 gap-4 my-10 "}>
            {nftsGroupedByCollection.length > 0 ?
                _.map(nftsGroupedByCollection, (collection) => {

                    return _.map(collection.nfts, (nft) => {
                        const marketplace = nft.listed && _.find(marketplaces, (m) => {
                            return m.name === nft.listed.marketplace
                        })
                        const link = marketplace && marketplace.nft_external_link ? marketplace.nft_external_link .replace('${identifier}', nft.identifier) : null

                        return (
                            <div className={"shadow overflow-hidden border border-grey-500 rounded-lg bg-grey-300"} key={nft.identifier}>
                                <div className={"relative"}>
                                    <Thumbnail item={nft} key={`{nft.identifier}_thumbnail`} size={"512"} />
                                    {nft.balance > 1 ? (
                                        <span className={"px-2 leading-5 font-semibold rounded-full bg-grey-500 text-grey-100 opacity-50 absolute right-2 top-2"}>x{nft.balance}</span>
                                    ) : ''}

                                    {nft.listed && marketplace ? (
                                        <span className={"px-2 absolute right-2 bottom-2"}>
                                            <Link href={link}>
                                                <a target={"_blank"} title={`Listed on ${marketplace.name}`}>
                                                    <Image src={marketplace.favicon} width={32} height={32} placeholder={marketplace.name} alt={`Listed on ${marketplace.name}`}/>
                                                </a>
                                            </Link>
                                        </span>
                                    ) : ''}
                                </div>

                                <div className={"p-2"}>
                                    <p className={"text-xl"}>
                                        {nft.name}
                                    </p>
                                    <p className={"text-grey-100 text-sm"}>{nft.collection}</p>
                                    <Floors identifier={collection.identifier} sources={collection.value_source} />
                                </div>
                            </div>
                        )
                    })
                })
                : <Loader/>}
        </section>
    )
}