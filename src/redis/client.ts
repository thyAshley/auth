import { appConfig } from "./../config/app-config";
import * as redis from "redis";

export const redisClient = redis.createClient({
  url: `redis://default:${appConfig.redis.password}@${appConfig.redis.url}`,
});

(async () => {
  redisClient.on("connect", () => console.log("Redis Client connected..."));
  redisClient.on("ready", () =>
    console.log("Redis Client is ready for use...")
  );
  redisClient.on("error", (error: any) =>
    console.log("Redis Client Error", error)
  );
  redisClient.on("end", () => console.log("redis client disconnected..."));

  process.on("SIGINT", () => redisClient.quit());
  await redisClient.connect();
})();

export const getRedisAsync = async (key: string) => {
  const value = await redisClient.get(key);
  return value;
};
export const setRedisAsync = async (key: string, value: string) => {
  await redisClient.set(key, value);
};
