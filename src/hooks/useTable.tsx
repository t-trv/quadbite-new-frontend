import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

interface FetchParams {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, string | number | boolean>;
}

interface QueryOptions {
  refetchOnWindowFocus?: boolean;
  refetchOnMount?: boolean;
  refetchInterval?: number;
  staleTime?: number;
  enabled?: boolean;
}

interface UseTableProps<TData, TError = any> {
  fetcher: (params: FetchParams) => Promise<TData>;
  mode?: 'pagination' | 'infinite';
  getItems?: (data: TData) => any[];
  queryKey?: string;
  initialPage?: number;
  initialPageSize?: number;
  initialSortBy?: string;
  initialSortOrder?: 'asc' | 'desc';
  initialSearch?: string;
  initialFilters?: Record<string, string | number | boolean>;
  queryOptions?: QueryOptions;
}

interface LastPage {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

export const useTable = <TData, TError = any>({
  fetcher,
  getItems,
  mode = 'pagination',
  queryKey = 'table',
  initialPage = 1,
  initialPageSize = 10,
  initialSortBy = 'createdAt',
  initialSortOrder = 'desc',
  initialSearch = '',
  initialFilters = {},
  queryOptions = {},
}: UseTableProps<TData, TError>) => {
  const [page, setPage] = useState<number>(initialPage);
  const [limit, setLimit] = useState<number>(initialPageSize);
  const [sortBy, setSortBy] = useState<string>(initialSortBy);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(initialSortOrder);
  const [search, setSearch] = useState<string>(initialSearch);
  const [filters, setFilters] = useState<Record<string, string | number | boolean>>(initialFilters);

  const sharedParams = { limit, sortBy, sortOrder, search, filters };

  const paginationQuery = useQuery<TData, TError>({
    enabled: mode === 'pagination',
    queryKey: [queryKey, page, limit, sortBy, sortOrder, search, filters],
    queryFn: () => fetcher({ page, ...sharedParams }),
    ...queryOptions,
  });

  const infiniteQuery = useInfiniteQuery<TData, TError>({
    enabled: mode === 'infinite',
    queryKey: [queryKey, 'infinite', limit, sortBy, sortOrder, search, filters],
    queryFn: ({ pageParam }) => fetcher({ page: pageParam as number, ...sharedParams }),
    initialPageParam: initialPage,
    getNextPageParam: (lastPage: any) => {
      // Try to find pagination metadata in different common response shapes
      const meta = lastPage?.data?.meta || lastPage?.data || lastPage;

      if (meta && typeof meta.hasNextPage === 'boolean' && typeof meta.pageNumber === 'number') {
        return meta.hasNextPage ? meta.pageNumber + 1 : undefined;
      }
      return undefined;
    },
    ...queryOptions,
  });

  const allItems = useMemo(() => {
    if (mode !== 'infinite' || !infiniteQuery.data?.pages || !getItems) return [];
    return infiniteQuery.data.pages.flatMap(getItems);
  }, [mode, infiniteQuery.data?.pages, getItems]);

  const activeQuery = mode === 'infinite' ? infiniteQuery : paginationQuery;

  return {
    ...activeQuery,

    page,
    limit,
    sortBy,
    sortOrder,
    search,
    filters,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    setSearch,
    setFilters,

    allItems,
    fetchNextPage: infiniteQuery.fetchNextPage,
    hasNextPage: infiniteQuery.hasNextPage,
    isFetchingNextPage: infiniteQuery.isFetchingNextPage,
  };
};
