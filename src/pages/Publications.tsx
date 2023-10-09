import { ChevronsRight, Newspaper, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import PublicationCard from "../components/PublicationCard";
import SectionTitle from "../components/SectionTitle";
import Loading from "../components/Loading";
import ActionButton from "@/components/ActionButton";
import TotalCountCard from "@/components/TotalCountCard";
import { Publication } from "@/types/types";
import Breadcrumb from "@/components/Breadcrumb";
import Error from "@/components/Error";

const PublicationsDatatable = () => {
  const [list, setList] = useState<Publication[]>([]);

  const baseUrl = `/publications`;

  const { data, loading, error } = useFetch(baseUrl);

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <section className="flex flex-col gap-5">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          <Newspaper className="w-5 h-5 text-accent" />
          Listas
          <ChevronsRight className="w-5 h-5" />
          Publicaciones
        </p>
      </Breadcrumb>
      <SectionTitle>Publicaciones destacadas</SectionTitle>
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
                text="Agregar publicación"
                linkTo="/publications/new"
                icon={
                  <Plus className="absolute cursor-pointer left-[13px] top-[7.3px] h-[18px] w-[18px] md:top-[4px] md:left-[8px] md:h-6 md:w-6" />
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
