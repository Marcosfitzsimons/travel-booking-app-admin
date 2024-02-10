import { Newspaper, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import PublicationCard from "./PublicationCard";
import Loading from "./Loading";
import ActionButton from "@/components/ActionButton";
import TotalCountCard from "@/components/TotalCountCard";
import { Publication } from "@/types/types";
import Error from "@/components/Error";
import { DataTableProps } from "@/types/props";

const PublicationsDatatable = <TData, TValue>({
  columns,
  linkText,
}: DataTableProps<TData, TValue>) => {
  const [list, setList] = useState<Publication[]>([]);

  const baseUrl = `/publications`;

  const { data, loading, error } = useFetch(baseUrl);

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <section className="flex flex-col gap-5">
      <div className="w-full max-w-[1400px]">
        <div className="">
          <div className="relative w-full flex flex-col items-center gap-2 md:pt-5">
            <div className="md:absolute md:right-0 md:top-[-80px]">
              <TotalCountCard
                icon={<Newspaper className="text-accent h-8 w-8" />}
                title="Publicaciones"
                value={loading ? "0" : list.length}
              />
            </div>
            <div className="md:self-end">
              <ActionButton
                text={linkText}
                linkTo="/publications/new"
                icon={
                  <Plus className="absolute cursor-pointer left-[13px] top-[7.3px] h-[17px] w-[17px] md:top-[4px] md:left-[8px] md:h-6 md:w-6" />
                }
              />
            </div>
          </div>
        </div>
        {error ? (
          <Error />
        ) : (
          <div className="flex flex-col items-center my-5 gap-3 xl:grid xl:grid-cols-2">
            {loading ? (
              <div className="col-start-1 col-end-3">
                <Loading />
              </div>
            ) : list.length > 0 ? (
              list.map((publication) => (
                <PublicationCard
                  key={publication._id}
                  setList={setList}
                  list={list}
                  item={publication}
                />
              ))
            ) : (
              <p>No se encontraron publicaciones hasta el momento</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicationsDatatable;
