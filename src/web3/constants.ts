import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { config } from "dotenv";

config();

export const RPC_ENDPOINT = process.env.RPC_ENDPOINT ?? clusterApiUrl("mainnet-beta");
export const RPC_WS_ENDPOINT = process.env.RPC_WS_ENDPOINT ?? "wss://api.mainnet-beta.solana.com";

export const RAYDIUM_UPGRADE_AUTHORITY = new PublicKey('7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5');
export const RAYDIUM_AUTHORITY_V4 = "5Q544fKrFoe6tsEbD7S8EmxGTJYAKtTVhAW5Q5pge4j1";
export const WRAPPED_SOL = "So11111111111111111111111111111111111111112";

export const connection = new Connection(RPC_ENDPOINT, {
    wsEndpoint: RPC_WS_ENDPOINT
});