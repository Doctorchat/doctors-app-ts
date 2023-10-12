import { XMarkIcon } from "@heroicons/react/24/outline";
import { shallow } from "zustand/shallow";
import { createWithEqualityFn } from "zustand/traditional";

import {
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";

interface MessageTemplatesStore {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const useMessageTemplatesStore = createWithEqualityFn<MessageTemplatesStore>(
  (set) => ({
    open: false,
    setOpen: (open) => set({ open }),
  }),
  shallow,
);
//TODO DELETE
export const MessageTemplates: React.FC = () => {
  const open = useMessageTemplatesStore((store) => store.open);
  const setOpen = useMessageTemplatesStore((store) => store.setOpen);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-3.5 top-3.5 z-10 rounded-full"
          >
            <XMarkIcon className="h-5 w-5" />
          </Button>
        </SheetClose>

        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when youre done.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
