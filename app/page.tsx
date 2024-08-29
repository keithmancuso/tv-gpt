import { Heading } from '@/components/heading'
import { Button } from '@/components/button'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Heading className="mb-4">Welcome to Watch Tonight</Heading>
      <p className="text-xl mb-8 text-center">
        Your personal TV show tracker. Never lose track of what you're watching again!
      </p>
      <Button as={Link} href="/list?status=Watching">
        View My Watching List
      </Button>
    </div>
  )
}
