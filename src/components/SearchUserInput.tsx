import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import DefaultButton from "./DefaultButton";
import { DialogTrigger } from "./ui/dialog";

type addressCda = {
  street: string;
  streetNumber: number | null;
  crossStreets: string;
};

type User = {
  _id: string | undefined;
  username: string | undefined;
  fullName: string | undefined;
  email: string | undefined;
  dni: number | undefined;
  addressCda: addressCda | undefined;
  addressCapital: string | undefined;
  phone: number | undefined;
  image?: string | undefined;
};

type SearchUserInputProps = {
  list: User[];
  setFilteredList: (users: any) => void;
};
const SearchUserInput = ({ list, setFilteredList }: SearchUserInputProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputValue = searchInput.trim().toLocaleLowerCase();
    const matchingUsers = list.filter((user) => {
      return (
        user.username?.toLowerCase().includes(inputValue) ||
        user.fullName?.toLowerCase().includes(inputValue) ||
        user.email?.toLowerCase().includes(inputValue)
      );
    });
    setFilteredList(matchingUsers);
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <div className="w-full flex flex-col gap-2">
        <Label>Ingresa nombre de usuario, email, o nombre:</Label>
        <div className="flex items-center gap-2">
          <div className="">
            <Input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-8"
            />
          </div>
          <div className="flex items-center relative after:pointer-events-none after:absolute after:inset-px after:rounded-[7px] after:shadow-highlight after:shadow-slate-400/10 focus-within:after:shadow-black/40 dark:after:shadow-slate-200/20 after:transition dark:focus-within:after:shadow-slate-300/60 dark:before:ring-slate-800/40 dark:before:border-slate-300/60">
            <Button className="h-8 py-2 outline-none inline-flex items-center bg-input-bg justify-center text-sm font-medium transition-colors rounded-lg shadow-input border border-slate-400/60 dark:border-slate-800 hover:bg-white dark:shadow-none dark:hover:text-white">
              Buscar
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SearchUserInput;
