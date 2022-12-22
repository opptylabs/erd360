import redis from "./redis";
import axios from "axios";

export default async function economics() {
    return redis("economics", async () => {
        const res = await axios({
            method: 'get',
            url: `https://api.elrond.com/economics`,
            timeout: 3000
        })
        return res.data
    }, 60)
}
