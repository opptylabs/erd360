const redis = require("ioredis");

let redisClient

if (process.env && process.env.REDIS_URL) {
    redisClient = new redis(process.env.REDIS_URL)
}

export default async (key, fn, duration) => {
    if (redisClient === undefined) {
       return await fn()
    }

    if (process.env && process.env.REDIS_PREFIX) {
        key = process.env.REDIS_PREFIX + key
    }

    let cache = await redisClient.get(key)
    cache = JSON.parse(cache)

    if (cache && duration > 0) {
        return cache
    }

    const data = await fn()

    if (data !== null && duration > 0) {
        redisClient.set(key, JSON.stringify(data), "EX", (duration ?? 60) * 60)
    }

    return data
}