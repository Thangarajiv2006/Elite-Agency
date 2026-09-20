import React, { useEffect, useRef, useState } from "react";
import HomeLayout from "../layout/HomeLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import type { categoryState, productState } from "@/constants/types";
import { Sheet } from "@/components/ui/sheet";
import {
  CategoryHeader,
  ProductInput,
  ProductTable,
} from "@/components/category";
import { useAppDispatch } from "@/hooks";
import {
  createProduct,
  updateProduct,
  getProducts,
} from "@/actions/product.action";
import { toast } from "sonner";
import { productConstants } from "@/constants/action.constant";
import { Empty } from "@/components";
import { PackageOpen } from "lucide-react";

const defaultProductForm: Partial<productState["products"][0]> = {
  name: "",
  costPrice: 0,
  sellingPrice: 0,
  MRP: 0,
  HSN: "",
  CGST: 0,
  SGST: 0,
  unit: "pcs",
};

const CategoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const categoryList = useSelector((state: RootState) => state.category);
  const categoryData = categoryList.find(
    (cate: categoryState) => cate._id === id,
  );
  const { totalProducts } = useSelector((state: RootState) => state.product);

  const [productForm, setProductForm] =
    useState<Partial<productState["products"][0]>>(defaultProductForm);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const hasFetched = useRef<string | null>(null);

  useEffect(() => {
    if (!categoryData) {
      navigate("/", {
        state: { status: "error", message: "Category not found" },
      });
    }
  }, [categoryData, navigate]);

  const refresh = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(
      getProducts(id!, 1, productConstants.QUERY_PER_PAGE, ""),
    )) as any;
    if (res?.data?.status === "success") {
      toast.success(res.data.message);
    } else if (res?.data?.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (hasFetched.current !== id) {
      hasFetched.current = id!;
      refresh();
    }
  }, [id, totalProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [id]: type === "number" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    // Inject category scope into payload
    const payload = { ...productForm, categoryId: id };

    let res: any;
    if (isEditing) {
      res = await dispatch(updateProduct(payload));
    } else {
      res = await dispatch(createProduct(payload));
    }

    if (res?.data?.status === "success") {
      setIsSheetOpen(false);
      toast.success(res.data.message);
      setProductForm(defaultProductForm);
    } else if (res?.data?.status === "error") {
      toast.error(res.data.message);
    }
    setIsLoading(false);
  };

  const onEditClick = (product: productState["products"][0]) => {
    setIsEditing(true);
    setProductForm(product);
    setIsSheetOpen(true);
  };

  const onAddClick = () => {
    setIsEditing(false);
    setProductForm(defaultProductForm);
    setIsSheetOpen(true);
  };

  return (
    <HomeLayout>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <div className="">
          {totalProducts === 0 ? (
            <div className="flex items-center justify-center h-[80vh]">
              <Empty
                title="No Products Yet"
                description="You haven't added any products to this category yet. Click Add New to start."
                icon={<PackageOpen size={48} className="text-primary/50" />}
                refresh={refresh}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <div className="">
              <CategoryHeader
                categoryName={categoryData?.name}
                isLoading={isLoading}
                onAddClick={onAddClick}
                refresh={refresh}
              />
              <ProductTable categoryId={id!} onEditClick={onEditClick} />
            </div>
          )}
        </div>
        <ProductInput
          title={isEditing ? "Update Product" : "Add New Product"}
          description={
            isEditing
              ? "Modify your product details."
              : "Fill the fields below to add a new product."
          }
          submitHandler={handleFormSubmit}
          handleInputChange={handleInputChange}
          isLoading={isLoading}
          defaultValues={productForm}
          buttonTitle={isEditing ? "Update Product" : "Add Product"}
          setIsOpen={setIsSheetOpen}
        />
      </Sheet>
    </HomeLayout>
  );
};

export default CategoryDetails;
