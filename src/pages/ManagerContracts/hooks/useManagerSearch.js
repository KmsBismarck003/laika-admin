import { useEffect, useState } from 'react';
import { adminUsersAPI } from '@/services/adminService';
import useDebounce from '@/hooks/useDebounce';

const normalizeUsers = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.users)) return payload.users;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const useManagerSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    let cancelled = false;

    const search = async () => {
      setLoading(true);
      try {
        const params = { role: 'gestor', limit: 20 };
        if (debouncedQuery.trim()) params.search = debouncedQuery.trim();
        const payload = await adminUsersAPI.getAll(params);
        if (!cancelled) setResults(normalizeUsers(payload));
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    search();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return { query, setQuery, results, loading };
};

export default useManagerSearch;
