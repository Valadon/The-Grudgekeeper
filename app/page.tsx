import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">The Grudgekeeper</h1>
        <Link 
          href="/game"
          className="text-xl hover:text-white"
        >
          [ENTER THE SHIP]
        </Link>
      </div>
    </div>
  )
}