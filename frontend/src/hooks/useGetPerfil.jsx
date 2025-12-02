import { useCallback, useEffect, useState } from "react";
import { buildApiUrl } from "../config";

export const useGetPerfil = (url = "users") => {
  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [user, setUser] = useState({ data: {} });

  const fetchingData = useCallback(() => {
    const querie =buildApiUrl(`/api/${url}/perfil`);
    setLoading(true);

    fetch(querie, {
      headers: { Accept: "application/json" },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((response) => {
        const { data = {} } = response;
        setUser({ data });
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    fetchingData();
  }, [fetchingData]);

  return {
    user,
    isError,
    isLoading,
    load: fetchingData,
  };
};
