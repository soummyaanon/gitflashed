"use client"

import { useState, useEffect } from 'react'
import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import FlashcardGrid from '@/components/FlashcardGrid'
import { Flashcard } from '@/types'
import { UsernameInput } from '@/components/UserInput'

interface PageParams {
  username: string
}

interface PageProps {
  params: Promise<PageParams> | undefined
}

export default function FlashcardsPage({ params }: PageProps) {
  const [username, setUsername] = useState<string | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Resolve params only once when the component mounts
  const [resolvedParams, setResolvedParams] = useState<PageParams | null>(null);

  if (!params) {
    notFound()
  }

  // Use an effect to resolve params
  useEffect(() => {
    const fetchParams = async () => {
      const resolved = await Promise.resolve(params);
      setResolvedParams(resolved);
      if (resolved.username) {
        setUsername(resolved.username);
        fetchFlashcards(resolved.username); // Fetch flashcards on initial load
      }
    };
    fetchParams();
  }, [params]);

  const fetchFlashcards = async (newUsername: string) => {
    setLoading(true);
    setError(null);

    try {
      const flashcardsResponse = await fetch(`/api/generate-flashcards?username=${newUsername}`);
      const flashcardsData: Flashcard[] = await flashcardsResponse.json();

      const formattedFlashcards = flashcardsData.map(card => ({
        id: card.id || Math.random().toString(36),
        title: card.title,
        content: typeof card.content === 'string' ? card.content : JSON.stringify(card.content)
      }));

      setFlashcards(formattedFlashcards);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load flashcards';
      setError(errorMessage);
      console.error('Error fetching flashcards:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameSubmit = (newUsername: string) => {
    setUsername(newUsername);
    fetchFlashcards(newUsername); // Fetch flashcards when the user submits a new username
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Chill Git Flashcards</h1>
      <UsernameInput onSubmit={handleUsernameSubmit} />

      {loading && <div className="text-center">Loading flashcards...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}

      {username && !loading && flashcards.length > 0 && (
        <Suspense fallback={<div>Loading flashcards...</div>}>
          <h2 className="text-2xl font-semibold mb-4 text-center">Flashcards for {username}</h2>
          <FlashcardGrid username={username} flashcards={flashcards} />
        </Suspense>
      )}
    </main>
  );
}