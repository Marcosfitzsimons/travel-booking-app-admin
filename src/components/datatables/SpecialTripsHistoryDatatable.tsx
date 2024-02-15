import useFetch from "@/hooks/useFetch";
import { useEffect, useState } from "react";

const SpecialTripsHistoryDatatable = ({ columns }) => {
  const baseUrl = "/trips/history";
  const { data, loading, error } = useFetch(baseUrl);

  return <div className=""></div>;
};

export default SpecialTripsHistoryDatatable;
