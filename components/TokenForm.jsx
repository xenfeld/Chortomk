import { useState } from 'react';
import toast from 'react-hot-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { uploadImage, uploadMetadata } from '../lib/ipfs';
import { createToken } from '../lib/solana';
import { generateMemeToken } from '../lib/ai';
import { estimateFees } from '../lib/fees';

export default function TokenForm() {
  const wallet = useWallet();
  const [loading, setLoading] = useState(false);
  const [fees, setFees] = useState(null);

  const [form, setForm] = useState({
    name: '',
    symbol: '',
    description: '',
    supply: 1000000,
    decimals: 9,
    twitter: '',
    telegram: '',
    website: ''
  });

  const [image, setImage] = useState(null);

  function randomizeToken() {
    const g = generateMemeToken();
    setForm({ ...form, name: g.name, symbol: g.symbol, description: g.slogan });
  }

  async function loadFees() {
    const res = await estimateFees();
    setFees(res);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!wallet.connected) return toast.error("Connect wallet");

    try {
      setLoading(true);

      const imageUrl = await uploadImage(image);

      const metadata = {
        name: form.name,
        symbol: form.symbol,
        description: form.description,
        image: imageUrl
      };

      const metadataUri = await uploadMetadata(metadata);

      const tx = await createToken({
        wallet,
        name: form.name,
        symbol: form.symbol,
        decimals: Number(form.decimals),
        supply: Number(form.supply),
        metadataUri
      });

      toast.success("Token created: " + tx.tokenAddress);
    } catch (e) {
      console.error(e);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button type="button" onClick={randomizeToken} className="w-full bg-purple-500 p-3 rounded">
        AI Meme Name
      </button>

      <button type="button" onClick={loadFees} className="w-full bg-blue-500 p-3 rounded">
        Estimate Fees
      </button>

      {fees && (
        <div className="text-sm">
          SOL: {fees.sol} | USD: {fees.usdEstimate}
        </div>
      )}

      <input className="w-full p-3 bg-zinc-900" placeholder="Name"
        onChange={e => setForm({...form, name: e.target.value})} />

      <input className="w-full p-3 bg-zinc-900" placeholder="Symbol"
        onChange={e => setForm({...form, symbol: e.target.value})} />

      <textarea className="w-full p-3 bg-zinc-900" placeholder="Description"
        onChange={e => setForm({...form, description: e.target.value})} />

      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <button className="w-full bg-green-500 p-3 rounded">
        {loading ? "Creating..." : "Create Token"}
      </button>
    </form>
  );
}
