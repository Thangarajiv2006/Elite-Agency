import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { shopState } from "@/constants/types";
import type { RootState } from "@/reducers";
import {
  Mail,
  Phone,
  MapPin,
  CreditCard,
  FileText,
  Shield,
  Edit,
} from "lucide-react";
import { SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

const ShopDetailsMain = () => {
  const { id } = useParams();
  const shopsRes = useSelector((state: RootState) => state.shop);
  const shop = shopsRes.shops.find((s: shopState["shops"][0]) => s._id === id);

  if (!shop) return null;

  const initials = shop.shopName
    ? shop.shopName.substring(0, 2).toUpperCase()
    : "SH";

  const addressLine1 = [shop.address?.landmark, shop.address?.village]
    .filter(Boolean)
    .join(", ");
  const addressLine2 =
    `${shop.address?.district || ""} ${shop.address?.pinCode ? `- ${shop.address.pinCode}` : ""}`.trim();
  const addressLine3 = shop.address?.state || "";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Profile Section */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">
          {initials}
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {shop.shopName}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            {shop.ownerName || "No Owner"}
          </div>
        </div>
      </div>

      {/* Grid for Contact & Business IDs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Contact Details Card */}
        <div className="rounded-xl border border-border/50 bg-card/40 p-5 flex flex-col gap-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Contact Details
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground/90">
                {shop.email || "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Phone className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground/90">
                {shop.phone || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Business IDs Card */}
        <div className="rounded-xl border border-border/50 bg-card/40 p-5 flex flex-col gap-5">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Business IDs
          </h3>
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 leading-none">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <CreditCard className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-semibold text-muted-foreground">
                  PAN
                </span>
                <span className="text-sm font-medium text-foreground/90">
                  {shop.pan || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 leading-none">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-semibold text-muted-foreground">
                  GST
                </span>
                <span className="text-sm font-medium text-foreground/90">
                  {shop.gst || "N/A"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 leading-none">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Shield className="h-4 w-4" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[9px] uppercase font-semibold text-muted-foreground">
                  FSSAI
                </span>
                <span className="text-sm font-medium text-foreground/90">
                  {shop.fssai || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="rounded-xl border border-border/50 bg-card/40 p-5 flex flex-col gap-5">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Location
        </h3>
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
            <MapPin className="h-4 w-4" />
          </div>
          <div className="flex flex-col text-sm font-medium text-foreground/90 leading-relaxed">
            {addressLine1 && <span>{addressLine1},</span>}
            {addressLine2 && <span>{addressLine2},</span>}
            {addressLine3 && <span>{addressLine3}</span>}
            {!addressLine1 && !addressLine2 && !addressLine3 && (
              <span>N/A</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailsMain;
