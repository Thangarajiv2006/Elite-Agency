import React, { useEffect, useRef, useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { shopState } from "@/constants/types";
import type { RootState } from "@/reducers";
import { Sheet } from "@/components/ui/sheet";
import {
  ShopDetailsHeader,
  ShopDetailsMain,
  ShopInput,
  ShopOrdersList,
} from "@/components/shop";
import { useAppDispatch } from "@/hooks";
import { deleteShop, updateShop } from "@/actions/shop.action";
import { toast } from "sonner";

const ShopDetails = () => {
  const { id } = useParams();
  const shopRes = useSelector((state: RootState) => state.shop);
  const shop = shopRes.shops.find((s: shopState["shops"][0]) => s._id === id);
  const [shopForm, setShopForm] = useState<shopState["shops"][0]>(
    shop || {
      shopName: "",
      ownerName: "",
      phone: "",
      email: "",
      fssai: "",
      gst: "",
      pan: "",
      address: {
        village: "",
        district: "",
        landmark: "",
        state: "",
        pinCode: "",
        stateCode: "",
      },
    },
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (
      id === "village" ||
      id === "district" ||
      id === "landmark" ||
      id === "state" ||
      id === "pinCode" ||
      id === "stateCode"
    ) {
      setShopForm((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [id]: value,
        },
      }));
    } else {
      setShopForm((prev) => ({
        ...prev,
        [id]: value,
      }));
    }
  };

  const handleUpdateShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(updateShop({ _id: id, ...shopForm }))) as any;
    if (res?.data?.status === "success") {
      closeRef.current?.click();
      toast.success(res.data.message);
    } else if (res?.data?.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(deleteShop(id!))) as any;
    if (res?.data?.status === "success") {
      navigate("/shops", {
        state: {
          status: "success",
          message: "Shop Deleted Successfully",
        },
      });
    } else if (res?.data?.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!shop)
      navigate("/shops", {
        state: {
          status: "error",
          message: "Shop not found",
        },
      });
  }, []);

  return (
    <HomeLayout>
      <Sheet>
        <div className="">
          <ShopDetailsHeader
            isLoading={isLoading}
            handleDelete={handleDelete}
          />
          <ShopDetailsMain />
          <ShopOrdersList />
        </div>
        <ShopInput
          title="Update Shop"
          description="Update the shop details below. You can modify this information at any time."
          submitHandler={handleUpdateShop}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          closeRef={closeRef}
          buttonTitle="Update Shop"
          defaultValues={shop}
        />
      </Sheet>
    </HomeLayout>
  );
};

export default ShopDetails;
