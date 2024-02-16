import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "../context/ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  const toggleTheme = () => {
    const t = theme === "light" ? "dark" : "light";
    setTheme(t);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
  }, [theme]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted ? (
    <div className="">
      {theme === "light" ? (
        <div>
          <Button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            variant="ghost"
            className="w-8 h-8 rounded-md p-0 dark:hover:text-white dark:hover:bg-blue-lagoon-900/70"
          >
            <SunMedium className="w-5 h-5" />
          </Button>
        </div>
      ) : (
        <div>
          <Button
            aria-label="Toggle theme"
            variant="ghost"
            onClick={toggleTheme}
            className="w-8 h-8 rounded-md p-0 dark:text-white hover:bg-blue-lagoon-300/10"
          >
            <MoonStar className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  ) : (
    <div />
  );
}
