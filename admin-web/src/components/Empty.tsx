import { Button } from "@/components/ui/button";
import {
  Empty as EmptyUi,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Plus, RefreshCcw } from "lucide-react";
import { Spinner } from "./ui/spinner";
import { SheetTrigger } from "./ui/sheet";

interface EmptyProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  refresh: () => void;
  isLoading: boolean;
  onAdd?: () => void;
}

const Empty = ({
  title,
  description,
  icon,
  refresh,
  isLoading,
  onAdd,
}: EmptyProps) => {
  return (
    <EmptyUi>
      <EmptyHeader>
        <EmptyMedia variant="icon">{isLoading ? <Spinner /> : icon}</EmptyMedia>
        <EmptyTitle>{isLoading ? "Getting things ready 🚀" : title}</EmptyTitle>
        <EmptyDescription>
          {isLoading ? "This will just take a moment." : description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Button onClick={refresh} disabled={isLoading}>
          <RefreshCcw />
          {"  "}
          Refresh
        </Button>
        {onAdd ? (
          <Button variant="outline" disabled={isLoading} onClick={onAdd}>
            <Plus />
            {"  "}
            Add New
          </Button>
        ) : (
          <SheetTrigger asChild>
            <Button variant="outline" disabled={isLoading}>
              <Plus />
              {"  "}
              Add New
            </Button>
          </SheetTrigger>
        )}
      </EmptyContent>
    </EmptyUi>
  );
};
export default Empty;
