import { SearchUserInputProps } from "@/types/props";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const SearchUserInput = ({ filter, setFilter }: SearchUserInputProps) => {
  return (
    <div className="w-full max-w-xs flex flex-col gap-2">
      <Label htmlFor="search-user" className="text-muted-foreground">
        Buscá por nombre, email o usuario...
      </Label>
      <Input
        type="search"
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="h-8 w-full"
        name="search-user"
      />
    </div>
  );
};

export default SearchUserInput;
