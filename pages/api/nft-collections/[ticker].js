import * as puppeteer from 'puppeteer';
import _ from "lodash";
import chromium from 'chrome-aws-lambda';
import redis from "../../../lib/redis";
import axios from "axios";
import {marketplaces} from "../../../lib/marketplaces";

const getTickerFloors = async (collectionTicker) => {
    let browser
    if (process.env.AWS_LAMBDA_FUNCTION_VERSION) {
        browser = await chromium.puppeteer.launch({
            args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath,
            headless: true,
            ignoreHTTPSErrors: true,
        })
    } else {
        browser = await puppeteer.launch();
    }

    const page = await browser.newPage();

    let results = {}

    let marketplace
    let html
    for (let m = 0; m < marketplaces.length; m++) {
        marketplace = marketplaces[m]

        if (marketplace.method === 'puppeteer') {
            await page.goto(marketplace.url.replace('${ticker}', collectionTicker), {
                timeout: marketplace.timeout,
                waitUntil: 'domcontentloaded'
            });
            if (marketplace.wait && marketplace.wait > 0) {
                await page.waitForTimeout(marketplace.wait);
            }
            html = await page.content();

            const fp = await marketplace.extract(html)
            if (fp) {
                results[marketplace.name] = fp
            }
        }
    }

    await browser.close();

    for (let m = 0; m < marketplaces.length; m++) {
        marketplace = marketplaces[m]

        if (marketplace.method === 'api') {
            try {
                const res = await axios({
                    method: 'get',
                    url: marketplace.url.replace('${ticker}', collectionTicker),
                    timeout: marketplace.timeout
                })
                const fp = marketplace.extract(res.data)
                if (fp) {
                    results[marketplace.name] = fp
                }
            } catch (err) {

            }
        }
    }

    return results
}

const getCachedTickerFloors = async (collectionTicker) => {
    return redis("floor:"+collectionTicker, async () => {
        return await getTickerFloors(collectionTicker)
    }, 300)
}

const getFloorPrice = async (collectionTickers) => {
    let floorprices = []
    let collectionTicker
    for (let t = 0; t < Math.min(collectionTickers.length, 5); t++) {
        collectionTicker = collectionTickers[t]
        if (!floorprices[collectionTicker]) {
            const floorprice = await getCachedTickerFloors(collectionTicker)
            floorprices[t] = {
                'name': collectionTicker,
                'floor_price': _.min(_.values(floorprice)),
                'detail': floorprice
            }
        }
    }

    return floorprices
}

export default async function handler(req, res) {
    res.end(JSON.stringify(await getFloorPrice(req.query.ticker.split(','))))
}
