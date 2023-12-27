import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table'

const shows = [
  { name: 'Squid Game', platform: 'Netflix' },
  { name: 'Ted Lasso', platform: 'Apple TV+' },
  { name: 'The Morning Show', platform: 'Apple TV+' },
  { name: 'The Witcher', platform: 'Netflix' },
  { name: 'Loki', platform: 'Disney+' },
  { name: 'The Mandalorian', platform: 'Disney+' },
  { name: 'WandaVision', platform: 'Disney+' },
  { name: 'The Boys', platform: 'Amazon Prime' },
  { name: 'Invincible', platform: 'Amazon Prime' },
  { name: 'Money Heist', platform: 'Netflix' },
  { name: 'Stranger Things', platform: 'Netflix' },
  { name: 'The Crown', platform: 'Netflix' },
  { name: 'Succession', platform: 'HBO Max' },
  { name: 'The Handmaid\'s Tale', platform: 'Hulu' },
  { name: 'The Queen\'s Gambit', platform: 'Netflix' },
];

export default function Home() {
  return (
    <>
    <h1 className="text-3xl text-center my-4">Watching</h1>
    <hr/>
    <Table >
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>App</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {shows.map((show) => (
          <TableRow key={show.name}>
            <TableCell className="font-medium">{show.name}</TableCell>
            <TableCell>{show.platform}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </>
  )
}
