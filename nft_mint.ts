import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile,createSignerFromKeypair,signerIdentity ,generateSigner, percentAmount, UmiError} from "@metaplex-foundation/umi"
import { irysUploader} from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises";
import { fstat, readFileSync } from "fs";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import base58 from "bs58"

// const umi = createUmi('https://api.devnet.solana.com');
const RPC_ENDPOINT = "https://api.devnet.solana.com";
const umi = createUmi(RPC_ENDPOINT);
const wallet = JSON.parse(readFileSync("/home/allen08/.config/solana/id.json",'utf-8'));

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi,keypair);


umi.use(irysUploader({address: "https://devnet.irys.xyz/"}));
umi.use(signerIdentity(signer));
umi.use(mplTokenMetadata())

const mint = generateSigner(umi);

//e UPLOADING THE IMAGE
(async () => {
    
    try {
        const image = await readFile("./goku.png")
        const file = createGenericFile(image,"goku.png", {
            contentType: "image/png"
        });

        console.log("Uploading to Irys...");
        const myUri = await umi.uploader.upload([file]);
        console.log("Your Image URI: ",myUri);
    } catch(error){
        console.log("Error: ",error);
    }
})().catch(console.error);


//e CREATING THE METADATA
(async () => {
    try {
        const image = "https://gateway.irys.xyz/56Mzs7VsT3C3854UY4zkgtUM1sSrPcQXWSUzGrVTc22F"
        const metadata = {
            name: "KAKAROTTTT!",
            symbol: "KKRT",
            description: "Exclusive Goku NFT's for DBZ Fans",
            image: image,
            attributes: [
                {trait_type: 'Power', value: '100'},
                {trait_type: 'Ranking',value: 'High'}
            ],
            properties: {
                files: [
                    {
                        type: "image/png",
                        uri: image
                    },
                ]
            },
            creators: []
        };
        console.log("Uploading to Umi...");
        const myUri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", myUri);
    } catch (error){
        console.log("Error: ",error);
    }
})().catch(console.error)



//e Creating the nft's
(async () => {
    let tx = createNft(umi , {mint,name: "KAKAROTTT!",
        symbol: "GOKU",
        uri: "https://gateway.irys.xyz/6gUtRdterK7nQBbwiuRxcRk38xfBM1CoW2uLvptBc2No",
        sellerFeeBasisPoints: percentAmount(4),
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.encode(result.signature);
    console.log(`Succesfully Minted! Check out your TX here:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
    console.log("Mint address: ",mint.publicKey);
})().catch(console.error);