import { useState, useMemo, useCallback, useRef } from 'react';
import Fuse, { type IFuseOptions } from 'fuse.js';
import { icd10_11Codes } from '../data/icd_data.js';

export interface ICD10SearchResult {
  ICD11CODE?: string | null;
  ICD10Code?: string | null;
  ICD11Title?: string | null;
  ICD10Title?: string | null;
  score?: number | null;
}

const RESULTS_LIMIT = 15;
const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;

export const useICD10Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<ICD10SearchResult[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fuse = useMemo(() => {
    const options: IFuseOptions<any> = {
      keys: [
        { name: 'ICD11CODE', weight: 0.4 },
        { name: 'ICD10Code', weight: 0.4 },
        { name: 'ICD11Title', weight: 0.1 },
        { name: 'ICD10Title', weight: 0.1 },
      ],
      threshold: 0.35,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: false,
      ignoreLocation: true,
      useExtendedSearch: false,
    };
    return new Fuse(icd10_11Codes as any[], options);
  }, []);

  const performSearch = useCallback(
    (query: string) => {
      const q = query.trim();
      if (q.length < MIN_QUERY_LENGTH) {
        setResults([]);
        return;
      }

      const isCodeLike = /^[A-Za-z0-9.\-]+$/.test(q) && !/\s/.test(q);
      let finalResults: ICD10SearchResult[] = [];

      if (isCodeLike) {
        const qLower = q.toLowerCase();
        const exactMatches = (icd10_11Codes as any[])
          .filter((item: any) => {
            const c10 = (item.ICD10Code || '').toString().toLowerCase();
            const c11 = (item.ICD11CODE || '').toString().toLowerCase();
            return c10.startsWith(qLower) || c11.startsWith(qLower);
          })
          .slice(0, RESULTS_LIMIT)
          .map((item: any) => ({
            ICD11CODE: item.ICD11CODE,
            ICD10Code: item.ICD10Code,
            ICD11Title: item.ICD11Title,
            ICD10Title: item.ICD10Title ?? null,
            score: null,
          }));

        finalResults = exactMatches;

        if (finalResults.length < RESULTS_LIMIT) {
          const fuzzy = fuse.search(q).slice(0, RESULTS_LIMIT);
          const fuzzyMapped = fuzzy
            .map(r => ({
              ICD11CODE: r.item.ICD11CODE,
              ICD10Code: r.item.ICD10Code,
              ICD11Title: r.item.ICD11Title,
              ICD10Title: r.item.ICD10Title ?? null,
              score: r.score ?? null,
            }))
            .filter(
              r =>
                !finalResults.find(
                  f => f.ICD10Code === r.ICD10Code && f.ICD11CODE === r.ICD11CODE,
                ),
            );

          finalResults = finalResults.concat(fuzzyMapped).slice(0, RESULTS_LIMIT);
        }
      } else {
        const fuzzy = fuse.search(q).slice(0, RESULTS_LIMIT);
        finalResults = fuzzy.map(r => ({
          ICD11CODE: r.item.ICD11CODE,
          ICD10Code: r.item.ICD10Code,
          ICD11Title: r.item.ICD11Title,
          ICD10Title: r.item.ICD10Title ?? null,
          score: r.score ?? null,
        }));
      }

      setResults(finalResults);
    },
    [fuse],
  );

  const handleSearchQueryChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => performSearch(query), DEBOUNCE_MS);
    },
    [performSearch],
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setResults([]);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchQueryChange,
    clearSearch,
    searchResults: results,
    isSearching: searchQuery.length >= MIN_QUERY_LENGTH,
  };
};
