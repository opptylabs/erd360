import {request} from "graphql-request";
import _ from "lodash";
import redis from "../redis";

const API_ENDPOINT = "https://graph.maiar.exchange/graphql";
const pairsQuery = `query {
  stakingFarms {
    farmToken {
      collection
    }
    farmingToken {
      identifier
    }
  }
  pairs(offset: 0, limit: 500) {
    state
    firstToken {
      identifier
      decimals
    }
    firstTokenPriceUSD
    secondToken {
      identifier
      decimals
    }
    secondTokenPriceUSD
    liquidityPoolToken {
      identifier
    }
    liquidityPoolTokenPriceUSD
  }
  farms {
    farmToken {
      collection
    }
    farmingToken {
      identifier
    }
  }
}`;

export default async function tokens() {
    return redis("tokens", async () => {
        let data = await request(API_ENDPOINT, pairsQuery)

        let tokens = {}

        _.each(data.pairs, (pair) => {
            if ("Active" === pair.state || "ActiveNoSwaps" === pair.state) {
                tokens[pair.firstToken.identifier] = parseFloat(pair.firstTokenPriceUSD)
                tokens[pair.secondToken.identifier] = parseFloat(pair.secondTokenPriceUSD)

                if (pair.liquidityPoolToken.identifier === 'EGLDUSDC-594e5e') {
                    tokens[pair.liquidityPoolToken.identifier] = parseFloat(pair.liquidityPoolTokenPriceUSD) * 2 / 1e+12
                } else {
                    tokens[pair.liquidityPoolToken.identifier] = parseFloat(pair.liquidityPoolTokenPriceUSD)
                }
            }
        })

        _.each(data.farms, (farm) => {
            if (tokens[farm.farmingToken.identifier]) {
                tokens[farm.farmToken.collection] = tokens[farm.farmingToken.identifier]
            }
        })

        _.each(data.stakingFarms, (farm) => {
            if (tokens[farm.farmingToken.identifier]) {
                tokens[farm.farmToken.collection] = tokens[farm.farmingToken.identifier]
            }
        })

        if (tokens['MEX-455c57']) {
            tokens['LKMEX-aab910'] = tokens['MEX-455c57']
            tokens['LKFARM-9d1ea8'] = tokens['MEX-455c57']
            tokens['LKMEX-METABONDING'] = tokens['MEX-455c57']
        }
        tokens['LKFARM-9d1ea8-6a0e4a'] = tokens['EGLDMEX-0be9e5']
        tokens['LKFARM-9d1ea8-6b3fe8'] = tokens['EGLDMEX-0be9e5']
        tokens['LKFARM-9d1ea8-6a55f9'] = tokens['EGLDMEX-0be9e5']
        tokens['LKFARM-9d1ea8-6deaf1'] = tokens['EGLDMEX-0be9e5']
        tokens['LKLP-03a2fa'] = tokens['EGLDMEX-0be9e5']

        return tokens
    }, 300)
}
