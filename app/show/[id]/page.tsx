'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

export default function ShowDetail({ params }: { params: { id: string } }) {
    const [show, setShow] = useState({
        name: '',
        status: 'Next',
        app: 'Netflix',
        review: '',
    });
    const router = useRouter();
    const searchParams = useSearchParams();
    const isNewShow = params.id === 'new';

    useEffect(() => {
        if (!isNewShow) {
            fetch(`/api/shows/${params.id}`)
                .then(res => res.json())
                .then(data => setShow(data))
                .catch(err => console.error('Failed to fetch show:', err));
        } else {
            setShow(prev => ({ ...prev, status: searchParams?.get('status') || 'Next' }));
        }
    }, [params.id, isNewShow, searchParams]);

    const handleChange = (field: string, value: string) => {
        setShow(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isNewShow ? '/api/shows/create' : '/api/shows/update';
        const method = isNewShow ? 'POST' : 'PUT';
        const body = JSON.stringify({
            id: isNewShow ? undefined : params.id,
            ...show,
            review: show.status === 'Watched' ? show.review : null
        });

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body,
            });
            if (response.ok) {
                router.push(`/list?status=${show.status}`);
            } else {
                throw new Error('Failed to save show');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async () => {
        if (isNewShow || !confirm('Are you sure you want to delete this show?')) return;

        try {
            const response = await fetch('/api/shows/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: params.id }),
            });
            if (response.ok) {
                router.push('/list?status=Watching');
            } else {
                throw new Error('Failed to delete show');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>{isNewShow ? 'Add New Show' : show.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={show.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="app">App</Label>
                        <Select value={show.app} onValueChange={(value) => handleChange('app', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an app" />
                            </SelectTrigger>
                            <SelectContent>
                                {['Netflix', 'Disney+', 'Prime Video', 'Max', 'Apple TV+', 'Peacock', 'Paramount+'].map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select value={show.status} onValueChange={(value) => handleChange('status', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {['Watching', 'Next', 'Watched'].map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {show.status === 'Watched' && (
                        <div>
                            <Label htmlFor="review">Review (Optional)</Label>
                            <Textarea
                                id="review"
                                value={show.review}
                                onChange={(e) => handleChange('review', e.target.value)}
                                rows={4}
                            />
                        </div>
                    )}
                    <div className="flex space-x-4">
                        <Button type="submit">{isNewShow ? 'Add Show' : 'Update Show'}</Button>
                        {!isNewShow && <Button type="button" onClick={handleDelete}>Delete Show</Button>}
                    </div>
                </form>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Link href={`/list?status=${show.status}`} className="text-blue-600 hover:underline">
                    Back to list
                </Link>

            </CardFooter>
        </Card>
    );
}