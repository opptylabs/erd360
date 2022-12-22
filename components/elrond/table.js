import Thumbnail from "./thumbnail";
import _ from "lodash";
import {formatDollar} from "../../lib/format_dollar";
import TokenType from "./token_type";
import Loader from "../loader";
import {formatBalance} from "../../lib/format_balance";
import {useState, Fragment} from "react";
import {ChevronDownIcon} from "@heroicons/react/solid";
import Floors from "./floors";

export default function Table360(props)
{
    let {items} = props.account
    const filterType = props.filterType
    const [expanded, setExpanded] = useState({})
    const [sort, setSort] = useState('value')

    items = _.sortBy(items, (item) => {
        if (sort === 'name') {
            return item.ticker
        } else if (sort === 'type') {
            switch (item.type) {
                case 'token':
                    return 0
                case 'meta':
                    return 1
                case 'nft':
                default:
                    return 2
            }
        } else {
            return -item.valueEgld
        }
    })

    if (filterType !== '') {
        items = _.filter(items, (item) => {
            return item.type === filterType
        })
    }

    if (items.length < 1)
        return (
            <div className="shadow overflow-hidden border border-grey-500 sm:rounded-lg bg-grey-300 p-4">
                {filterType !== '' ? 'No ' + filterType + ' found' : <Loader />}
            </div>
        )

    const canExpand = (item) => {
        return (item.type === 'nft')
    }

    const expandOrReduce = (item) => {
        let copyOfExpanded = { ...expanded }
        if (copyOfExpanded[item.identifier] || !canExpand(item)) {
            delete copyOfExpanded[item.identifier]
        } else {
            copyOfExpanded[item.identifier] = true
        }
        setExpanded({
            ...copyOfExpanded
        })
    }

    return (
        <section className="shadow overflow-x-auto border border-grey-500 sm:rounded-lg">
            <table className={"m table-auto"}>
                <thead>
                    <tr>
                        <th className={"cursor-pointer"} onClick={() => setSort('name')}>Name <ChevronDownIcon className={`w-5 h-5 inline-block ${sort === 'name' ? '' : 'invisible'}`}/></th>
                        <th className={"cursor-pointer"} onClick={() => setSort('type')}>Type <ChevronDownIcon className={`w-5 h-5 inline-block ${sort === 'type' ? '' : 'invisible'}`}/></th>
                        <th className={"cursor-pointer"} onClick={() => setSort('value')}>Value EGLD <ChevronDownIcon className={`w-5 h-5 inline-block ${sort === 'value' ? '' : 'invisible'}`}/></th>
                        <th className={"cursor-pointer"} onClick={() => setSort('value')}>Value USD <ChevronDownIcon className={`w-5 h-5 inline-block ${sort === 'value' ? '' : 'invisible'}`}/></th>
                    </tr>
                </thead>
                <tbody>
                {
                    items.map((item) => (
                        <Fragment key={item.identifier}>
                            <tr onClick={() => expandOrReduce(item)} className={`${canExpand(item) ? 'cursor-pointer' : 'cursor-default'}`}>
                                <td className={""}>
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {
                                                item.nfts ? _.take(item.nfts.map((nft) => (
                                                    <Thumbnail item={nft} key={nft.identifier} className={"rounded-full"} />
                                                )), 1) : <Thumbnail item={item} key={item.identifier} className={"rounded-full"} />
                                            }
                                        </div>
                                        <div className="ml-4">
                                            <div className="">{item.ticker}</div>
                                            <div className={"text-sm text-grey-100"}>{formatBalance(item.balance)}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className={""}><TokenType item={item}/></td>
                                <td className={"text-right"}>{item.valueEgld !== null ? formatBalance(item.valueEgld, 2, 2) : <Loader className={"inline-block text-grey-100"}/>}</td>
                                <td className={"text-right"}>{item.valueUsd !== null ? formatDollar(item.valueUsd) : <Loader className={"inline-block text-grey-100"} />}</td>
                            </tr>
                            {canExpand(item) ?
                                <tr className={`${expanded[item.identifier] ? '' : 'hidden'}`}>
                                    <td className={""} colSpan="4">
                                        <Floors identifier={item.identifier} sources={item.value_source} />
                                        <div className={"my-3 flex flex-wrap"}>
                                            {
                                                item.nfts && (item.type === 'nft') ? item.nfts.map((nft) => (
                                                    <a href={`https://explorer.elrond.com/nfts/${nft.identifier}`} target={"_blank"} className={'my-2 mx-2'} key={`thumb_${nft.identifier}`}>
                                                        <Thumbnail item={nft} key={nft.identifier} size={"64"} className={"rounded-full"} />
                                                    </a>
                                                )) : ''
                                            }
                                        </div>
                                    </td>
                                </tr>
                            : <></>}
                        </Fragment>
                    ))
                }
                </tbody>

            </table>
        </section>
    )
}