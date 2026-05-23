import {
Connection, Keypair, SystemProgram, Transaction, clusterApiUrl, PublicKey
} from "@solana/web3.js";

import {
TOKEN_PROGRAM_ID, MINT_SIZE,
createInitializeMintInstruction,
getMinimumBalanceForRentExemptMint,
createAssociatedTokenAccountInstruction,
getAssociatedTokenAddress,
createMintToInstruction,
AuthorityType,
createSetAuthorityInstruction
} from "@solana/spl-token";

import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";

const conn = new Connection(clusterApiUrl("mainnet-beta"));

const META = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

export async function createToken({wallet,name,symbol,decimals,supply,metadataUri}){
  const mint=Keypair.generate();
  const lamports=await getMinimumBalanceForRentExemptMint(conn);
  const ata=await getAssociatedTokenAddress(mint.publicKey,wallet.publicKey);

  const tx=new Transaction();

  tx.add(SystemProgram.createAccount({
    fromPubkey:wallet.publicKey,
    newAccountPubkey:mint.publicKey,
    space:MINT_SIZE,
    lamports,
    programId:TOKEN_PROGRAM_ID
  }));

  tx.add(createInitializeMintInstruction(mint.publicKey,decimals,wallet.publicKey,wallet.publicKey));

  tx.add(createAssociatedTokenAccountInstruction(wallet.publicKey,ata,wallet.publicKey,mint.publicKey));

  tx.add(createMintToInstruction(mint.publicKey,ata,wallet.publicKey,supply*Math.pow(10,decimals)));

  const [pda]=PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"),META.toBuffer(),mint.publicKey.toBuffer()],
    META
  );

  tx.add(createCreateMetadataAccountV3Instruction({
    metadata:pda,mint:mint.publicKey,mintAuthority:wallet.publicKey,payer:wallet.publicKey,updateAuthority:wallet.publicKey
  },{
    createMetadataAccountArgsV3:{
      data:{name,symbol,uri:metadataUri,sellerFeeBasisPoints:0,creators:null,collection:null,uses:null},
      isMutable:true,
      collectionDetails:null
    }
  }));

  const sig=await wallet.sendTransaction(tx,conn,{signers:[mint]});
  await conn.confirmTransaction(sig,"confirmed");

  return {signature:sig,tokenAddress:mint.publicKey.toBase58()};
}
