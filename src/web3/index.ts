import { Connection, PublicKey } from "@solana/web3.js";
import { RAYDIUM_AUTHORITY_V4, RAYDIUM_UPGRADE_AUTHORITY, WRAPPED_SOL } from "./constants";
import { getAccountData } from "./utils";
import { Metaplex } from "@metaplex-foundation/js";

export const monitorNewTokens = async (connection: Connection) => {
    console.log("Monitoring new solana tokens....");

    try {
        connection.onLogs(RAYDIUM_UPGRADE_AUTHORITY, async ({ logs, err, signature }) => {
            if(err) {
                console.log(`Error logging new tokens: ${err}`);
                return;
            }

            console.log(`Found new token with this signature: ${signature}`);

            let signer = '';
            let baseAddress = '';
            let baseDecimals = 0;
            let baseLpAmount = 0;
            let quoteAddress = '';
            let quoteDecimals = 0;
            let quoteLpAmount = 0;
            let metadata = {};

            const tx = await connection.getParsedTransaction(signature, {
                maxSupportedTransactionVersion: 0,
                commitment: "confirmed"
            });

            if(tx && tx.meta?.err == null) {
                console.log(`Successfully parsed transaction: ${tx}`);

                signer = tx.transaction.message.accountKeys[0].pubkey.toString();

                console.log(`Creator: ${signer}`);

                const postTokenBalances = tx.meta?.postTokenBalances;

                const baseInfo = postTokenBalances?.find(
                    (balance) => balance.owner == RAYDIUM_AUTHORITY_V4 && balance.mint != WRAPPED_SOL
                );
                
                if (baseInfo) {
                    baseAddress = baseInfo.mint;
                    baseDecimals = baseInfo.uiTokenAmount.decimals;
                    baseLpAmount = baseInfo.uiTokenAmount.uiAmount!;
                }

                const quoteInfo = postTokenBalances?.find(
                    (balance) => balance.owner == RAYDIUM_AUTHORITY_V4 && balance.mint == WRAPPED_SOL
                );

                if (quoteInfo) {
                    quoteAddress = quoteInfo.mint;
                    quoteDecimals = quoteInfo.uiTokenAmount.decimals;
                    quoteLpAmount = quoteInfo.uiTokenAmount.uiAmount!;
                }

                const metaplex = Metaplex.make(connection);
                const mint = new PublicKey(baseAddress);

                const metadataAccount = metaplex.nfts().pdas().metadata({ mint });
                const metadataAccountData = await getAccountData(connection, metadataAccount);

                if(metadataAccountData) {
                    metadata = await metaplex.nfts().findByMint({ mintAddress: mint });
                    console.log(metadata);
                }

                const newTokenData = {
                    lpSignature: signature,
                    creator: signer,
                    timestamp: new Date().toISOString(),
                    baseInfo: {
                        baseAddress,
                        baseDecimals,
                        baseLpAmount,
                    },
                    quoteInfo: {
                        quoteAddress: quoteAddress,
                        quoteDecimals: quoteDecimals,
                        quoteLpAmount: quoteLpAmount,
                    },
                    metadata: metadata,
                    logs: logs
                };

                console.log(newTokenData);
            }
        }, "confirmed");
    } catch (error) {
        console.log(`An error has occured in the SOL monitor: ${error}`);
    }
}