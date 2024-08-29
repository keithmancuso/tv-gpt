import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'
import { fetchShows } from '@/app/lib/data';
import { Heading } from '@/components/heading'
import NewBtn from '@/components/new'
import Remove from '@/components/remove'
import Link from 'next/link';

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const status = searchParams.status as string || 'Watching';
  const shows = await fetchShows(status);

  const statuses = ['Watching', 'Next', 'Loved'];

  return (
    <>
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">
        <Heading>{status}</Heading>
        <NewBtn/>
      </div>

    

      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>App</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {shows.map((show) => (
            <TableRow key={show.id}>
              <TableCell className="font-medium">{show.name}</TableCell>
              <TableCell>{show.app}</TableCell>
              <TableCell>
                <Remove id={show.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
