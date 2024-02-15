import { useEffect, useState } from "react";
import useAxiosPrivate from "./useAxiosPrivate";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(false);
    const fetchData = async () => {
      try {
        const res = await axiosPrivate.get(url);
        setData(res.data);
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 403) {
          setAuth({ user: null });
          setTimeout(() => {
            navigate("/login");
          }, 100);
        }
        setError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  const reFetch = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await axiosPrivate.get(url);
      setData(res.data);
      setLoading(false);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setAuth({ user: null });
        setTimeout(() => {
          navigate("/login");
        }, 100);
      }
      setError(true);
      setLoading(false);
    }
  };
  return { data, loading, error, reFetch };
};

export default useFetch;
