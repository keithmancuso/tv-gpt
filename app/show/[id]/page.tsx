import { fetchShowById } from '@/app/lib/data';
import { updateShow } from '@/app/lib/actions';
import { Heading } from '@/components/heading';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Select } from '@/components/select';
import { Input } from '@/components/input';
import { deleteShow } from '@/app/lib/actions';

export default async function ShowDetail({ params }: { params: { id: string } }) {
  const show = await fetchShowById(params.id);

  if (!show) {
    return <div>Show not found</div>;
  }

  return (
    <div>
      <Heading>{show.name}</Heading>
      <form action={updateShow} className="mt-4 space-y-4">
        <input type="hidden" name="id" value={show.id} />
        <div>
          <label htmlFor="app" className="block text-sm font-medium text-gray-700">App</label>
          <Select
            id="app"
            name="app"
            defaultValue={show.app}
          >
            <option value="Netflix">Netflix</option>
            <option value="Disney+">Disney+</option>
            <option value="Amazon Prime">Amazon Prime</option>
            <option value="Max"> Max</option>
            <option value="Apple TV+">Apple TV+</option>
            <option value="Peacock">Peacock</option>
            <option value="Paramount+">Paramount+</option>
          </Select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <Select
            id="status"
            name="status"
            defaultValue={show.status}
          >
            <option value="Watching">Watching</option>
            <option value="Next">Next</option>
            <option value="Loved">Loved</option>
          </Select>
        </div>
        <div className="flex space-x-4">
          <Button type="submit">
            Update Show
          </Button>
          <Button
            type="submit"
            outline
            formAction={deleteShow}
          >
            Delete Show
          </Button>
        </div>
      </form>
      <Link href={`/?status=${show.status}`} className="mt-6 inline-block text-blue-600 hover:underline">
        Back to list
      </Link>
    </div>
  );
}