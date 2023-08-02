import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/ui";
import { cn } from "@/utils";

export default function Conversation() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  return (
    <div
      className={cn("fixed inset-0 z-50 bg-white", {
        "slide-in-right": Boolean(id),
      })}
    >
      <div className="flex h-full flex-col">
        <header className="flex h-16 items-center space-x-4 border-b border-neutral-200 px-5">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
            onClick={() => navigate("/conversations")}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </Button>
        </header>
      </div>
    </div>
  );
}
