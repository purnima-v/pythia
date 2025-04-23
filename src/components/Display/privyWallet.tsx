import {usePrivy, useImportWallet} from '@privy-io/react-auth';
import { useState } from 'react';

function ImportWalletButton() {
  const {ready, authenticated} = usePrivy();
  const {importWallet} = useImportWallet();
  const [privateKey, setPrivateKey] = useState('');

  const handleImport = async () => {
    try {
      const wallet = await importWallet({privateKey: privateKey});
      console.log('Wallet imported successfully:', wallet);
    } catch (error) {
      console.error('Failed to import wallet:', error);
    }
  };

  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;

  return (
    <div>
      <input
        type="text"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Enter your private key"
      />
      <button onClick={handleImport} disabled={!isAuthenticated}>
        Import my wallet
      </button>
    </div>
  );
}