import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import _Timeline, { TimelineProps } from "./Timeline";
import TimeLineItem from "./TimeLineItem";
import { CommonProps, TypeAttributes } from "../types/common";
import { Avatar } from "..";

export type { TimelineProps } from "./Timeline";
export type { TimeLineItemProps } from "./TimeLineItem";

type CompoundedComponent = ForwardRefExoticComponent<
  TimelineProps & RefAttributes<HTMLUListElement>
> & {
  Item: typeof TimeLineItem;
};
export interface AvatarProps extends CommonProps {
  alt?: string;
  icon?: ReactNode;
  onClick?: () => void;
  size?: "lg" | "md" | "sm" | number;
  shape?: Exclude<TypeAttributes.Shape, "none"> | "square";
  src?: string;
  srcSet?: string;
}
export const TimelineAvatar = ({ children, ...rest }: AvatarProps) => {
  return <Avatar {...rest}>{children}</Avatar>;
};
const Timeline = _Timeline as CompoundedComponent;

Timeline.Item = TimeLineItem;

export { Timeline };

export default Timeline;
