'use client'
import {useImportWallet, useSignAuthorization} from '@privy-io/react-auth';
import { useState, useEffect } from 'react';

import { useLogin, usePrivy, useLogout } from '@privy-io/react-auth';
import { useLoginWithEmail } from "@privy-io/react-auth";


function LogoutButton() {
  const { logout } = useLogout({
    onSuccess: () => {
      console.log('User successfully logged out');
      // Redirect to landing page or perform other post-logout actions
    },
    // onError: (error) => {
    //   console.error('Logout failed', error);
    // }
  });

  return <button onClick={logout} className='cursor-pointer bg-red-500 rounded-md p-2'>Log out</button>;
}


export default function LoginWithEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { sendCode, loginWithCode } = useLoginWithEmail();

  type OtpFlowState =
  | {status: 'initial'}
  | {status: 'error'; error: Error | null}
  | {status: 'sending-code'}
  | {status: 'awaiting-code-input'}
  | {status: 'submitting-code'}
  | {status: 'done'};

  const [otpFlowState, setOtpFlowState] = useState<OtpFlowState>({status: 'initial'});

  useEffect(() => {
    if (otpFlowState.status === 'sending-code') {
      sendCode({ email })
        .then(() => {
          setOtpFlowState({status: 'awaiting-code-input'});
        })
        .catch((error) => {
          setOtpFlowState({status: 'error', error});
        });
    }
  })

  const handleLoginWithCode = async () => {
    try {
      await loginWithCode({ code });
      console.log('Login successful');
      setError(null);
    } catch (error: any) {
      setError("Login failed. Please check your code and try again.");
      // console.error(error);
    }
  };

  return (
    <div className='bg-yellow-800 backdrop-blur-sm flex flex-col items-center justify-center p-6 rounded-lg w-96 border border-gray-600 shadow-md space-y-4'>
      <div className="w-full">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input 
          id="email"
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.currentTarget.value)} 
          value={email} 
        />
        <button 
          onClick={() => sendCode({ email })}
          className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Send Code
        </button>
      </div>
      
      <div className="w-full">
        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">Verification Code</label>
        <input 
          id="code"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter verification code"
          onChange={(e) => setCode(e.currentTarget.value)} 
          value={code} 
        />
        <button 
          onClick={handleLoginWithCode}
          className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md"
        >
          Login
        </button>
      </div>
      
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
    </div>
  );
}


export function ImportWalletButton() {
  const {ready, authenticated} = usePrivy();
  const {importWallet} = useImportWallet();
  const [privateKey, setPrivateKey] = useState('hello');
  const [isReady, setIsReady] = useState(false);

  // Make sure Privy is ready before attempting to use its functions
  useEffect(() => {
    if (ready) {
      setIsReady(true);
    }
  }, [ready]);

  // useSignAuthorization()

  

  const handleImport = async () => {
    if (!isReady) {
      console.error('Privy is not ready yet');
      return;
    }
    
    try {
      console.log('Attempting to import wallet with private key:', privateKey);
      const wallet = await importWallet({privateKey: privateKey});
      console.log('Wallet imported successfully:', wallet);
    } catch (error) {
      console.error('Failed to import wallet:', error);
    }
  };

  // Check that your user is authenticated
  const isAuthenticated = ready && authenticated;

  return (
    <div className='flex flex-col items-center justify-center'>
      <LoginWithEmail/>

      <LogoutButton/>

      {/* <input
        type="text"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
        placeholder="Enter your private key"
      />
      <button 
        onClick={handleImport}
        className='cursor-pointer' 
        disabled={!isReady}
      >
        Import my wallet
      </button> */}
    </div>
  );
}