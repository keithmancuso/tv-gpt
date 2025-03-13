import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { fetchShows } from '@/app/lib/data';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
export default async function Home() {
  const response = await fetch(`https://localhost:3000/api/recommendations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: 'Give me recommendations' }] }),
  });
  const recommendations = await response.json();

  return (
    <div className="mt-5">

      <h2 className="text-2xl font-bold mb-2">Recommendations</h2>

      <p className="text-sm text-muted-foreground mb-4">
        These shows have captured your attention and kept you coming back for more.
      </p>

      <Carousel className="w-full mx-auto" opts={{
        align: "start"
      }}>
        <CarouselContent className="-ml-2">
          {recommendations.map((show, index) => (
            <CarouselItem key={index} className="pl-2 basis-1/2">
              <Link href={`/show/${show.id}`} className="block">
                <Card className='min-h-[16rem] py-1 px-2 hover:shadow-md transition-shadow'>
                  <CardHeader className="py-1 px-0">
                    <CardTitle className="text-lg leading-tight">{show.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="py-1 px-0">
                    <p className="text-sm">{show.status}</p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
      </Carousel>


      <h2 className="text-2xl font-bold mb-2 mt-5">Something Else</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Refine your recommendations by exploring new genres or adjusting your preferences.
      </p>


      <div className="flex flex-wrap gap-2">
        <Button variant="outline">Shorter</Button>
        <Button variant="outline">Funnier</Button>
        <Button variant="outline">More Action</Button>
        <Button variant="outline">Less Drama</Button>
      </div>

      <div className="mt-5">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g., 'A sci-fi show with complex characters'"
            className="flex-grow"
          />
          <Button>Ask AI</Button>
        </div>
      </div>


    </div>
  )
}
