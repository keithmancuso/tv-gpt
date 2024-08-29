import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'

import { sql } from "@vercel/postgres";
import { fetchWatching } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';

import { XMarkIcon } from '@heroicons/react/24/solid'

import { Heading } from '@/components/heading'

import { Button } from '@/components/button'
import NewBtn from '@/components/new'

import Remove from '@/components/remove'


export default async function Home() {

  const shows = await fetchWatching();


  return (
    <>
          
      <div className="flex w-full flex-wrap items-end justify-between gap-4 border-b border-zinc-950/10 pb-6 dark:border-white/10">

        <Heading >Watching</Heading>
        <NewBtn/>

      </div>

    <hr/>
    <Table >
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
