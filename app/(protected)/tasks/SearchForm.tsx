'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState('');

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    const normalizedKeyword = keyword.trim();

    if (normalizedKeyword !== '') {
      params.set('q', normalizedKeyword);
    } else {
      params.delete('q');
    }

    router.push(`/tasks?${params.toString()}`);
  }

  return (
    <>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="検索"
        className="rounded-md border px-3 py-2 text-sm"
      />

      <button onClick={handleSearch} className="rounded-md border px-4 py-2 text-sm cursor-pointer">
        検索
      </button>
    </>
  );
}
