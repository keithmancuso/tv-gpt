import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'

import { sql } from "@vercel/postgres";
import { fetchWatching } from '@/app/lib/data';

import { XMarkIcon } from '@heroicons/react/24/solid'





export default async function Home() {

  const shows = await fetchWatching();


  return (
    <>
    <h1 className="text-3xl text-center my-4">Watching</h1>
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
          <TableRow key={show.name}>
            <TableCell className="font-medium">{show.name}</TableCell>
            <TableCell>{show.app}</TableCell>
            <TableCell><XMarkIcon/></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  )
}
