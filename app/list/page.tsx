import Link from 'next/link';
import { fetchShows } from '@/app/lib/data';
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const status = searchParams.status as string || 'Watching';
  const shows = await fetchShows(status);
  const statuses = ['Watching', 'Next', 'Watched'];

  return (
    <>
      <div className="relative border-b border-slate-200 dark:border-slate-800 py-4">
        <div className="flex justify-center w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center cursor-pointer">
                <h1 className="text-lg font-bold">{status}</h1>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {statuses.map((s) => (
                <DropdownMenuItem key={s} asChild>
                  <Link href={`/list?status=${s}`}>{s}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {shows.map((show) => (
          <Link href={`/show/${show.id}`} key={show.id} className="block hover:shadow-md transition-shadow">
            <Card className="shadow">
              <CardHeader>
                <CardTitle>{show.name}</CardTitle>
                <CardDescription>{show.app}</CardDescription>
              </CardHeader>

            </Card>
          </Link>
        ))}
      </div>

      <div className="fixed bottom-6 right-6">
        <Button asChild className="rounded-full w-14 h-14 p-0">
          <Link href={`/show/new?status=${status}`} aria-label="Add New Show">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
            </svg>
          </Link>
        </Button>
      </div>
    </>
  )
}
