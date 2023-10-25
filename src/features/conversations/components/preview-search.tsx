import { HiOutlineSearch } from "react-icons/hi";
import { Input } from "antd";
import { ChangeEventHandler } from "react";

export interface PreviewSearchProps {
  onSearch: ChangeEventHandler<HTMLInputElement> | undefined;
}

export const PreviewSearch: React.FC<PreviewSearchProps> = ({ onSearch }) => (
  <Input
    size="large"
    placeholder="Cautare chatului"
    prefix={<HiOutlineSearch />}
    allowClear
    onChange={onSearch}
  />
);
