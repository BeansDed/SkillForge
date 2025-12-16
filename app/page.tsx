import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-5xl font-bold text-white">
          Skill<span className="text-primary">Forge</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-md">
          Level up your skills with gamified learning
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-in"
            className="px-8 py-3 bg-surface text-white rounded-xl border-b-4 border-gray-700 
                       hover:brightness-110 transition-all active:translate-y-1 active:border-b-0"
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="px-8 py-3 bg-primary text-white rounded-xl border-b-4 border-primary-dark 
                       hover:brightness-110 transition-all active:translate-y-1 active:border-b-0"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
