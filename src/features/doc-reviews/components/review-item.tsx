import React from "react";
import Image from "@/components/ui/image";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/utils";
import date from "@/utils/date";


type ReviewItemProps = {
  data: {
    created_at: string;
    name: string;
    content: string;
    avatar: string;
    like: boolean;
  };
};

const ReviewItem: React.FC<ReviewItemProps> = ({ data: { created_at, name, content, avatar, like } }) => {
  return (
    <div className="w-full py-1 flex justify-center items-center">
      <div className="mr-2.5 w-[50px] h-20 relative flex-shrink-0 flex justify-center items-center">
        <Image
          src={avatar}
          alt={name}
          className="rounded-full h-[auto] w-[50px]"
        />
        <span
          className={cn(`absolute top-[-5px] right-[-5px] z-10 flex justify-center items-center w-8 h-8 bg-white p-1 rounded-full border border-gray-300, ${like ? "text-blue-500" : "text-red-500"}`)}
        >
          {like ? <HandThumbUpIcon width={18} height={18} /> : <HandThumbDownIcon />}
        </span>
      </div>
      <div className="flex-grow">
        <div className="flex items-center justify-start">
          <span className="text-lg font-medium mr-2 text-gray-900">{name}</span>
          <span className="text-gray-700 text-sm capitalize">{date(created_at).dynamic()}</span>
        </div>
        <p className="mb-0 text-sm">{content}</p>
      </div>
    </div>
  );
}

export default ReviewItem;