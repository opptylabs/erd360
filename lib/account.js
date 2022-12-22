import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import _ from "lodash";
import {fixBalance} from "./fix_balance";
import {formatBalance} from "./format_balance";
import {formatDollar} from "./format_dollar";

const fetcher = (...args) => fetch(...args).then(res => {
    if (!res.ok) {
        const error = new Error(res.status)
        error.status = res.status
        throw error
    }
    return res.json()
})

const getUrl = function getUrl(address, item) {
    return address ? `https://api.elrond.com/accounts/${address}/${item}` : null
}

const reduce = function reduce(resNft, resNftFloors, resTokens, resAccount, resDelegationLegacy, resDelegation, resMetabonding, tokens, economics) {
    let account = {}

    const egldPrice = economics && economics.price ? parseFloat(economics.price) : 0

    account.items = []

    _.each(resTokens.data, (token) => {
        if (!token.balance_origin) {
            token.balance_origin = token.balance
            token.balance = fixBalance(token.balance_origin, token.decimals)
        }
        if (token.identifier_origin == null) {
            token.identifier_origin = token.identifier
        }
        if (!token.ticker) {
            token.ticker = token.identifier_origin
        }
        token.identifier = token.ticker
        token.valueUsd = tokens[token.identifier_origin] ? token.balance * tokens[token.identifier_origin] : 0
        token.valueEgld = (egldPrice > 0) ? (token.valueUsd / egldPrice) : 0
        token.type = 'token'
        if (tokens[token.identifier_origin]) {
            token.value_source = {
                'Maiar Exchange': formatDollar(tokens[token.identifier_origin])
            }
        }
        account.items.push(_.pick(token, ['name', 'ticker', 'identifier', 'balance', 'valueUsd', 'valueEgld', 'type', 'assets', 'value_source']))
    })

    if (resAccount && resAccount.data && resAccount.data.balance && resAccount.data.balance > 0) {
        account.items.push({
            'name': 'EGLD',
            'ticker': 'EGLD',
            'identifier': 'EGLD',
            'valueUsd': fixBalance(resAccount.data.balance, 18) * egldPrice,
            'valueEgld': fixBalance(resAccount.data.balance, 18),
            'balance': fixBalance(resAccount.data.balance, 18),
            'type' : 'token',
            'value_source': {
                'Elrond API': formatDollar(egldPrice)
            }
        })
    }

    if (resDelegationLegacy && resDelegationLegacy.data) {
        const delegatedBalance = parseInt(resDelegationLegacy.data.claimableRewards) + parseInt(resDelegationLegacy.data.userActiveStake) + parseInt(resDelegationLegacy.data.userDeferredPaymentStake) + parseInt(resDelegationLegacy.data.userUnstakedStake) + parseInt(resDelegationLegacy.data.userWaitingStake) + parseInt(resDelegationLegacy.data.userWithdrawOnlyStake)
        if (delegatedBalance > 0) {
            const balance = fixBalance(delegatedBalance, 18)
            account.items.push({
                'name': 'EGLD Delegated',
                'ticker': 'DELEGATED-EGLD',
                'identifier': 'DELEGATED-EGLD',
                'valueUsd': balance * egldPrice,
                'valueEgld': balance,
                'balance': balance,
                'type' : 'token',
                'value_source': {
                    'Elrond API': formatDollar(egldPrice)
                }
            })
        }
    }

    if (resDelegation && resDelegation.data) {
        const stakedBalance = _.sum(_.map(resDelegation.data, (delegation) => {
            return parseFloat(delegation.userUnBondable) + parseFloat(delegation.userActiveStake) + parseFloat(delegation.claimableRewards)
        }))
        if (stakedBalance > 0) {
            account.items.push({
                'name': 'EGLD Staked',
                'ticker': 'STAKED-EGLD',
                'identifier': 'STAKED-EGLD',
                'valueUsd': fixBalance(stakedBalance, 18) * egldPrice,
                'valueEgld': fixBalance(stakedBalance, 18),
                'balance': fixBalance(stakedBalance, 18),
                'type' : 'token',
                'value_source': {
                    'Elrond API': formatDollar(egldPrice)
                }
            })
        }
    }

    if (resMetabonding && resMetabonding.data) {
        _.map(resMetabonding.data, (token) => {
            const valueUsd = tokens[token.identifier] ? token.balance * tokens[token.identifier] : 0
            account.items.push({
                'name': token.name,
                'ticker': token.ticker,
                'identifier': token.identifier,
                'valueUsd': valueUsd,
                'valueEgld': (egldPrice > 0) ? (valueUsd / egldPrice) : 0,
                'balance': token.balance,
                'type' : 'token',
                'value_source': {
                    'Maiar Exchange': formatDollar(tokens[token.identifier])
                }
            })
        })
    }

    const floors = resNftFloors && resNftFloors.data ? _.keyBy(_.flatten(resNftFloors.data), 'name') : {}

    _.each(_.groupBy(_.filter(resNft.data, (nft) => {
        return nft.type !== 'MetaESDT'
    }), 'collection'), (collection) => {
        let value_source = {}
        const type = _.first(collection).type

        const balance = type === 'SemiFungibleESDT' ? _.sumBy(collection, (nft) => parseInt(nft.balance)) : collection.length

        const ticker = _.first(collection).collection
        let valueUsdc = null
        let valueEgld = null

        let floorprice  = 0
        if (floors[ticker]) {
            floorprice = floors[ticker].floor_price || 0
            valueEgld = balance * floorprice
            valueUsdc = egldPrice > 0 ? (valueEgld * egldPrice) : 0
            value_source = _.mapValues(floors[ticker].detail, (v) => formatBalance(v))
        }

        account.items.push({
            name: ticker,
            ticker: ticker,
            valueUsd: valueUsdc,
            valueEgld: valueEgld,
            identifier: ticker,
            balance: balance,
            type: 'nft',
            nfts: collection,
            value_source: value_source
        })
    })

    _.each(_.filter(resNft.data, {type: 'MetaESDT'}), (nft) => {
        const decimals = nft.decimals ?? 0

        let value_source = {}

        const balance = fixBalance(nft.balance, decimals)
        let valueUsdc = 0
        let valueEgld = 0
        const valueRef = tokens[nft.identifier] ? tokens[nft.identifier] : (tokens[nft.collection] ? tokens[nft.collection] : null)
        if (valueRef) {
            valueUsdc = balance * valueRef
            valueEgld = egldPrice > 0 ? (valueUsdc / egldPrice) : 0
            value_source = {
                'Maiar Exchange': formatDollar(valueRef)
            }
        }

        account.items.push({
            name: nft.collection,
            ticker: nft.identifier,
            valueUsd: valueUsdc,
            valueEgld: valueEgld,
            identifier: nft.identifier,
            balance: balance,
            type: 'meta',
            assets: nft.assets,
            value_source: value_source
        })
    })

    account.pair = parseFloat(egldPrice)

    account.isLoading = !resNft.error && !resTokens.error && !resAccount.error && (!resNft.data || !resTokens.data || !resAccount.data)
    account.isError = resNft.error || resTokens.error || resAccount.error

    account.valueUsd = _.sumBy(account.items, 'valueUsd')
    account.valueEgld = _.sumBy(account.items, 'valueEgld')

    return account
}

