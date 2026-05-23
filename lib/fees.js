import { Connection, clusterApiUrl, LAMPORTS_PER_SOL } from "@solana/web3.js";
const conn=new Connection(clusterApiUrl("mainnet-beta"));
export async function estimateFees(){
  const lamports=5000;
  return {lamports,sol:lamports/LAMPORTS_PER_SOL,usdEstimate:(lamports/LAMPORTS_PER_SOL*170).toFixed(4)};
}
