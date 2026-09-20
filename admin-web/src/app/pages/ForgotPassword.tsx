import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import axiosInstance from "@/helpers/axios";
import { toast, Toaster } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { Spinner } from "@/components/ui/spinner";
import { useNavigate } from "react-router-dom";

type Step = "email" | "otp" | "reset";

const ForgotPassword = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState(user?.email ?? "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState<Boolean>(false);
  const [token, setToken] = useState<string>("");

  const { theme } = useTheme();
  const navigate = useNavigate();

  // Mock handlers (replace with API)

  const handleSendOTP = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = await axiosInstance.post("/auth/forgot-password/sendOTP", {
      email,
    });
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setToken(res.data.token);
      setStep("otp");
    } else if (res.data.status === "error") {
      setStep("email");
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (isLoading && !token) return;
    setIsLoading(true);
    const res = await axiosInstance.post("/auth/forgot-password/verifyOTP", {
      email,
      otp,
      token,
    });
    if (res.data.status === "success") {
      toast.success(res.data.message);
      setStep("reset");
    } else if (res.data.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const handleResetPassword = async () => {
    if (isLoading) return;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!token) {
      toast.error("Token not found");
      setStep("email");
      return;
    }
    setIsLoading(true);
    const res = await axiosInstance.put("/auth/forgot-password", {
      email,
      password,
      token,
      otp,
    });
    if (res.data.status === "success") {
      toast.success(res.data.message);
      const token = localStorage.getItem("token");
      if (token) {
        navigate("/settings", {
          state: { status: "success", message: "Password reset successful!" },
        });
      } else {
        navigate("/login", {
          state: { status: "success", message: "Password reset successful!" },
        });
      }
    } else if (res.data.status === "error") {
      toast.error(res.data.message);
      setStep("email");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-primary" />
            Forgot Password
          </CardTitle>
          <CardDescription>
            {step === "email" && "Enter your email to receive OTP"}
            {step === "otp" && "Enter the OTP sent to your email"}
            {step === "reset" && "Set your new password"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* STEP 1: EMAIL */}
          {step === "email" && (
            <>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    className="pl-8"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleSendOTP}>
                {isLoading ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  <>
                    Send OTP <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}

          {/* STEP 2: OTP */}
          {step === "otp" && (
            <>
              <div className="w-full flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={setOtp}
                  pattern={REGEXP_ONLY_DIGITS}
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
              </div>

              <Button className="w-full" onClick={handleVerifyOTP}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    Verify OTP <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}

          {/* STEP 3: RESET PASSWORD */}
          {step === "reset" && (
            <>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Button className="w-full" onClick={handleResetPassword}>
                {isLoading ? (
                  <Spinner />
                ) : (
                  <>
                    Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <Toaster richColors position="top-right" theme={theme} />
    </div>
  );
};

export default ForgotPassword;
