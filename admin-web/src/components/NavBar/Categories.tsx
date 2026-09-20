import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import {
  ChevronRight,
  LayoutTemplate,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useAppDispatch } from "@/hooks";
import { useSelector } from "react-redux";
import type { RootState } from "@/reducers";
import type { categoryState } from "@/constants/types";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "../ui/spinner";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "@/actions/category.action";
import { toast } from "sonner";

const Categories = () => {
  const location = useLocation();
  const { isMobile } = useSidebar();
  const dispatch = useAppDispatch();
  const categories: categoryState[] = useSelector(
    (state: RootState) => state.category,
  );
  const [categoryName, setCategoryName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const hasFetched = useRef<boolean>(false);
  const nav = useNavigate();

  const handleCreateCategory = async () => {
    if (isLoading) return;
    setIsLoading(true);
    const res = (await dispatch(createCategory({ name: categoryName }))) as any;
    if (res?.data.status === "success") {
      toast.success(res?.data.message);
      cancelRef.current?.click();
      nav(`/category/${res?.data.category._id}`, {
        state: { status: "success", message: res.data.message },
      });
    } else if (res?.data.status === "error") {
      toast.error(res?.data.message);
    }
    setIsLoading(false);
  };

  const handleGetCategories = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await dispatch(getCategories());
    setIsLoading(false);
  };

  const handleDeleteCategory = async (id: string) => {
    if (isLoading) return;
    setIsLoading(true);
    toast.warning("Warning", {
      description: "It will delete all the products in this category",
      action: {
        label: "Delete",
        onClick: async () => {
          const res = (await dispatch(deleteCategory(id))) as any;
          if (res?.data.status === "success") {
            toast.success(res?.data.message);

            if (categories.length - 1 !== 0) {
              nav(`/category/${categories[0]._id}`, {
                state: { status: "success", message: res.data.message },
              });
            } else {
              nav(`/`, {
                state: { status: "success", message: res.data.message },
              });
            }
          } else if (res?.data.status === "error") {
            toast.error(res?.data.message);
          }
        },
      },
    });
    setIsLoading(false);
  };

  useEffect(() => {
    if (categories.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      handleGetCategories();
    }
  }, []);

  useEffect(() => {
    setIsOpen(location.pathname.startsWith("/category"));
  }, [location.pathname]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={"Categories"}>
            <LayoutTemplate />
            <span>Categories</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant={"outline"} className="w-full">
                    <Plus />
                    <span>Create Category</span>
                  </Button>
                </DialogTrigger>
                <form>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Category</DialogTitle>
                      <DialogDescription>
                        Enter the new category name below. and this data cannot
                        be modified.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                      <div className="flex flex-col gap-3">
                        <Label htmlFor="category">Category Name</Label>
                        <Input
                          id="category"
                          placeholder="Type category title..."
                          className="col-span-3"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline" ref={cancelRef}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" onClick={handleCreateCategory}>
                        {isLoading ? <Spinner /> : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </form>
              </Dialog>
            </SidebarMenuSubItem>
            {categories?.map((cate: categoryState) => (
              <SidebarMenuSubItem key={cate._id}>
                <SidebarMenuSubButton asChild>
                  <Link to={`/category/${cate._id}`}>
                    <span>{cate.name}</span>
                  </Link>
                </SidebarMenuSubButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction showOnHover>
                      <MoreHorizontal />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-48 rounded-lg"
                    side={isMobile ? "bottom" : "right"}
                    align={isMobile ? "end" : "start"}
                  >
                    <DropdownMenuItem>
                      <Pencil className="text-muted-foreground" />
                      <span>Update Stocks</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleDeleteCategory(cate._id!)}
                    >
                      <Trash2 className="text-muted-foreground" />
                      <span>Delete </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

export default Categories;
