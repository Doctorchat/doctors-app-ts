import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils";
import { HiCheck } from "react-icons/hi";
import { components } from "react-select";

const { MultiValueLabel, Control } = components;
export const CustomSelectOption = ({
  innerProps,
  label,
  avatar,
  seen,
  updated,
  data,
  isSelected,
}: any) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        isSelected ? "bg-gray-100 dark:bg-gray-500" : "hover:bg-gray-50 dark:hover:bg-gray-600"
      }`}
      {...innerProps}
    >
      <div className="flex items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={avatar} />
          <AvatarFallback>{getInitials(label)}</AvatarFallback>
        </Avatar>
        <span className="ml-2 rtl:mr-2">{label}</span>
      </div>

      {isSelected && <HiCheck className="text-xl text-emerald-500" />}
    </div>
  );
};
export const CustomControlMulti = ({ children, label, avatar, seen, data, ...props }: any) => {
  return (
    <MultiValueLabel {...props}>
      <div className="inline-flex items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={avatar} />
          <AvatarFallback>{getInitials(label)}</AvatarFallback>
        </Avatar>
        {children}
      </div>
    </MultiValueLabel>
  );
};
