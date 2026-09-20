import React, { useEffect, useRef, useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { Store } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import { Empty } from "@/components";
import { Sheet } from "@/components/ui/sheet";
import { ShopHeader, ShopInput, ShopTable } from "@/components/shop";
import type { shopState } from "@/constants/types";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks";
import { createShop, getShops } from "@/actions/shop.action";
import { shopConstants } from "@/constants/action.constant";

const Shop = () => {
  const { totalShops } = useSelector((state: RootState) => state.shop);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [shopForm, setShopForm] = useState<shopState["shops"][0]>({
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
  });
  const dispatch = useAppDispatch();
  const hasFetched = useRef<boolean>(false);

  const refresh = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(getShops(1))) as any;
    if (res?.data.status === "success") {
      toast.success(res.data.message);
    } else if (res?.data.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

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

  const addShop = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(createShop(shopForm))) as any;
    console.log(res);
    if (res?.data.status === "success") {
      closeRef.current?.click();
      toast.success(res.data.message);
      setShopForm({
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
      });
      setIsLoading(false);
      dispatch(
        getShops(Math.ceil((totalShops + 1) / shopConstants.QUERY_PER_PAGE)),
      );
    } else if (res?.data.status === "error") {
      toast.error(res.data.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (totalShops === 0 && !hasFetched.current) {
      hasFetched.current = true;
      refresh();
    }
  }, []);

  return (
    <HomeLayout>
      <Sheet>
        <div>
          {totalShops === 0 ? (
            <div className="flex items-center justify-center h-screen">
              <Empty
                title="No Shops Yet"
                description="You haven't created any shops yet. Get started by creating your first shop."
                icon={<Store />}
                refresh={refresh}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="">
              <ShopHeader refresh={refresh} isLoading={isLoading} />
              <div className="">
                <ShopTable />
              </div>
            </div>
          )}
        </div>
        <ShopInput
          title="Add New Shop"
          description="Add a new shop to your account."
          submitHandler={addShop}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          closeRef={closeRef}
          buttonTitle="Add Shop"
        />
      </Sheet>
    </HomeLayout>
  );
};

export default Shop;
