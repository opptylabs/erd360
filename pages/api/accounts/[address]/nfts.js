import redis from "../../../../lib/redis";
import axios from "axios";
import _ from "lodash";
import getCachedListedDeadrare from "../../../../lib/fetch/nfts_listed_deadrare";
import getCachedStakedApes from "../../../../lib/fetch/nfts_apes";
import {isNumeric} from "../../../../lib/is_numeric";

export default async function handler(req, res) {
    const address = req.query.address

    const nfts = await redis("nfts:"+address, async () => {
        const resCount = await axios({
            method: 'get',
            url:  `https://api.elrond.com/accounts/${address}/nfts/count`,
            timeout: 15000
        })

        const count = isNumeric(resCount.data) ? resCount.data : 30

        const res = await axios({
            method: 'get',
            url:  `https://api.elrond.com/accounts/${address}/nfts?size=${count}`,
            timeout: 3000
        })

        const listedDeadrareNfts = await getCachedListedDeadrare(address)
        const stackedApesNfts = await getCachedStakedApes(address)

        return _.union(res.data, listedDeadrareNfts, stackedApesNfts)

    }, 300)

    res.end(JSON.stringify(nfts))
}
