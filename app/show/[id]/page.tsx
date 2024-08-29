'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/heading';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { useRouter } from 'next/navigation';

export default function ShowDetail({ params }: { params: { id: string } }) {
  const [show, setShow] = useState<any>(null);
  const [status, setStatus] = useState<string>('');
  const [app, setApp] = useState<string>('');
  const [review, setReview] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchShow() {
      const response = await fetch(`/api/shows/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setShow(data);
        setStatus(data.status);
        setApp(data.app);
        setReview(data.review || null);
      } else {
        console.error('Failed to fetch show');
      }
    }
    fetchShow();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/shows/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: show.id, 
        app, 
        status, 
        review: status === 'Watched' ? review : null 
      }),
    });
    if (response.ok) {
      router.push(`/list?status=${status}`);
    } else {
      console.error('Failed to update show');
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this show?')) {
      const response = await fetch('/api/shows/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: show.id }),
      });
      if (response.ok) {
        router.push('/');
      } else {
        console.error('Failed to delete show');
      }
    }
  };

  if (!show) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Heading>{show.name}</Heading>
      <form onSubmit={handleUpdate} className="mt-4 space-y-4">
        <div>
          <label htmlFor="app" className="block text-sm font-medium text-gray-700">App</label>
          <Select
            id="app"
            value={app}
            onChange={(e) => setApp(e.target.value)}
          >
            <option value="Netflix">Netflix</option>
            <option value="Disney+">Disney+</option>
            <option value="Amazon Prime">Amazon Prime</option>
            <option value="Max">Max</option>
            <option value="Apple TV+">Apple TV+</option>
            <option value="Peacock">Peacock</option>
            <option value="Paramount+">Paramount+</option>
          </Select>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <Select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Watching">Watching</option>
            <option value="Next">Next</option>
            <option value="Watched">Watched</option>
          </Select>
        </div>
        {status === 'Watched' && (
          <div>
            <label htmlFor="review" className="block text-sm font-medium text-gray-700">Review (Optional)</label>
            <Textarea
              id="review"
              value={review || ''}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
            />
          </div>
        )}
        <div className="flex space-x-4">
          <Button type="submit">
            Update Show
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            outline
          >
            Delete Show
          </Button>
        </div>
      </form>
      <Link href={`/list?status=${status}`} className="mt-6 inline-block text-blue-600 hover:underline">
        Back to list
      </Link>
    </div>
  );
}