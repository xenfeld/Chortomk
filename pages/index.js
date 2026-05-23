import { Toaster } from 'react-hot-toast';
import WalletButton from '../components/WalletButton';
import TokenForm from '../components/TokenForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Toaster />
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Solana Meme Token Generator</h1>
          <WalletButton />
        </div>
        <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl">
          <TokenForm />
        </div>
      </div>
    </div>
  );
}
