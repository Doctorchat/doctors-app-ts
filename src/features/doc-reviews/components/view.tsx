import React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "@/utils";
import { useQuery } from "react-query";
import { getMyReviews } from "../api";
import { Skeleton } from "@/components/ui";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";
import ReviewItem from "./review-item";

export const View: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: publicReviewsData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["publicReviews"],
    queryFn: async () => {
      return getMyReviews();
    },
  });

  if (isLoading) {
    return (
      <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar flex flex-col gap-2")}>
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  };

  if (isError || !publicReviewsData?.length) {
    return (
      <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar flex flex-col gap-2")}>
        <div className="flex flex-col items-center justify-center mt-8">
          <ArchiveBoxXMarkIcon
            className="w-16 h-16 text-gray-400"
          />
          <h4 className="text-md font-medium text-gray-400 mb-2">{t("common:no_data")}</h4>
          <p className="text-sm text-gray-400 mb-2">{t("common:reviews_list_empty")}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={cn("col-span-12 md:col-span-8 xl:col-span-4 h-full w-full md:rounded-lg md:border md:border-neutral-200 p-10 custom-scroll-bar")}>
      <div
        className={cn("flex flex-col gap-2")}
      >
        {publicReviewsData?.map((item: any) => (
          <ReviewItem
            key={item.id}
            data={item}
          />
        ))}
      </div>
    </div>
  );
};