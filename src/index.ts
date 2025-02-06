
import Client, {
    CommitmentLevel,
    SubscribeRequest,
    SubscribeUpdate,
    SubscribeUpdateTransaction,
} from "@triton-one/yellowstone-grpc";
import { Message, CompiledInstruction, TokenBalance } from "@triton-one/yellowstone-grpc/dist/grpc/solana-storage";
import { ClientDuplexStream } from '@grpc/grpc-js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import buyToken from "./pumputils/utils/buyToken";
import dotenv from 'dotenv';
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token";
import sellToken from "./pumputils/utils/sellToken";
import { sleep } from "./utils/commonFunc";
import fs from "fs";
dotenv.config()

// Constants
const ENDPOINT = process.env.GRPC_ENDPOINT!;
const PUMP_FUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
const PUMP_FUN_CREATE_IX_DISCRIMINATOR = Buffer.from([24, 30, 200, 40, 5, 28, 7, 119]);
const COMMITMENT = CommitmentLevel.PROCESSED;

// console.log('WEBSOCKET_RPC_ENDPOINT => ', process.env.WEBSOCKET_RPC_ENDPOINT)

const solanaConnection = new Connection(process.env.RPC_ENDPOINT!, 'processed');
export const keypair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY!));
const amount = process.env.BUY_AMOUNT;
let jitoFee = Number(process.env.JITO_FEE);

const title = `
██████╗ ██╗   ██╗███╗   ███╗██████╗ ███████╗██╗   ██╗███╗   ██╗    ███████╗███╗   ██╗██╗██████╗ ███████╗██████╗ 
██╔══██╗██║   ██║████╗ ████║██╔══██╗██╔════╝██║   ██║████╗  ██║    ██╔════╝████╗  ██║██║██╔══██╗██╔════╝██╔══██╗
██████╔╝██║   ██║██╔████╔██║██████╔╝█████╗  ██║   ██║██╔██╗ ██║    ███████╗██╔██╗ ██║██║██████╔╝█████╗  ██████╔╝
██╔═══╝ ██║   ██║██║╚██╔╝██║██╔═══╝ ██╔══╝  ██║   ██║██║╚██╗██║    ╚════██║██║╚██╗██║██║██╔═══╝ ██╔══╝  ██╔══██╗
██║     ╚██████╔╝██║ ╚═╝ ██║██║     ██║     ╚██████╔╝██║ ╚████║    ███████║██║ ╚████║██║██║     ███████╗██║  ██║
╚═╝      ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝      ╚═════╝ ╚═╝  ╚═══╝    ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝
                                                                                                                     
------------------------------------------ Version 5.2.0 -------------------------------------------------------

`;

let priorityFee = 0.0001;
let ataRent = 0.002;
let solAmountBeforeBuy;
let solAmountAfterBuy;
let buySolAmount;

console.log(title, '\n');
console.log('Your Pubkey => ', keypair.publicKey.toBase58(), '\n');
console.log('Buy Amount =>', amount, '\n');
console.log('Jito fee => ', process.env.JITO_FEE!, '\n');
console.log('Price check interval => ', process.env.PRICE_CHECK_INTERVAL, '\n');
console.log('Take profit => ', process.env.TAKE_PROFIT!, '\n');
console.log('Stop loss => ', process.env.STOP_LOSS!, '\n');
console.log('Sell Slippage => ', process.env.SELL_SLIPPAGE!, '\n');
console.log('Skip selling if lost more than => ', process.env.SKIP_SELLING_IF_LOST_MORE_THAN!, '\n');
console.log('Price check duration => ', process.env.PRICE_CHECK_DURATION!, '\n');
console.log('Auto sell => ', process.env.AUTO_SELL!, '\n');
console.log('Max sell retries => ', process.env.MAX_SELL_RETRIES!, '\n');

function handleStreamEvents(stream: ClientDuplexStream<SubscribeRequest, SubscribeUpdate>): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        stream.on('data', async (data) => {
            const result = await handleData(data)
            if (result) {
                stream.end();
            }
        });
        stream.on("error", (error: Error) => {
            console.error('Stream error:', error);
            reject(error);
            stream.end();
        });
        stream.on("end", () => {
            console.log('Stream ended');
            resolve();
        });
        stream.on("close", () => {
            console.log('Stream closed');
            resolve();
        });
    });
}



async function handleData(data: SubscribeUpdate) {
    if (isStopped) {
        return; // Skip processing if the stream is stopped
    }

    if (!isSubscribeUpdateTransaction(data) || !data.filters.includes('pumpFun')) {
        return;
    }

    const transaction = data.transaction?.transaction;
    const message = transaction?.transaction?.message;

    // console.log("transaction", transaction)


    const formattedSignature = convertSignature(transaction.signature);

    const formattedData = formatData(message, formattedSignature.base58, data.transaction.slot);
    // custom part--------------------------------------------------------------
    if (formattedData) {
        console.log("transaction.", data)
        saveToJSONFile("mint.json", data);
        console.log("Token balance.", data.transaction.transaction?.meta?.postTokenBalances[1].uiTokenAmount?.uiAmount)
        // console.log("transaction transaction meta.", data.transaction.transaction?.meta)

        // console.log("transaction logMessages.", data.transaction.transaction?.meta?.logMessages)
        // console.log("transaction account.", data.transaction.transaction?.transaction?.signatures)
        // console.log("transaction. message", data.transaction.transaction?.transaction?.message)
        // console.log("transaction. meta", transaction.meta?.preBalances)
        isStopped = true; // Set the flag to prevent further handling
        console.log("====================================== 💊 New Pump.fun Mint Detected! ======================================", '\n');
        //custom start
        solAmountBeforeBuy = await solanaConnection.getBalance(keypair.publicKey);
        console.log("solAmountBeforeBuy=======>", solAmountBeforeBuy, '\n')
        console.log('Detecting Time => ', Date.now(), '\n')
        console.log("Signature => ", `https://solscan.io/tx/${formattedData.signature}`, '\n');
        console.log("Mint => ", `https://solscan.io/token/${formattedData.mint.toString()}`, '\n');
        const mintPub = new PublicKey(formattedData.mint.toString());



        isStopped = false;
        return true
    }
    //--------------------------------------------------------------------------
}

export function formatDate() {
    const options: any = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'UTC',
        timeZoneName: 'short'
    };

    const now = new Date();
    return now.toLocaleString('en-US', options);
}

function isSubscribeUpdateTransaction(data: SubscribeUpdate): data is SubscribeUpdate & { transaction: SubscribeUpdateTransaction } {
    return (
        'transaction' in data &&
        typeof data.transaction === 'object' &&
        data.transaction !== null &&
        'slot' in data.transaction &&
        'transaction' in data.transaction
    );
}

function convertSignature(signature: Uint8Array): { base58: string } {
    return { base58: bs58.encode(Buffer.from(signature)) };
}


function matchesInstructionDiscriminator(ix: CompiledInstruction): boolean {
    return ix?.data && FILTER_CONFIG.instructionDiscriminators.some(discriminator =>
        Buffer.from(discriminator).equals(ix.data.slice(0, 8))
    );
}

export const runBot = () => {
    main().catch((err) => {
        console.error('Unhandled error in main:', err);
        process.exit(1);
    });

}


export const saveToJSONFile = (filePath: string, data: object): boolean => {
    // Convert data object to JSON string
    const jsonData = JSON.stringify(data, null, 2);  // The `null, 2` argument formats the JSON with indentation
    fs.writeFileSync(filePath, jsonData, 'utf8');
    console.log('Data saved to JSON file.');
    return true;
};
runBot();

