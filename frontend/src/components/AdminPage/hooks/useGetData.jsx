import { useCallback, useEffect, useState } from "react";

export const useGetData = (url = "", pageSize = 10, current = 1) => {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [data, setData] = useState({
    users: [],
    games: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
  });

  const fetchingData = useCallback(() => {
    const query =
      `/api/${url}?` +
      new URLSearchParams({
        limit: pageSize,
        skip: (current - 1) * pageSize,
      });

    setLoading(true);
    setError(false);

    fetch(query, {
      headers: { Accept: "application/json" },
    })

      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
      })
      .then((response) => {
        const { pagination, auth, games, users } = response;

        if (!auth) {
          setError(true);
          return;
        }

        setData((prev) => ({
          ...prev,
          games: games ?? prev.games,
          users: users ?? prev.users,
          pagination: {
            current: current || 1,
            pageSize: pagination?.pageSize || 10,
            total: pagination?.total || 5,
          },
        }));
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url, pageSize, current]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  return {
    data,
    isError,
    isLoading,
    load: fetchingData,
  };
};
