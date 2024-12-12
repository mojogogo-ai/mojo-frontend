import * as anchor from "@coral-xyz/anchor";
import {
    PublicKey,
    LAMPORTS_PER_SOL,
    SystemProgram,
    Transaction,
    sendAndConfirmTransaction,
    Connection,
    Keypair
} from "@solana/web3.js";
import {
    TOKEN_PROGRAM_ID,
    createMintToInstruction,
    createTransferInstruction,
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    createInitializeMintInstruction,
    MintLayout,
} from "@solana/spl-token";
import {
    createAndMint, createMetadataAccountV3,
    MPL_TOKEN_METADATA_PROGRAM_ID, mplTokenMetadata, TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58";
import {
    fromWeb3JsKeypair,
    fromWeb3JsPublicKey,
    toWeb3JsInstruction,
    toWeb3JsPublicKey
} from "@metaplex-foundation/umi-web3js-adapters";
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";
import {createSignerFromKeypair, keypairIdentity, percentAmount} from "@metaplex-foundation/umi";
import {
    CreateMetadataAccountV3InstructionArgs
} from "@metaplex-foundation/mpl-token-metadata/dist/src/generated/instructions/createMetadataAccountV3";


// Fee collector wallet - Replace with your actual fee collector wallet address
const SOL_FEE_AMOUNT = 0.02 * LAMPORTS_PER_SOL; // 0.02 SOL in lamports

const TOKEN_METADATA_PROGRAM_ID = toWeb3JsPublicKey(MPL_TOKEN_METADATA_PROGRAM_ID);

interface TokenMetadata {
    name: string;
    symbol: string;
    uri: string;
}

async function estimateTransactionFee(
    connection: Connection,
    transaction: Transaction,
    feePayer: PublicKey
): Promise<number> {
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = feePayer;

    const fees = await transaction.getEstimatedFee(connection);
    return fees || 0;
}

async function findMetadataPda(mint: PublicKey): Promise<PublicKey> {
    const [metadataPda] = PublicKey.findProgramAddressSync(
        [
            Buffer.from('metadata'),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer(),
        ],
        TOKEN_METADATA_PROGRAM_ID
    );
    return metadataPda;
}

async function createAtomicMintWithFee(
    connection: Connection,
    payer: anchor.Wallet,
    metadata: TokenMetadata,
    totalSupply: number
) {
    // Generate a random keypair for the token mint
    const tokenMint = Keypair.generate();
    const mintPubkey = tokenMint.publicKey;
    const feeCollectorKeypair = Keypair.generate();
    const feeCollector = feeCollectorKeypair.publicKey;

    console.log("Initializing transaction...");
    console.log("Mint Address:", mintPubkey.toBase58());
    console.log("Fee Collector:", feeCollector.toBase58());

    // Calculate token amounts
    const decimals = 6;
    const totalTokenAmount = totalSupply * Math.pow(10, decimals);
    const feeAmount = Math.floor(totalTokenAmount * 0.1); // 10% fee
    const userAmount = totalTokenAmount - feeAmount;

    // Get associated token accounts
    const payerATA = await getAssociatedTokenAddress(
        mintPubkey,
        payer.publicKey
    );
    const feeCollectorATA = await getAssociatedTokenAddress(
        mintPubkey,
        feeCollector
    );

    // Create transaction
    const transaction = new Transaction();

    // Add SOL fee transfer instruction
    transaction.add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: feeCollector,
            lamports: SOL_FEE_AMOUNT,
        })
    );
    //
    // Add mint initialization instruction
    const mintRent = await connection.getMinimumBalanceForRentExemption(MintLayout.span);
    transaction.add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mintPubkey,
            space: MintLayout.span,
            lamports: mintRent,
            programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
            mintPubkey,
            decimals,
            payer.publicKey,
            payer.publicKey,
        )
    );

    // Create ATAs if they don't exist
    const payerATAInfo = await connection.getAccountInfo(payerATA);
    if (!payerATAInfo) {
        transaction.add(
            createAssociatedTokenAccountInstruction(
                payer.publicKey,
                payerATA,
                payer.publicKey,
                mintPubkey
            )
        );
    }

    const feeCollectorATAInfo = await connection.getAccountInfo(feeCollectorATA);
    if (!feeCollectorATAInfo) {
        transaction.add(
            createAssociatedTokenAccountInstruction(
                payer.publicKey,
                feeCollectorATA,
                feeCollector,
                mintPubkey
            )
        );
    }

    // Add mint and transfer instructions
    transaction.add(
        createMintToInstruction(
            mintPubkey,
            payerATA,
            payer.publicKey,
            totalTokenAmount,
            []
        ),
        createTransferInstruction(
            payerATA,
            feeCollectorATA,
            payer.publicKey,
            feeAmount,
            []
        )
    );

    // Add metadata instructions
    const metadataPda = await findMetadataPda(mintPubkey);
    const umi = createUmi(anchor.getProvider().connection);
    console.log("Metadata PDA:", metadataPda.toBase58());
    // 完成
    const signer = createSignerFromKeypair(umi, fromWeb3JsKeypair(payer.payer));


    let CreateMetadataAccountV3Args = {
        //accounts
        mint: fromWeb3JsPublicKey(mintPubkey), // mint address of the token
        mintAuthority: signer,
        payer: signer,
        updateAuthority: signer.publicKey,
        data: {
            name: metadata.name,
            symbol: metadata.symbol,
            uri: metadata.uri,
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
        },
        isMutable: false,
        collectionDetails: null,
    };

    createMetadataAccountV3(umi, CreateMetadataAccountV3Args).getInstructions().forEach((instruction) => {
        transaction.add(toWeb3JsInstruction(instruction));
    });

    // Estimate transaction fees
    const estimatedFee = await estimateTransactionFee(connection, transaction, payer.publicKey);
    const totalCost = estimatedFee + SOL_FEE_AMOUNT + mintRent;

    console.log("Estimated costs (in SOL):");
    console.log(`Gas fee: ${estimatedFee / LAMPORTS_PER_SOL}`);
    console.log(`Protocol fee: ${SOL_FEE_AMOUNT / LAMPORTS_PER_SOL}`);
    console.log(`Mint rent: ${mintRent / LAMPORTS_PER_SOL}`);
    console.log(`Total cost: ${totalCost / LAMPORTS_PER_SOL}`);

    // Check if user has enough SOL
    const balance = await connection.getBalance(payer.publicKey);
    if (balance < totalCost) {
        throw new Error(`Insufficient balance. Need ${totalCost / LAMPORTS_PER_SOL} SOL but got ${balance / LAMPORTS_PER_SOL} SOL`);
    }

    // Add recent blockhash
    transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
    transaction.feePayer = payer.publicKey;

    console.log("Sending transaction...");
    try {
        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [payer.payer, tokenMint]
        );

        console.log("Transaction successful!");
        console.log("Signature:", signature);
        console.log("Token Distribution:");
        console.log(`Total Supply: ${totalTokenAmount / Math.pow(10, decimals)} tokens`);
        console.log(`Fee Amount (10%): ${feeAmount / Math.pow(10, decimals)} tokens`);
        console.log(`User Amount: ${userAmount / Math.pow(10, decimals)} tokens`);

        return {
            signature,
            mintAddress: mintPubkey.toBase58(),
            mintSecretKey: base58.encode(tokenMint.secretKey),
            totalCostInSol: totalCost / LAMPORTS_PER_SOL
        };
    } catch (error) {
        console.error("Transaction failed:", error);
        throw error;
    }
}

// Example usage
const metadata = {
    name: "Your Token Name",
    symbol: "SYMBOL",
    uri: "your-token-metadata-uri",
};

const TOTAL_SUPPLY = 1000000; // 1 million tokens

async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const result = await createAtomicMintWithFee(
        provider.connection,
        provider.wallet as anchor.Wallet,
        metadata,
        TOTAL_SUPPLY
    );

    console.log("Token Mint Information:");
    console.log("Mint Address:", result.mintAddress);
    console.log("Mint Secret Key:", result.mintSecretKey);
    console.log("Total Cost Paid:", result.totalCostInSol, "SOL");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
