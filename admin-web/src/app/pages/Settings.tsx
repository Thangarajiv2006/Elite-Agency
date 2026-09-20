import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  LogOut,
  Mail,
  Phone,
  Edit,
  KeyRound,
  MapPin,
  FileText,
  CreditCard,
  ShieldCheck,
  ChevronRight,
  Palette,
} from "lucide-react";
import HomeLayout from "../layout/HomeLayout";
import { UserEdit, ModeToggle } from "@/components";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import type { AuthState } from "@/constants/types";
import { useAppDispatch } from "@/hooks";
import { logout } from "@/actions/auth.action";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user as AuthState["user"];
  const dispatch = useAppDispatch();

  const nav = useNavigate();

  return (
    <HomeLayout>
      <div className="w-full">
        <div className="flex flex-col gap-1 mb-6">
          <div className="text-primary font-bold text-2xl">Settings</div>
          <p className="text-sm text-muted-foreground">
            Manage your agency profile, security, and preferences.
          </p>
        </div>

        {/* Profile Section */}
        <Card className="overflow-hidden border-border/50 shadow-sm transition-all hover:shadow-md">
          <Accordion type="single" collapsible className="w-full border-none">
            <AccordionItem value="profile" className="border-b-0">
              <AccordionTrigger className="hover:no-underline px-6 py-4 from-background">
                <div className="flex items-center gap-4 text-left">
                  <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm ring-2 ring-background">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary text-base font-bold">
                      {user?.agencyName?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-bold tracking-tight text-foreground/90">
                      {user?.agencyName}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      <p className="text-xs font-medium text-muted-foreground">
                        {user?.name}
                      </p>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6 pt-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact Info Card */}
                    <div className="border rounded-xl p-4 space-y-3 hover:border-primary/30">
                      <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                        Contact Details
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">
                          {user?.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <Phone className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">
                          {user?.phone}
                        </span>
                      </div>
                    </div>

                    {/* Business Details Card */}
                    <div className="border rounded-xl p-4 space-y-3 hover:border-primary/30">
                      <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-2">
                        Business IDs
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <CreditCard className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase">
                            PAN
                          </span>
                          <span className="font-semibold text-sm">
                            {user?.pan}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase">
                            GST
                          </span>
                          <span className="font-semibold text-sm">
                            {user?.gst}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary">
                          <ShieldCheck className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground uppercase">
                            FSSAI
                          </span>
                          <span className="font-semibold text-sm">
                            {user?.fssai}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Address Card */}
                    <div className="col-span-1 md:col-span-2 border rounded-xl p-4 hover:border-primary/30 transition-colors">
                      <h3 className="text-xs font-semibold text-foreground/70 uppercase tracking-wider mb-3">
                        Location
                      </h3>
                      <div className="flex items-start gap-3 text-sm">
                        <div className="p-1.5 bg-primary/10 rounded-lg text-primary shrink-0">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="leading-relaxed font-medium text-sm pt-0.5">
                          {user?.address?.plotNo}, {user?.address?.street},{" "}
                          {user?.address?.village},<br />
                          {user?.address?.district} - {user?.address?.pinCode},
                          <div>{user?.address?.state}</div>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          size="sm"
                          className="w-full sm:w-auto shadow-sm hover:shadow-md transition-all px-6"
                        >
                          <Edit className="h-4 w-4 mr-2" /> Edit Profile
                        </Button>
                      </SheetTrigger>
                      <UserEdit />
                    </Sheet>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>

        {/* Appearance Section */}
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4 text-primary" /> Appearance
            </CardTitle>
            <CardDescription className="text-sm">
              Customize the look and feel of your application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/5 border border-secondary">
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold leading-none">
                  Theme Preference
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose between light, dark, or system theme.
                </p>
              </div>
              <ModeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Forgot Password Section */}
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <KeyRound className="h-4 w-4 text-primary" /> Security
            </CardTitle>
            <CardDescription className="text-sm">
              Manage your password and security settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/5 border border-secondary">
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold leading-none">
                  Password Reset
                </h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Receive a secure link on your registered email to reset your
                  password.
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="shrink-0 w-full sm:w-auto font-medium shadow-sm hover:shadow text-sm"
                onClick={() => nav("/forgot-password")}
              >
                <ChevronRight />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Logout Section */}
        <Card className="border-border/50 shadow-sm transition-all hover:shadow-md mt-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <LogOut className="h-4 w-4 text-destructive" /> Logout
            </CardTitle>
            <CardDescription className="text-sm">
              Securely sign out from your account.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-destructive/20 to-destructive/5 border border-destructive">
              <div className="space-y-0.5">
                <h4 className="text-sm font-semibold leading-none">Sign Out</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You will be logged out from this device and need to login
                  again.
                </p>
              </div>

              <Button
                size="sm"
                variant="destructive"
                className="shrink-0 w-full sm:w-auto font-medium shadow-sm hover:shadow text-sm"
                onClick={() => dispatch(logout())}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </HomeLayout>
  );
}
