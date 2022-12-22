import {request} from "graphql-request";
import _ from "lodash";
import axios from "axios";
import redis from "../redis";

export async function getListedDeadrare(address) {
    const API_ENDPOINT = "https://gateway.deadrare.io/";
    const listedNftsQuery = `query ($wallet: String!) {
      listAuctionsBySeller(sellerAddress: $wallet) {
        nftId
        price
      }
    }`;

    try {
        let listedNfsData = await request(API_ENDPOINT, listedNftsQuery, {
            'wallet': address
        })
        const listedNftIds = _.map(listedNfsData.listAuctionsBySeller, 'nftId')

        const listedNfts = await Promise.all(_.map(listedNftIds, (nft) => {
            return axios({
                method: 'get',
                url: `https://api.elrond.com/nfts/${nft}`,
                timeout: 1500
            })
        }))

        return _.map(listedNfts, (listedNft) => {
            listedNft.data.balance = 1
            listedNft.data.listed = {
                'marketplace': 'DeadRare'
            }
            return listedNft.data
        })
    } catch (e) {

    }
    return []
}

export default async function getCachedListedDeadrare(address) {
    return await redis("nfts_listed_deadrare:" + address, () => getListedDeadrare(address), 900)
}
