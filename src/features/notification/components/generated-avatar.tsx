import React from "react";
import { Avatar } from "antd";
import acronym, { useTwColorByName } from "./../../../hooks/useTwColorByName";

const GeneratedAvatar = ({ target }: { target: string }) => {
  const color = useTwColorByName();
  return (
    <Avatar shape="circle" className={`${color(target)}`}>
      {acronym(target)}
    </Avatar>
  );
};
export default GeneratedAvatar;
