'use client'

// import { useImportWallet, useSignAuthorization } from '@privy-io/react-auth';
// import { useState, useEffect } from 'react';

import { useLogin, usePrivy, useLogout } from '@privy-io/react-auth';
import { useSignupWithPasskey } from "@privy-io/react-auth";
import { useState, useEffect } from'react';

import { Button } from '@/lib/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/lib/ui/card'
import { Input } from '@/lib/ui/input'
import { Label } from '@/lib/ui/label'
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function SignupWithPasskey() {
  const { signupWithPasskey } = useSignupWithPasskey();

  return (
    <div>
      <button onClick={signupWithPasskey}>Sign up with passkey</button>
    </div>
  );
}



export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  
  const [code, setCode] = useState("");
  

  const {ready, authenticated} = usePrivy();
  const { signupWithPasskey } = useSignupWithPasskey();


  
  type OtpFlowState =
  | {status: 'initial'}
  | {status: 'error'; error: Error | null}
  | {status: 'sending-code'}
  | {status: 'awaiting-code-input'}
  | {status: 'submitting-code'}
  | {status: 'done'};

  const [otpFlowState, setOtpFlowState] = useState<OtpFlowState>({status: 'initial'});

  // useEffect(() => {
  //   if (otpFlowState.status === 'sending-code') {
  //     sendCode({ email })
  //       .then(() => {
  //         setOtpFlowState({status: 'awaiting-code-input'});
  //       })
  //       .catch((error) => {
  //         setOtpFlowState({status: 'error', error});
  //       });
  //   }
  // }, [otpFlowState.status, email, sendCode]);

  useEffect(() => {
    if (authenticated) {
      console.log('User is authenticated');
      router.push('/home')
    }
  }, [ready])


//   const handleSendCode = async (email: string) => {
//     setIsLoading(true);
//     setError(null);
//     setOtpFlowState({status: 'sending-code'});
    
//     sendCode({email})

//     setOtpFlowState({status: 'awaiting-code-input'});
//     setIsLoading(false);
//   };

//   const handleLoginWithCode = async () => {
//     try {
//       setIsLoading(true);
//       await loginWithCode({ code });
//       console.log('Login successful');
//       setError(null);
//       setIsLoading(false);

//       router.push('/home')
//     } catch (error: any) {
//       setError("Login failed. Please check your code and try again.");
//       setIsLoading(false);
//     }
//   };

  return (
    <div className={'flex flex-col gap-6'} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>We're using privy to log in. Please enter the email of your privy account to receive a login code!</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col gap-6">
            {/* <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                // className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Button 
                onClick={() => handleSendCode(email)}
                className="mt-2 hover:cursor-pointer"
                disabled={isLoading || !email}
              >
                {isLoading && otpFlowState.status === 'sending-code' ? 'Sending...' : 'Send Code'}
              </Button>
            </div> */}
            
            {/* {otpFlowState.status === 'awaiting-code-input' && ( */}
              <div className="grid gap-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter verification code"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button 
                  onClick={signupWithPasskey}
                  className="mt-2"
                  disabled={isLoading || !code}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </div>
            {/* )} */}
            
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
// =========




// function ImportWalletButton() {
//   const {ready, authenticated} = usePrivy();
//   const {importWallet} = useImportWallet();
//   const [privateKey, setPrivateKey] = useState('hello');
//   const [isReady, setIsReady] = useState(false);

//   // Make sure Privy is ready before attempting to use its functions
//   useEffect(() => {
//     if (ready) {
//       setIsReady(true);
//     }
//   }, [ready]);

//   // useSignAuthorization()

  

//   const handleImport = async () => {
//     if (!isReady) {
//       console.error('Privy is not ready yet');
//       return;
//     }
    
//     try {
//       console.log('Attempting to import wallet with private key:', privateKey);
//       const wallet = await importWallet({privateKey: privateKey});
//       console.log('Wallet imported successfully:', wallet);
//     } catch (error) {
//       console.error('Failed to import wallet:', error);
//     }
//   };

//   // Check that your user is authenticated
//   const isAuthenticated = ready && authenticated;

//   return (
//     <div className='flex flex-col items-center justify-center'>

//       {/* <input
//         type="text"
//         value={privateKey}
//         onChange={(e) => setPrivateKey(e.target.value)}
//         placeholder="Enter your private key"
//       />
//       <button 
//         onClick={handleImport}
//         className='cursor-pointer' 
//         disabled={!isReady}
//       >
//         Import my wallet
//       </button> */}
//     </div>
//   );
// }}