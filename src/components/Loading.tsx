import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="w-full my-[13rem] flex items-center justify-center lg:my-[17rem]">
      <Loader2 className="w-5 h-5 animate-spin" />
    </div>
  );
};

export default Loading;
