'use client';

import { useState, useEffect } from 'react';
import { Heading } from '@/components/heading';
import Link from 'next/link';
import { Button } from '@/components/button';
import { Select } from '@/components/select';
import { Textarea } from '@/components/textarea';
import { Input } from '@/components/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label, Field, FieldGroup } from '@/components/fieldset';

export default function ShowDetail({ params }: { params: { id: string } }) {
    const [show, setShow] = useState<any>(null);
    const [name, setName] = useState<string>('');
    const [status, setStatus] = useState<string>('Next');
    const [app, setApp] = useState<string>('Netflix');
    const [review, setReview] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const isNewShow = params.id === 'new';

    useEffect(() => {
        async function fetchShow() {
            if (isNewShow) {
                const statusParam = searchParams?.get('status');
                if (statusParam) {
                    setStatus(statusParam);
                }
            } else {
                const response = await fetch(`/api/shows/${params.id}`);
                if (response.ok) {
                    const data = await response.json();
                    setShow(data);
                    setName(data.name);
                    setStatus(data.status);
                    setApp(data.app);
                    setReview(data.review || null);
                } else {
                    console.error('Failed to fetch show');
                }
            }
            setIsLoaded(true);
        }
        fetchShow();
    }, [params.id, isNewShow, searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isNewShow ? '/api/shows/create' : '/api/shows/update';
        const method = isNewShow ? 'POST' : 'PUT';
        const body = JSON.stringify({
            id: isNewShow ? undefined : show.id,
            name,
            app,
            status,
            review: status === 'Watched' ? review : null
        });

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body,
        });

        if (response.ok) {
            router.push(`/?status=${status}`);
        } else {
            console.error('Failed to save show');
        }
    };

    const handleDelete = async () => {
        if (isNewShow) return;
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

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Heading>{isNewShow ? 'Add New Show' : `Edit: ${name}`}</Heading>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <FieldGroup>
                    <Field>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="app">App</Label>
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
                    </Field>
                    <Field>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Watching">Watching</option>
                            <option value="Next">Next</option>
                            <option value="Watched">Watched</option>
                        </Select>
                    </Field>
                    {status === 'Watched' && (
                        <Field>
                            <Label htmlFor="review">Review (Optional)</Label>
                            <Textarea
                                id="review"
                                value={review || ''}
                                onChange={(e) => setReview(e.target.value)}
                                rows={4}
                            />
                        </Field>

                    )}</FieldGroup>
                <div className="flex space-x-4">
                    <Button type="submit">
                        {isNewShow ? 'Add Show' : 'Update Show'}
                    </Button>
                    {!isNewShow && (
                        <Button
                            type="button"
                            onClick={handleDelete}
                            outline
                        >
                            Delete Show
                        </Button>
                    )}
                </div>
            </form>
            {isLoaded && (
                <Link href={`/list/?status=${status}`} className="mt-6 inline-block text-blue-600 hover:underline">
                    Back to list
                </Link>
            )}
        </div>
    );
}