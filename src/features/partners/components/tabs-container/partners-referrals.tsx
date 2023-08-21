import React from "react";
import { useTranslation } from "react-i18next";
import date from "@/utils/date";
import { useQuery } from "react-query";
import { getPartners } from "../../api";
import { Skeleton } from "@/components/ui";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/outline";

interface ReferralProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  created_at: string;
};

const ReferralItem: React.FC<ReferralProps> = ({ name, email, phone, created_at }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-gray-100">
      <div>
        <h4 className="text-gray-800 text-lg mb-0 font-medium">{name}</h4>
        <div className="flex items-center mt-1">
          <p className="text-gray-700 text-base mb-0 mr-2 capitalize">{date(created_at).default}</p>
          <p className="text-gray-700 text-base mb-0 mr-2">{phone}</p>
          <p className="text-gray-700 text-base mb-0">{email}</p>
        </div>
      </div>
      <p className="text-green-500 bg-green-100 text-sm font-medium px-3 py-1 rounded-full mb-0">{t("common:active")}</p>
    </div>
  );
};

const ReferralItemSkeleton: React.FC = () => {
  return (
    <div className="flex flex-column gap-1">
      <Skeleton className="w-full h-12" />
    </div>
  );
};

const PartnersReferrals: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: partnersData,
    isLoading
  } = useQuery(["partners"],
    () => getPartners(), {
    keepPreviousData: true,
  });

  if (isLoading) {
    return (
      <div className="space-y-3 mt-5">
        <ReferralItemSkeleton />
        <ReferralItemSkeleton />
        <ReferralItemSkeleton />
        <ReferralItemSkeleton />
        <ReferralItemSkeleton />
      </div>
    );
  };

  const { referrals } = partnersData;

  if (!referrals?.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-8">
        <ArchiveBoxXMarkIcon
          className="w-16 h-16 text-gray-400"
        />
        <h4 className="text-md font-medium text-gray-400 mb-2">{t("partners:empty")}</h4>
      </div>
    );
  };

  return (
    <div className="space-y-3 mt-5">
      {referrals.map((referral: ReferralProps) => (
        <ReferralItem key={referral.id} {...referral} />
      ))}
    </div>
  );
};

export default PartnersReferrals;