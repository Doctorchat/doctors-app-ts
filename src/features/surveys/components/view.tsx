import React from "react";
import { cn } from "@/utils";
import { Card, Tooltip } from "antd";
import TextEllipsis from "@/components/ui/textEllipsis";
import Button from "@/components/ui/buttonIcon";
import { HiOutlinePencil, HiOutlineTrash, HiPlus, HiPlusCircle } from "react-icons/hi";
import { classNames } from "classnames";

export interface ViewProps {
  inContainer?: boolean;
}
export const View: React.FC<ViewProps> = ({ inContainer }) => {
  return (
    <div
      className={cn(
        "custom-scroll-bar h-full w-full p-10 md:rounded-lg md:border md:border-neutral-200"
      )}
    >
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card bordered>
          {/* {article.title} */}
          <h6 className="mb-4 truncate text-lg">asd</h6>
          <div className="min-h-[40px]">
            {/* article.content.replace(/<[^>]*>?/gm, "") */}
            <TextEllipsis
              text="asdadasda sdaaaaaa aaa aaaaaa aaaaaaaaa aaaaa aaaaaa aaaaaaaa aaaaaaaaaaaaaaaaaaaa aaaaaa"
              maxTextCount={120}
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex">
              <Button
                shape="circle"
                variant="plain"
                size="sm"
                icon={<HiOutlineTrash />}
                // onClick={() => onArticleDelete(article.id)}
              />

              <Button
                shape="circle"
                variant="plain"
                size="sm"
                icon={<HiOutlinePencil />}
                // onClick={() => onArticleEdit(article.id)}
              />
            </div>
          </div>
        </Card>
        <Card bordered>
          {/* {article.title} */}
          <h6 className="mb-4 truncate text-lg text-primary">Adauga o intrebare</h6>
          <div className="min-h-[40px] text-primary">
            {/* article.content.replace(/<[^>]*>?/gm, "") */}
            <TextEllipsis
              text="Adaugarea unei intrebari personalizate pentru a crea o ancheta per pacient"
              maxTextCount={120}
            />
          </div>
          <Button
            shape="circle"
            variant="plain"
            size="lg"
            className="text-primary"
            icon={<HiPlus />}

            // onClick={() => onArticleDelete(article.id)}
          />
        </Card>
      </div>
    </div>
  );
};
