import React, { useState } from 'react';
import { RecommendationResponse } from '@/app/lib/schemas';

type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string | RecommendationResponse;
};

type ApiResponse = {
    type: 'recommendations' | 'message';
    content: RecommendationResponse | string;
};

export default function RecommendationsPage() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'system',
            content: 'You are a TV show recommendation assistant. Always provide exactly 5 recommendations in JSON format. Each recommendation should include title, reason, and status.'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);

        try {
            const response = await fetch('/api/recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data: ApiResponse = await response.json();

            const assistantMessage: Message = {
                role: 'assistant',
                content: data.type === 'recommendations' ? data.content as RecommendationResponse : data.content as string
            };
            setMessages(prev => [...prev, assistantMessage]);
            setInput('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">TV Show Recommendations Chat</h1>

            <div className="mb-4 border rounded p-4 h-96 overflow-y-auto">
                {messages.map((message, index) => (
                    <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block p-2 rounded ${message.role === 'user' ? 'bg-blue-100' :
                            message.role === 'system' ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                            {message.role === 'system' && <p className="font-bold">System Message:</p>}
                            {typeof message.content === 'string' ? (
                                <p>{message.content}</p>
                            ) : (
                                <ul>
                                    {message.content.map((rec, recIndex) => (
                                        <li key={recIndex} className="mb-2">
                                            <h3 className="font-semibold">{rec.title}</h3>
                                            <p><strong>Reason:</strong> {rec.reason}</p>
                                            <p><strong>Status:</strong> {rec.status}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about TV shows or for recommendations..."
                    className="w-full p-2 border rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {loading ? 'Loading...' : 'Send'}
                </button>
            </form>

            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
}