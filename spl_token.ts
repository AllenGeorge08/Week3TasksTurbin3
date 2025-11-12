import {generateSigner,percentAmount,publicKey,PublicKey} from '@metaplex-foundation/umi'
import {createV1,TokenStandard} from '@metaplex-foundation/mpl-token-metadata'
import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";

const SPL_TOKEN_2022_PROGRAM_ID: PublicKey = publicKey(
    'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
)

const umi = createUmi('https://api.devnet.solana.com');
const mint = generateSigner(umi);

(async() => {
    const txSignature = await createV1(umi, {
        mint,
        name: 'MY TOKEN',
        uri: "",
        sellerFeeBasisPoints: percentAmount(5),
        splTokenProgram: SPL_TOKEN_2022_PROGRAM_ID,
        tokenStandard: TokenStandard.Fungible
    }).sendAndConfirm(umi)
})().catch(console.error)