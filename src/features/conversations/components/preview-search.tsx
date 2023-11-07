import { HiOutlineSearch } from "react-icons/hi";
import { Input } from "antd";
import { ChangeEventHandler } from "react";
import { t } from "i18next";

export interface PreviewSearchProps {
  onSearch: ChangeEventHandler<HTMLInputElement> | undefined;
}

export const PreviewSearch: React.FC<PreviewSearchProps> = ({ onSearch }) => (
  <Input
    size="large"
    placeholder={t("conversations:search_chat")}
    prefix={<HiOutlineSearch />}
    allowClear
    onChange={onSearch}
  />
);
