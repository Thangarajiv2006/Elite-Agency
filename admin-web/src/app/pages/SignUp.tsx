import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { verifyOTP } from "@/actions/auth.action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import type { AuthForm } from "@/constants/types";
import axios from "@/helpers/axios";
import { useAppDispatch } from "@/hooks";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import { useTheme } from "@/components/ThemeProvider";

const SignUp = () => {
  const navigate = useNavigate();

  const auth = useSelector((state: RootState) => state.auth);

  const [state, setState] = useState<AuthForm>({
    agencyName: "",
    name: "",
    email: "",
    phone: "",
    pan: "",
    gst: "",
    fssai: "",
    plotNo: "",
    street: "",
    village: "",
    district: "",
    state: "",
    stateCode: "",
    pinCode: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOTPLoading, setIsOTPLoading] = useState<boolean>(false);
  const [OTP, setOTP] = useState<string>("");
  const [isOTPActive, setIsOTPActive] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
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
    if (isLoading) return; // Prevent multiple submissions
    setIsLoading(true);
    const res = await axios.post("/auth/register", state);
    if (res.data.status === "success") {
      toast.success("OTP sent to your Email");
      setToken(res.data.token);
      setIsOTPActive(true);
    } else if (res.data.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const handleOTPSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isOTPLoading) return;
    setIsOTPLoading(true);
    const res = (await dispatch(
      verifyOTP({ ...state, otp: OTP, token }),
    )) as any;
    if (res?.data?.status === "success") {
      toast.success("OTP verified successfully");
      navigate("/login", {
        state: { status: "success", message: "Account created successfully!" },
      });
    } else if (res?.data?.status === "error") {
      toast.error(res.data.message);
    }
    setIsOTPLoading(false);
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
      <Card className="w-[800px] ">
        <CardHeader className="">
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Enter your details to create your account
          </CardDescription>
          <CardAction>
            <Button
              onClick={() => navigate("/login")}
              variant={"link"}
              className="leading-none font-semibold"
            >
              Sign In
            </Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-2">
              <Label htmlFor="agencyName">Agency Name</Label>
              <Input
                id="agencyName"
                type="text"
                required
                onChange={handleInputChange}
                disabled={isOTPActive}
              />
            </div>
            <div className="flex mt-3 justify-between">
              <div className="w-[48%]">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    onChange={handleInputChange}
                    disabled={isOTPActive}
                  />
                </div>
                <div className="flex mt-2 justify-between">
                  <div className="grid gap-2 2-[45%]">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                  <div className="grid gap-2 w-[45%]">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type={"text"}
                      pattern="[0-9]{10}"
                      required
                      maxLength={10}
                      title="Enter a valid phone number (10 digits)"
                      autoComplete="off"
                      inputMode="numeric"
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                </div>
                <div className="flex mt-2 justify-between">
                  <div className="grid gap-2 2-[45%]">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input
                      id="pan"
                      type="text"
                      maxLength={10}
                      pattern="^[A-Z]{3}[PCFHATBLJG][A-Z][0-9]{4}[A-Z]$"
                      title="Enter a valid PAN (Example: ABCPA1234F)"
                      autoCapitalize="characters"
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                  <div className="grid gap-2 w-[45%]">
                    <Label htmlFor="gst">GSTIN </Label>
                    <Input
                      id="gst"
                      type={"text"}
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$"
                      title="Enter valid GSTIN"
                      maxLength={15}
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                </div>
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="fssai">FSSAI</Label>
                  <Input
                    id="fssai"
                    type="text"
                    required
                    onChange={handleInputChange}
                    disabled={isOTPActive}
                  />
                </div>
              </div>
              <div className="w-[48%]">
                <div className="flex justify-between">
                  <div className="grid gap-2 w-[20%]">
                    <Label htmlFor="plotNo">Plot No</Label>
                    <Input
                      id="plotNo"
                      type="text"
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                  <div className="grid gap-2 w-[77%]">
                    <Label htmlFor="street">Street</Label>
                    <Input
                      id="street"
                      type={"text"}
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                </div>
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="village">City / Town</Label>
                  <Input
                    id="village"
                    type={"text"}
                    required
                    onChange={handleInputChange}
                    disabled={isOTPActive}
                  />
                </div>
                <div className="flex mt-2 justify-between">
                  <div className="grid gap-2 w-[57%]">
                    <Label htmlFor="district">District</Label>
                    <Input
                      id="district"
                      type={"text"}
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                  <div className="grid gap-2 w-[40%]">
                    <Label htmlFor="pinCode">Pin Code</Label>
                    <Input
                      id="pinCode"
                      type="number"
                      maxLength={6}
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                </div>
                <div className="flex mt-2 justify-between">
                  <div className="grid gap-2 w-[57%]">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      type={"text"}
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                  <div className="grid gap-2 w-[40%]">
                    <Label htmlFor="stateCode">State Code</Label>
                    <Input
                      id="stateCode"
                      type="number"
                      maxLength={2}
                      required
                      onChange={handleInputChange}
                      disabled={isOTPActive}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-2 mt-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                onChange={handleInputChange}
                disabled={isOTPActive}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-5"
              disabled={isOTPActive}
            >
              {isLoading ? <Spinner /> : "Create Account"}
            </Button>
          </CardContent>
        </form>
        <CardFooter className="flex-col gap-2 mt-5">
          <form
            onSubmit={handleOTPSubmit}
            className="w-full flex flex-col items-center justify-center"
          >
            <InputOTP
              maxLength={6}
              className=""
              pattern={REGEXP_ONLY_DIGITS}
              disabled={!isOTPActive}
              value={OTP}
              onChange={(value) => setOTP(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
            <Button
              type="submit"
              className="w-full mt-5"
              disabled={!isOTPActive}
            >
              Verify OTP
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Toaster richColors position="top-right" theme={theme} />
    </div>
  );
};

export default SignUp;
