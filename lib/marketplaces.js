import * as cheerio from "cheerio";
import {isNumeric} from "./is_numeric";
import {fixBalance} from "./fix_balance";
import _ from "lodash";

export const marketplaces = [
    {
        'name': 'DeadRare',
        'url': 'https://deadrare.io/collection/${ticker}',
        'method': 'puppeteer',
        'timeout': 20000,
        'extract': (html) => {
            const $ = cheerio.load(html, null, false);
            const fp = $('label:contains("FLOOR PRICE") + div > strong').text()
            return isNumeric(fp) ? parseFloat(fp) : null
        },
        'favicon': '/marketplaces/deadrare.png',
        'external_link': 'https://deadrare.io/collection/${ticker}',
        'nft_external_link': 'https://deadrare.io/nft/${identifier}'
    },
    {
        'name': 'Isengard',
        'url': 'https://isengardapiprod.azurewebsites.net/collections/${ticker}',
        'method': 'api',
        'timeout': 2000,
        'extract': (data) => {
            return data.floorPrice && isNumeric(data.floorPrice) ? parseFloat(data.floorPrice) : null
        },
        'favicon': '/marketplaces/isengard.png',
        'external_link': 'https://isengard.market/collection/${ticker}'
    },
    {
        'name': 'Elrond NFT Swap',
        'url': 'https://api.elrondnftswap.com/main/collection/${ticker}?skip=0&limit=1',
        'method': 'api',
        'timeout': 2000,
        'extract': (data) => {
            return data.details.floorPrice && isNumeric(data.details.floorPrice) && parseInt(data.details.floorPrice) > 0 ? fixBalance(parseInt(data.details.floorPrice), 18) : null
        },
        'favicon': '/marketplaces/elrondnftswap.png',
        'external_link': 'https://elrondnftswap.com/collection/${ticker}'
    },
    {
        'name': 'XOXNO',
        'url': 'https://xoxnoapi.azureedge.net/getFloorPrice/${ticker}/EGLD',
        'method': 'api',
        'timeout': 2000,
        'extract': (data) => {
            return parseFloat(data)
        },
        'favicon': '/marketplaces/xoxno.png',
        'external_link': 'https://xoxno.com/collection/${ticker}'
    },
    {
        'name': 'Frame It',
        'url': 'https://api.frameit.gg/api/v1/nftcollection/${ticker}',
        'method': 'api',
        'timeout': 2000,
        'extract': (data) => {
            return data.statistics.floorPrice && isNumeric(data.statistics.floorPrice) && parseInt(data.statistics.floorPrice) > 0 ? parseFloat(data.statistics.floorPrice) : null
        },
        'favicon': '/marketplaces/frameit.png',
        'external_link': 'https://www.frameit.gg/marketplace/${ticker}'
    }
]