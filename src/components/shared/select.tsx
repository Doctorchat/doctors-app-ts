import React, { ForwardedRef, ReactNode } from 'react';
import * as Select from '@radix-ui/react-select';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils';

import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

interface SelectItemProps {
  children: ReactNode;
  className?: string;
  value: string;
}

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  options: Option[];
  defaultValue?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SelectCustom: React.FC<SelectProps> = (props) => {
  const {
    value,
    disabled,
    options,
    onChange,
    defaultValue,
  } = props;
  const { t } = useTranslation();

  return (
    <Select.Root {...props}
      onValueChange={onChange}
      defaultValue={defaultValue}
      disabled={disabled}
      value={value}
    >
      <Select.Trigger
        className="inline-flex items-center justify-center rounded px-[15px] text-[13px] leading-none h-[35px] gap-[5px] bg-white text-blue-600 shadow-[0_2px_10px] shadow-black/10 hover:bg-mauve3 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-blue-400 outline-none"
        aria-label="Food"
      >
        <Select.Value>
          {t(`common:${value}`) || (`common:${defaultValue}`) || t("common:select")}
        </Select.Value>
        <Select.Icon className="text-blue-600">
          <ChevronDownIcon width={14} height={14} />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="overflow-hidden bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
          <Select.ScrollUpButton className="flex items-center justify-center h-[25px] bg-white text-blue-300 cursor-default">
            <ChevronUpIcon width={14} height={14} />
          </Select.ScrollUpButton>
          <Select.Viewport className="p-[5px]">
            <Select.Group>
              <Select.Label className="px-[25px] text-xs leading-[25px] text-mauve11">
                {t("common:select")}
              </Select.Label>
              {options.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              ))}
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-blue-800 cursor-default">
            <ChevronDownIcon width={14} height={14} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};

const SelectItem: React.ForwardRefExoticComponent<
  React.PropsWithChildren<SelectItemProps> & React.RefAttributes<HTMLDivElement>
> = React.forwardRef((props, ref: ForwardedRef<HTMLDivElement>) => {
  return (
    <Select.Item
      className={cn(
        'text-[13px] leading-none text-gray-600 rounded-[3px] flex items-center h-[25px] pr-[35px] pl-[25px] relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-blue-200 data-[highlighted]:text-blue-800',
        props.className
      )}
      {...props}
      ref={ref}
    >
      <Select.ItemText>{props.children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <CheckIcon width={14} height={14} />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default SelectCustom;