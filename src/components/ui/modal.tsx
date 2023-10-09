import { Modal, ModalProps } from "antd";
import { FC, ReactNode } from "react";
import "antd/dist/reset.css";

export interface IModalComponentProps extends ModalProps {
  displayFooter?: boolean;
  footerButtons?: ReactNode;
  displayHeaderCloseBtn?: boolean;
  displayFooterCloseButton?: boolean;
  displayFooterSubmitButton?: boolean;
  isOpen?: boolean;
  setOpen?: (open: boolean) => void;
  isCentered?: boolean;
  isMaskClosable?: boolean;

  submitBtnText?: string;
  cancelBtnText?: string;

  onSubmit?: () => Promise<void>;
  formKeyId?: string;
  responseStatus?: string;
  disableSubmitButton?: boolean;

  justifyTitleContent?: "flex-start" | "center" | "flex-end";
}

const ModalComponent: FC<IModalComponentProps> = ({
  formKeyId,
  title,
  width,
  children,
  footerButtons,
  displayFooter,
  submitBtnText,
  cancelBtnText,
  displayHeaderCloseBtn,
  displayFooterCloseButton,
  displayFooterSubmitButton,
  isOpen,
  setOpen,
  isCentered,
  isMaskClosable,
  onSubmit,
  disableSubmitButton,
  justifyTitleContent,
}) => {
  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            justifyContent: justifyTitleContent ?? "flex-start",
          }}
        >
          {title}
        </div>
      }
      maskStyle={{ opacity: 0.5 }}
      className={`modal-component `}
      okText="submit"
      open={isOpen}
      destroyOnClose
      width={width ?? "60%"}
      centered={isCentered ?? true}
      maskClosable={isMaskClosable ?? false}
      closable={displayHeaderCloseBtn ?? false}
      footer={
        displayFooter ?? true
          ? [
              <div className="flex flex-col-reverse space-y-2 space-y-reverse sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
                {displayFooterCloseButton ?? true ? (
                  <button
                    onClick={() => (setOpen ? setOpen(false) : null)}
                    type="button"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-800 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 active:bg-neutral-100 active:text-neutral-900 disabled:pointer-events-none disabled:opacity-50 md:hover:bg-neutral-100 md:hover:text-neutral-900"
                  >
                    {cancelBtnText ?? "close"}
                  </button>
                ) : null}
                {displayFooterSubmitButton ?? true ? (
                  <button
                    type="button"
                    onClick={onSubmit}
                    className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400 active:bg-rose-600/90 disabled:pointer-events-none disabled:opacity-50 md:hover:bg-rose-600/90"
                  >
                    {submitBtnText ?? "submit"}
                  </button>
                ) : null}
                {footerButtons}
              </div>,
            ]
          : null
      }
    >
      {children}
    </Modal>
  );
};

export default ModalComponent;
