import _ from "lodash";
import axios from "axios";
import redis from "../redis";

export async function getStakedApes(address) {

    const collectionTicker = 'EAPES-8f3c1f-'

    const pools = [
        'erd1qqqqqqqqqqqqqpgq50t0ma43rr3895lq7dhgm786kdvfwlyq386qafuqhu',
        'erd1qqqqqqqqqqqqqpgqahqrk6s2tsh278n64mmk3j7gcr29qkv9386q5h22se',
        'erd1qqqqqqqqqqqqqpgqnk6e6mrs0kdsusdt7hshpql6y4pcczwu386qjzhk63',
        'erd1qqqqqqqqqqqqqpgq67d2pnfg6f6td7lxq8x0rtzylhkt32gs386qh8vtv3',
        'erd1qqqqqqqqqqqqqpgqz4wny33hhrnzsy4d9x3xzg749xpwe62f386qkwyw3x',
        'erd1qqqqqqqqqqqqqpgq5ycqhnggkjvqal259pmzauvg6rm2f232386qfsk5lc',
        'erd1qqqqqqqqqqqqqpgqjengc6lmwh2lete065ndjczsf3dns7y3386qlteynl',
    ]

    const poolsUser = await Promise.all(_.map(pools, (pool) => {
        return axios({
            method: 'get',
            url: `https://ms.elrondapes.com/staking/pools/${pool}/users/${address}`,
            timeout: 3000
        })
    }))

    let stackedApes = _.flatten(_.map(poolsUser, (poolUser) => {
        if (poolUser.data && poolUser.data.poolUserInfo && poolUser.data.poolUserInfo.stakedNonce) {
            return _.map(_.values(poolUser.data.poolUserInfo.stakedNonce), 'nonce')
        }
        return []
    }))

    stackedApes = _.map(stackedApes, (stackedApe) => {
        return `${collectionTicker}${stackedApe.toString(16).padStart(4, '0')}`;
    })

    const listedNfts = await Promise.all(_.map(stackedApes, (nft) => {
        return axios({
            method: 'get',
            url: `https://api.elrond.com/nfts/${nft}`,
            timeout: 1500
        })
    }))

    return _.map(listedNfts, (listedNft) => {
        listedNft.data.balance = 1
        listedNft.data.stacked = true
        return listedNft.data
    })
}

export default async function getCachedStakedApes(address) {
    return await redis("nfts_stakedapes:" + address, () => getStakedApes(address), 900)
}
