import { useEffect, useState } from "react";

import { PAGINATION } from "@/config/constants";

interface UseEntitySearchProps<T extends { search: string, page: number }> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export const useEntitySearch = <T extends { search: string, page: number }>({
  params,
  setParams,
  debounceMs,
}: UseEntitySearchProps<T>) => {

  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  useEffect(() => {
    if ((localSearch === "") && (params.search !== "")) {
      // This means user cleared search text, just reset all to default value
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });

      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params, setParams, debounceMs]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  }
}