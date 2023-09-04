import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setLoading(true);
    setError(false);
    const fetchData = async () => {
      try {
        const res = await axiosPrivate.get(url);
        setData(res.data);
      } catch (err) {
        console.log(err);
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosPrivate.get(url);
      setData(res.data);
    } catch (err) {
      console.log(err);
      setError(true);
    }
    setLoading(false);
  };
  return { data, loading, error, reFetch };
};

export default useFetch;
