import redis from "../../../../lib/redis";
import axios from "axios";

export default async function handler(req, res) {
    const address = req.query.address

    const delegations = await redis("delegations:"+address, async () => {
        const res = await axios({
            method: 'get',
            url: `https://delegation-api.elrond.com/accounts/${address}/delegations`,
            timeout: 3000
        })
        return res.data
    }, 300)

    res.end(JSON.stringify(delegations))
}