const pluckNftCollectionTickers = function(data) {
    const uniq = _.filter(_.uniqBy(data, 'collection'), (nft) => {
        return !nft.decimals || nft.decimals === 0
    })
    return _.map(uniq, 'collection')
}

export function useData(address, tokens, economics) {
    const refreshInterval = 10 * 60000
    const resNft = useSWR(address ? `/api/accounts/${address}/nfts` : null, fetcher, { refreshInterval: refreshInterval })

    const tickers = pluckNftCollectionTickers(resNft.data)
    const getKey = (pageIndex) => {
        if (pageIndex > tickers.length) {
            return null
        }
        return tickers[pageIndex] ? `/api/nft-collections/${tickers[pageIndex]}` : null
    }
    const resNftFloors = useSWRInfinite(getKey, fetcher)
    if (tickers.length > 0 && resNftFloors.size !== tickers.length) {
        resNftFloors.setSize(tickers.length)
    }

    const resTokens = useSWR(getUrl(address, 'tokens'), fetcher, { refreshInterval: refreshInterval })
    const resDelegationLegacy = useSWR(getUrl(address, 'delegation-legacy'), fetcher, { refreshInterval: refreshInterval })
    const resDelegation = useSWR(address ? `/api/accounts/${address}/delegations` : null, fetcher, { refreshInterval: refreshInterval })
    const resAccount = useSWR(getUrl(address, ''), fetcher, { refreshInterval: refreshInterval })
    const resMetabonding = useSWR(address ? `/api/accounts/${address}/metabonding` : null, fetcher, { refreshInterval: refreshInterval })

    return reduce(resNft, resNftFloors, resTokens, resAccount, resDelegationLegacy, resDelegation, resMetabonding, tokens, economics)
}