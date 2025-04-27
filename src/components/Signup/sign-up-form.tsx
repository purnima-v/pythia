// 'use client'

// import { cn } from '@/lib/utils'
// import { createClient } from '@/lib/supabase/client'
// import { Button } from '@/components/ui/button'
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card'
// import { Input } from '@/components/ui/input'
// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'
// import { useState } from 'react'

// export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
//   const [email, setEmail] = useState('')
//   const [password, setPassword] = useState('')
//   const [repeatPassword, setRepeatPassword] = useState('')
//   const [type, setType] = useState<'candidate' | 'recruiter'>('candidate')
//   const [error, setError] = useState<string | null>(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const handleSignUp = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const supabase = createClient()
//     setIsLoading(true)
//     setError(null)

//     if (password !== repeatPassword) {
//       setError('Passwords do not match')
//       setIsLoading(false)
//       return
//     }

//     try {
//       const { error } = await supabase.auth.signUp({
//         email,
//         password,
//         options: {
//           emailRedirectTo: `${window.location.origin}/protected`,
//         },
//       })

//       if (error) throw error

//       const res = await fetch('/api/onboarding', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ type }),
//       })

//       if (!res.ok) {
//         const { message } = await res.json()
//         throw new Error(message || 'Failed to initialize onboarding')
//       }

//       router.push('/auth/sign-up-success')
//     } catch (error: any) {
//       setError(error?.message || 'Something went wrong')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <div className={cn('flex flex-col gap-6', className)} {...props}>
//       <Card>
//         <CardHeader>
//           <CardTitle className="text-2xl">Sign up</CardTitle>
//           <CardDescription>Create a new account</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSignUp} className="flex flex-col gap-6">
//             <div className="grid gap-2">
//               <Label htmlFor="email">Email</Label>
//               <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="password">Password</Label>
//               <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="repeat-password">Repeat Password</Label>
//               <Input id="repeat-password" type="password" value={repeatPassword} onChange={e => setRepeatPassword(e.target.value)} required />
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="account-type">Account Type</Label>
//               <Select
//                 value={type}
//                 onValueChange={(value) => setType(value as 'candidate' | 'recruiter')}
//               >
//                 <SelectTrigger id="account-type" className="w-full">
//                   <SelectValue placeholder="Select account type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="candidate">Candidate</SelectItem>
//                   <SelectItem value="recruiter" disabled>
//                     <span className="flex items-center gap-2">
//                       Recruiter <span className="text-xs bg-muted px-2 py-0.5 rounded-full">Coming soon</span>
//                     </span>
//                   </SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {error && <p className="text-sm text-red-500">{error}</p>}
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? 'Creating account...' : 'Sign up'}
//             </Button>

//             <div className="text-center text-sm mt-4">
//               Already have an account?{' '}
//               <Link href="/auth/login" className="underline">
//                 Login
//               </Link>
//             </div>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }