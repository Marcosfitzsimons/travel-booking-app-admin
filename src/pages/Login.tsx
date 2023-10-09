import { useForm } from "react-hook-form";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "../components/ui/separator";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Logo from "../components/Logo";
import DefaultButton from "../components/DefaultButton";
import useAuth from "@/hooks/useAuth";
import { Checkbox } from "@/components/ui/checkbox";

type User = {
  emailOrUsername: String;
  password: String;
};

const Login = () => {
  const [err, setErr] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { auth, setAuth, persist, setPersist } = useAuth();
  const user = auth?.user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      emailOrUsername: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const handleOnSubmit = async (data: User) => {
    setIsLoading(true);
    setErr("");
    try {
      const {
        data: { token, details },
      } = await axios.post(`/auth/login`, data, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      setIsLoading(false);
      if (details.isAdmin) {
        setAuth({ user: details, token });
        navigate("/");
      } else {
        const errorMsg = "No estás autorizado";
        setErr(errorMsg);
      }
    } catch (err: any) {
      if (!err?.response) {
        setErr(
          "Ha ocurrido un error en el servidor. Intentar de nuevo más tarde"
        );
        setIsLoading(false);
      } else {
        const errorMsg = err.response?.data?.msg;
        setErr(errorMsg);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("persist", persist.toString());
  }, [persist]);

  return (
    <section className="">
      <div className="flex flex-col items-center lg:flex-row lg:justify-around lg:gap-20 2xl:justify-between">
        <Separator
          orientation="vertical"
          className="h-52 bg-gradient-to-t from-neutral-800 to-blue-lagoon-50 dark:from-blue-lagoon-200 dark:to-[#0d0f12] lg:hidden"
        />
        <div className="w-full max-w-md">
          <h2 className="text-3xl uppercase py-2 font-medium text-center lg:text-start dark:text-white">
            Panel de Administrador
          </h2>
          <p className="text-center lg:text-start text-card-foreground">
            Entrá para administrar tu aplicación
          </p>
          <form
            onSubmit={handleSubmit(handleOnSubmit)}
            className="relative w-full py-6 flex flex-col gap-3 items-center lg:max-w-sm"
          >
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="emailOrUsername">Email o nombre de usuario</Label>
              <Input
                type="text"
                id="emailOrUsername"
                {...register("emailOrUsername", {
                  required: {
                    value: true,
                    message: "Por favor, ingresa tu email o nombre de usuario",
                  },
                  minLength: {
                    value: 3,
                    message: "Email o nombre de usuario demasiado corto",
                  },
                  maxLength: {
                    value: 40,
                    message: "Email o nombre de usuario demasiado largo",
                  },
                })}
              />
              {errors.emailOrUsername && (
                <p className="text-red-600">{errors.emailOrUsername.message}</p>
              )}
            </div>
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                id="password"
                {...register("password", {
                  required: {
                    value: true,
                    message: "Por favor, ingresa tu contraseña",
                  },
                  minLength: {
                    value: 3,
                    message: "Contraseña no puede ser tan corta",
                  },
                  maxLength: {
                    value: 25,
                    message: "Contraseña no puede ser tan larga",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-600">{errors.password.message}</p>
              )}
            </div>
            <div className="w-full relative flex items-center space-x-1">
              <Checkbox
                id="confirmAddress"
                checked={persist}
                onCheckedChange={() => setPersist((prev) => !prev)}
              />
              <label
                htmlFor="confirmAddress"
                className="text-sm font-medium flex items-center gap-[2px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Permanecer conectado
              </label>
            </div>
            {err && <p className="text-red-600 self-start">{err}</p>}
            <DefaultButton loading={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </DefaultButton>
          </form>
        </div>
        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-6 2xl:mr-16">
          <Separator
            orientation="vertical"
            className="h-80 bg-gradient-to-t from-neutral-800 to-blue-lagoon-50 dark:from-blue-lagoon-200 dark:to-[#0d0f12]"
          />
          <Logo />
          <Separator
            orientation="vertical"
            className="h-80 bg-gradient-to-b from-neutral-800 to-blue-lagoon-50 dark:from-blue-lagoon-200 dark:to-[#0d0f12]"
          />
        </div>

        <Separator
          orientation="vertical"
          className="h-52 bg-gradient-to-b from-neutral-800 to-blue-lagoon-50 dark:from-blue-lagoon-200 dark:to-[#0d0f12] lg:hidden"
        />
      </div>
    </section>
  );
};

export default Login;
