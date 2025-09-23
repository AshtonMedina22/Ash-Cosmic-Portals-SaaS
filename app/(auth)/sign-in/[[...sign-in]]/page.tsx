import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-white/70">Sign in to your PDFtoolAI account</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-white',
              card: 'bg-gray-900/50 border border-purple-400/20',
              headerTitle: 'text-white',
              headerSubtitle: 'text-white/70',
              socialButtonsBlockButton: 'bg-gray-800 hover:bg-gray-700 border-gray-600 text-white',
              formFieldInput: 'bg-gray-800 border-gray-600 text-white',
              footerActionLink: 'text-purple-400 hover:text-purple-300',
            }
          }}
        />
      </div>
    </div>
  );
}
