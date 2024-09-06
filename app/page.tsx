import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

import { fetchShows } from '@/app/lib/data';

export default async function Home() {
  const watchingShows = await fetchShows('Watching');

  return (
    <div className="mt-5">

      <h2 className="text-2xl font-bold mb-2">Watching</h2>
      <Carousel className="w-full mx-auto" opts={{
        align: "start"
      }}>
        <CarouselContent className="-ml-2">
          {watchingShows.map((show, index) => (
            <CarouselItem key={index} className="pl-2 basis-1/2">
              <Card className='min-h-[16rem] py-1 px-2'>
                <CardHeader className="py-1 px-0">
                  <CardTitle className="text-lg leading-tight">{show.name}</CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-0">
                  <p className="text-sm">{show.status}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
      </Carousel>


      <h2 className="text-2xl font-bold mb-2 mt-5">Maybe Something:</h2>

    </div>
  )
}
