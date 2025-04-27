import { SignUpForm } from '@/components/Signup/sign-up-form'

export default function Page() {
  return (
    <div className="min-h-screen w-full bg-black bg-dot-grid relative">
      {/* Sign-up form container */}
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 relative z-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}