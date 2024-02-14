import Chart from "./Chart";
import Loading from "./Loading";
import Error from "./Error";
import { IncomesProps } from "@/types/props";
import GorgeousBoxBorder from "./GorgeousBoxBorder";
import { Icons } from "./icons";
import { getCurrentMonth } from "@/lib/utils/getCurrentMonth";

const Incomes = ({ incomes, error, isLoading }: IncomesProps) => {
  return (
    <div className="relative w-full flex flex-col gap-2 2xl:basis-[70%]">
      <div className="self-end">
        <GorgeousBoxBorder>
          <p className="rounded-lg bg-card py-1 px-5 flex items-center border shadow-input dark:shadow-none">
            <Icons.calendar className="mr-2 w-5 h-5 relative bottom-[1px]" />
            {getCurrentMonth()}
          </p>
        </GorgeousBoxBorder>
      </div>
      {error ? (
        <Error />
      ) : (
        <>
          {isLoading ? (
            <Loading />
          ) : (
            <GorgeousBoxBorder>
              <Chart incomes={incomes} />
            </GorgeousBoxBorder>
          )}
        </>
      )}
    </div>
  );
};

export default Incomes;
