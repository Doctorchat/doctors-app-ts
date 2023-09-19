import { useRef, forwardRef } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { Input } from "../input";
import useRootClose from "../hooks/useRootClose";
import useMergedRef from "../hooks/useMergeRef";
import { HiOutlineCalendar } from "react-icons/hi";
import type { CommonProps, TypeAttributes } from "../types/common";
import type {
  ReactNode,
  FocusEvent,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  MouseEvent,
  ChangeEvent,
} from "react";

dayjs.extend(localizedFormat);

export interface BasePickerSharedProps {
  clearable?: boolean;
  clearButton?: string | ReactNode;
  disabled?: boolean;
  inputtable?: boolean;
  inputPrefix?: string | ReactNode;
  inputSuffix?: string | ReactNode;
  name?: string;
  onBlur?: (event: FocusEvent<HTMLInputElement, Element>) => void;
  onDropdownOpen?: () => void;
  onDropdownClose?: () => void;
  onFocus?: (event: FocusEvent<HTMLInputElement, Element>) => void;
  placeholder?: string;
  size?: TypeAttributes.ControlSize;
  type?: HTMLInputTypeAttribute;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field?: any;
}

interface BasePickerProps extends CommonProps, BasePickerSharedProps {
  dropdownOpened: boolean;
  inputtableBlurClose?: boolean;
  inputLabel?: string;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onClear?: (event: MouseEvent<HTMLElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  setDropdownOpened: (opened: boolean) => void;
}

const BasePicker = forwardRef<HTMLInputElement, BasePickerProps>((props, ref) => {
  const {
    className,
    clearable = true,
    clearButton,
    children,
    disabled,
    dropdownOpened,
    inputtable,
    inputtableBlurClose = true,
    inputLabel,
    inputPrefix,
    inputSuffix = <HiOutlineCalendar className="text-lg" />,
    name,
    onDropdownOpen,
    onDropdownClose,
    onBlur,
    onFocus,
    onChange,
    onKeyDown,
    onClear,
    placeholder,
    setDropdownOpened,
    size,
    type,
    form,
    field,
  } = props;

  const handleInputClick = () => {
    !inputtable ? toggleDropdown() : openDropdown();
  };

  const closeDropdown = () => {
    setDropdownOpened(false);
    onDropdownClose?.();
  };

  const toggleDropdown = () => {
    setDropdownOpened(!dropdownOpened);
    !dropdownOpened ? onDropdownOpen?.() : onDropdownClose?.();
  };

  const openDropdown = () => {
    setDropdownOpened(true);
    onDropdownOpen?.();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    typeof onKeyDown === "function" && onKeyDown(event);
    if ((event.key === "Space" || event.key === "Enter") && !inputtable) {
      event.preventDefault();
      openDropdown();
    }
  };

  const handleInputBlur = (event: FocusEvent<HTMLInputElement, Element>) => {
    typeof onBlur === "function" && onBlur(event);
    if (inputtable && inputtableBlurClose) {
      closeDropdown();
    }
  };

  const handleInputFocus = (event: FocusEvent<HTMLInputElement, Element>) => {
    typeof onFocus === "function" && onFocus(event);
    if (inputtable) {
      openDropdown();
    }
  };

  const referenceRef = useRef<HTMLInputElement>(null);
  const popperRef = useRef(null);

  useRootClose(() => closeDropdown(), {
    triggerTarget: referenceRef,
    overlayTarget: popperRef,
    disabled: !dropdownOpened,
  });

  return (
    <>
      <Input
        ref={useMergedRef(ref, referenceRef)}
        form={form}
        className={className}
        placeholder={placeholder}
        name={name}
        value={inputLabel}
        readOnly={!inputtable}
        autoComplete="off"
        type={type}
        disabled={disabled}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        onBlur={handleInputBlur}
        onFocus={handleInputFocus}
        onChange={onChange}
      />
      <div ref={popperRef} className="picker">
        {dropdownOpened && <div className="picker-panel">{children}</div>}
      </div>
    </>
  );
});

BasePicker.displayName = "BasePicker";

export default BasePicker;
