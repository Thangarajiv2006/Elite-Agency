import type { shopState } from "@/constants/types";
import type { RootState } from "@/reducers";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import BreadCrumbs from "../BreadCrumbs";
import { Button } from "../ui/button";
import { SheetTrigger } from "../ui/sheet";

const ShopDetailsHeader = ({
  handleDelete,
  isLoading,
}: {
  handleDelete: () => void;
  isLoading: boolean;
}) => {
  const { id } = useParams();
  const shopsRes = useSelector((state: RootState) => state.shop);
  const shop = shopsRes.shops.find(
    (shop: shopState["shops"][0]) => shop._id === id,
  );
  const breadcrumbs = [
    { label: "Shops", link: "/shops" },
    { label: `${shop?.shopName || "Shop Details"}`, link: `/shops/${id}` },
  ];
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex sm:items-center justify-between gap-4 flex-col sm:flex-row">
        <div className="flex flex-col gap-1">
          <BreadCrumbs breadcrumbs={breadcrumbs} />
          <p className="text-sm text-muted-foreground">
            View and manage your shop details.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={() => navigate('/orders/create', { state: { presetShop: shop } })}
          >
            Create Order
          </Button>
          <SheetTrigger asChild>
            <Button disabled={isLoading}>Update</Button>
          </SheetTrigger>
          <Button
            disabled={isLoading}
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShopDetailsHeader;
