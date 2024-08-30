'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { marked } from 'marked';

export default function Home() {
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getRecommendation = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recommendations');
      const data = await response.json();
      setRecommendation(data.recommendation);
    } catch (error) {
      console.error('Failed to get recommendation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <Card className="my-8">
        <CardHeader>
          <h1 className="text-xl font-bold text-center">Welcome to Watch Tonight</h1>
          <p className="text-xl text-center">
            Your personal television assistant.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Button asChild className="mb-4">
            <Link href="/list?status=Watching">
              View My Watching List
            </Link>
          </Button>
          <Button onClick={getRecommendation} disabled={loading}>
            {loading ? 'Getting Recommendation...' : 'What Should I Watch Tonight?'}
          </Button>
        </CardContent>
      </Card>

      <div className="">

        {recommendation && (
          <div className="mt-4 text-left">
            <h2 className="text-lg font-semibold">Recommendation:</h2>
            <div className="mt-2 text-lg leading-relaxed prose dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: marked(recommendation) }} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
