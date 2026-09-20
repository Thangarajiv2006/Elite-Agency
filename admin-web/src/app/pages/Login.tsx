import { login } from "@/actions/auth.action";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { useAppDispatch } from "@/hooks";
import type { RootState } from "@/reducers";

import type React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [state, setState] = useState({
    email: "",
    password: "",
  });
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(login(state))) as any;
    if (res?.data?.status === "success") {
      toast.success(res.data.message);
      navigate("/", {
        replace: true,
        state: { status: "success", message: "Login successful!" },
      });
    } else if (res?.data?.status === "error") toast.error(res.data?.message);
    setIsLoading(false);
  };

  useEffect(() => {
    if (auth.token) {
      navigate("/", { replace: true });
    }
    if (location.state?.status === "success") {
      toast.success(location.state.message);
      location.state.status = "";
      location.state.message = "";
    } else if (location.state?.status === "error") {
      toast.error(location.state.message);
      location.state.status = "";
      location.state.message = "";
    }
  }, [auth]);

  return (
    <div className="flex items-center justify-center h-[100vh]">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button
              onClick={() => navigate("/sign-up")}
              variant={"link"}
              className="leading-none font-semibold"
            >
              Create Account
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" onChange={handleInputChange} />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Button
                    onClick={() => navigate("/forgot-password")}
                    variant={"link"}
                    type={"button"}
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={handleInputChange}
                />
              </div>
              <Button type="submit" className="w-full">
                {isLoading ? <Spinner /> : "Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>{" "}
      <Toaster richColors position="top-right" theme={theme} />
    </div>
  );
};

export default Login;
