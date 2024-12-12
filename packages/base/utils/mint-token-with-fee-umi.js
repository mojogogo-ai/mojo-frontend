// import * as anchor from "@coral-xyz/anchor";
import { 
    // createSignerFromKeypair,
    keypairIdentity, 
    percentAmount,
    generateSigner,
    // sol,
    transactionBuilder,
    // publicKey,
    // Keypair as UmiKeypair,
    lamports,
    // Signer,
} from '@metaplex-foundation/umi';
import { 
    // createV1,
    TokenStandard,
    createAndMint,
} from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsKeypair } from "@metaplex-foundation/umi-web3js-adapters";
import base58 from "bs58";

// Constants
// const SOL_FEE_AMOUNT = lamports(bigint(0.02)); // 0.02 SOL in lamports
const SOL_FEE_AMOUNT = 0.02; // 0.02 SOL in lamports

// interface TokenMetadata {
//     name: string;
//     symbol: string;
//     uri: string;
// }

export async function createAtomicMintWithFee(
    provider,
    metadata,
    totalSupply
) {
    // Initialize Umi
    const umi = createUmi(provider.connection)
        .use(keypairIdentity(fromWeb3JsKeypair(provider.wallet.payer)));

    // Generate signers for mint and fee collector
    const mintSigner = generateSigner(umi);
    const feeCollectorSigner = generateSigner(umi);
    
    console.log("Initializing transaction...");
    console.log("Mint Address:", mintSigner.publicKey);
    console.log("Fee Collector:", feeCollectorSigner.publicKey);

    // Calculate token amounts
    const decimals = 6;
    const totalTokenAmount = totalSupply * Math.pow(10, decimals);
    const feeAmount = Math.floor(totalTokenAmount * 0.1); // 10% fee
    const userAmount = totalTokenAmount - feeAmount;

    // Create transaction builder
    let builder = transactionBuilder()
        // Add SOL fee transfer
        .add({
            instruction: umi.programs.system.transfer({
                source: umi.identity.publicKey,
                destination: feeCollectorSigner.publicKey,
                amount: SOL_FEE_AMOUNT,
            }),
            signers: [umi.identity],
        });

    // Create and mint token with metadata
    builder = builder.add(
        createAndMint(umi, {
            mint: mintSigner,
            authority: umi.identity,
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: percentAmount(0),
            decimals,
            amount: totalTokenAmount,
            tokenOwner: umi.identity.publicKey,
            tokenStandard: TokenStandard.Fungible,
        })
    );

    // Add token transfer to fee collector
    builder = builder.add({
        instruction: umi.programs.token.transfer({
            source: umi.identity.publicKey,
            destination: feeCollectorSigner.publicKey,
            amount: { basisPoints: BigInt(feeAmount), decimals },
            mint: mintSigner.publicKey,
        }),
        signers: [umi.identity],
    });

    // Get fee estimate
    const feeEstimate = await builder.feeEstimate(umi);
    const totalCost = feeEstimate.total.basisPoints + SOL_FEE_AMOUNT.basisPoints;
    
    console.log("\nEstimated costs (in SOL):");
    console.log(`Gas fee: ${Number(feeEstimate.total.basisPoints) / Math.pow(10, 9)}`);
    console.log(`Protocol fee: ${Number(SOL_FEE_AMOUNT.basisPoints) / Math.pow(10, 9)}`);
    console.log(`Total cost: ${Number(totalCost) / Math.pow(10, 9)}`);

    // Check balance
    const balance = await umi.rpc.getBalance(umi.identity.publicKey);
    if (balance.basisPoints < totalCost) {
        throw new Error(
            `Insufficient balance. Need ${Number(totalCost) / Math.pow(10, 9)} SOL but got ${Number(balance.basisPoints) / Math.pow(10, 9)} SOL`
        );
    }

    console.log("\nSending transaction...");
    try {
        const result = await builder.sendAndConfirm(umi);
        
        console.log("Transaction successful!");
        console.log("Signature:", base58.encode(result.signature));
        console.log("\nToken Distribution:");
        console.log(`Total Supply: ${totalTokenAmount / Math.pow(10, decimals)} tokens`);
        console.log(`Fee Amount (10%): ${feeAmount / Math.pow(10, decimals)} tokens`);
        console.log(`User Amount: ${userAmount / Math.pow(10, decimals)} tokens`);
        
        return {
            signature: base58.encode(result.signature),
            mintAddress: mintSigner.publicKey,
            mintSecretKey: base58.encode(mintSigner.secretKey),
            feeCollectorAddress: feeCollectorSigner.publicKey,
            feeCollectorSecretKey: base58.encode(feeCollectorSigner.secretKey),
            totalCostInSol: Number(totalCost) / Math.pow(10, 9)
        };
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
}

// Example usage
// const metadata = {
//     name: "Your Token Name",
//     symbol: "SYMBOL",
//     uri: "your-token-metadata-uri",
// };

// const TOTAL_SUPPLY = 1000000; // 1 million tokens

// async function main() {
//     const provider = anchor.AnchorProvider.env();
//     anchor.setProvider(provider);
    
//     const result = await createAtomicMintWithFee(
//         provider,
//         metadata,
//         TOTAL_SUPPLY
//     );

//     console.log("\nToken Mint Information:");
//     console.log("Mint Address:", result.mintAddress);
//     console.log("Mint Secret Key:", result.mintSecretKey);
//     console.log("\nFee Collector Information:");
//     console.log("Fee Collector Address:", result.feeCollectorAddress);
//     console.log("Fee Collector Secret Key:", result.feeCollectorSecretKey);
//     console.log("\nTotal Cost Paid:", result.totalCostInSol, "SOL");
// }

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
// });
