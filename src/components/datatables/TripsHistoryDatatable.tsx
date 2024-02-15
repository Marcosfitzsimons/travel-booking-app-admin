import useFetch from "@/hooks/useFetch";

const TripsHistoryDatatable = ({ columns }) => {
  const baseUrl = "/trips/history";
  const { data, loading, error } = useFetch(baseUrl);

  return <div className=""></div>;
};

export default TripsHistoryDatatable;
