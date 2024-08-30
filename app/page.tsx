import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'
export default function Home() {
  return (
    <div className="flex bg-slate-100 flex-col items-center justify-center my-4 h-screen">
      <Card className="p-4 w-1/2 mx-auto my-16">
        <div className="flex flex-col items-center justify-center my-4">
          <h1 className="mb-4 text-xl font-bold">Welcome to Watch Tonight</h1>
          <p className="text-xl mb-8 text-center">
            Your personal television assistant.
          </p>
          <Button asChild>
            <Link href="/list?status=Watching">
              View My Watching List
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
