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

const PublicationsDatatable = () => {
  const [list, setList] = useState<Publication[]>([]);

  const baseUrl = `/publications`;

  const { data, loading, error } = useFetch(baseUrl);

  useEffect(() => {
    setList(data);
  }, [data]);

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <p className="flex items-center gap-1 text-card-foreground">
          Listas
          <ChevronsRight className="w-5 h-5" />
          Publicaciones
        </p>
      </Breadcrumb>
      <SectionTitle>
        <Newspaper className="w-6 h-6 text-accent sm:h-7 sm:w-7" />
        Publicaciones destacadas
      </SectionTitle>
      <div className="w-full max-w-[1400px]">
        <div className="">
          {error && (
            <p className="text-red-600 order-2">
              Error al cargar publicaciones, intentar más tarde
            </p>
          )}
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
        <div className="flex flex-col items-center my-5 gap-3 xl:flex-row xl:justify-center">
          {loading ? (
            <Loading />
          ) : (
            list.map((publication) => (
              <PublicationCard
                key={publication._id}
                setList={setList}
                list={list}
                item={publication}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicationsDatatable;
