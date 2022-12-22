import redis from "../../../../lib/redis";
import {fixBalance} from "../../../../lib/fix_balance";
import { ProxyNetworkProvider } from "@elrondnetwork/erdjs-network-providers";
import { Address,  SmartContract, ContractFunction, AddressValue } from "@elrondnetwork/erdjs";

export default async function handler(req, res) {
    const address = req.query.address

    const metabondings = await redis("metabondings:"+address, async () => {
        let networkProvider = new ProxyNetworkProvider("https://gateway.elrond.com");
        let stakingContract = new SmartContract({address: new Address("erd1qqqqqqqqqqqqqpgqt7tyyswqvplpcqnhwe20xqrj7q7ap27d2jps7zczse")});

        let query = stakingContract.createQuery({
            func: new ContractFunction("getStakedAmountForUser"),
            args: [new AddressValue(new Address(address))]
        });

        let queryResponse = await networkProvider.queryContract(query);

        if (queryResponse.returnCode !== 'ok') {
            return []
        }

        const [encoded] = queryResponse.returnData;

        let stackedLkMex = 0
        if (encoded !== undefined && encoded !== '') {
            let decoded = Buffer.from(encoded, 'base64').toString('hex');
            decoded = parseInt(decoded, 16)
            stackedLkMex = fixBalance(decoded, 18)
        }

        if (stackedLkMex > 0) {
            return [{
                'name': 'LKMEX Staked Metabonding',
                'ticker': 'LKMEX-METABONDING',
                'identifier': 'LKMEX-METABONDING',
                'balance': stackedLkMex
            }]
        }

        return []
    }, 300)

    res.end(JSON.stringify(metabondings))
}
