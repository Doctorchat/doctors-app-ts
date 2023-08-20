import {
  Button,
  Dialog,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui";
import { DialogClose, DialogContent, DialogPortal } from "@radix-ui/react-dialog";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useState } from "react";
import WalletWithdrawForm from "./wallet-withdraw-form";
// import { Portal } from "@radix-ui/react-dialog";
// import { useCallback, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as Dialog from '@radix-ui/react-dialog';
// import { Cross2Icon } from '@radix-ui/react-icons';

import React from "react";
import { cn } from "@/utils";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/features/auth";
import { set } from "date-fns";



type WalletWithdrawProps = {
  balance?: number;
};

const WalletWithdraw = (props: WalletWithdrawProps) => {
  const { t } = useTranslation();

  const [openModal, setOpenModal] = useState(false);
  const [isConfirmation, setIsConfirmation] = useState(false);
  const onClickConfirm = () => setIsConfirmation(true);

  // const { balance } = props;

  // const form = useForm({
  //   resolver: useYupValidationResolver(
  //     yup.object().shape({
  //       amount: yup.number().min(100).max(Number(balance)).required(),
  //     })
  //   ),
  // });
  // const queryClient = useQueryClient();
  // const dispatch = useDispatch();

  // const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // const onSubmitHandler = useCallback(
  //   async (values) => {
  //     try {
  //       await api.wallet.withdrawn(values);
  //       setIsWithdrawModalOpen(false);
  //       queryClient.invalidateQueries(["wallet"]);
  //       queryClient.invalidateQueries(["wallet-transactions"]);
  //       dispatch(notification({ title: "success", descrp: "transactions.withdraw_success" }));
  //     } catch (error) {
  //       dispatch(
  //         notification({ type: "error", title: "error", descrp: getApiErrorMessages(error, true) })
  //       );
  //     }
  //   },
  //   [dispatch, queryClient]
  // );

  const schema = z.object({
    amount:
      z.string()
        .refine((value: any) => parseInt(value, 10) >= 100, {
          message: t("common:zod_number_min", { min: 100 }),
        }),
  });

  type FormValues = z.infer<typeof schema>;

  const form = useForm<FormValues>({
    defaultValues: {
      amount: "100",
    },
    resolver: zodResolver(schema),
  });

  const onSubmitTestIsSubmitting = (values: FormValues) => {
    console.log(values);
  };

  const onConfirm = () => {
    setIsConfirmation(false);
    if (form.formState.isValid) {
      // If form is valid, open the confirmation dialog
      console.log("form.formState.isValid", form.formState.isValid);
      
      setIsConfirmation(true);
    } else {
      console.log("form.formState.isValid2", form.formState.isValid);
      // Otherwise, trigger a validation (this will show validation errors on the form)
      form.trigger();
    }
  };

  return (
    <>
      <Dialog
        open={openModal}
        onOpenChange={setOpenModal}
      >
        <DialogTrigger
          asChild>
          <Button
            className="w-full text-sm bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-2 py-1 my-2"
          >
            {t("wallet:transactions.withdraw")}
          </Button>
        </DialogTrigger>
        <DialogPortal>
          <DialogContent
            className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
          >
            <DialogTitle className="text-mauve12 mb-2 text-[17px] font-medium text-typography-primary">
              {t("wallet:transactions.withdraw_form")}
            </DialogTitle>
            <WalletWithdrawForm
              form={form}
              isConfirmation={isConfirmation}
              setConfirm={setIsConfirmation}
            />
            <div className="mt-[25px] flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  className="text-gray-800 inline-flex items-center justify-center rounded-[4px] px-4 font-medium leading-none focus:outline-none bg-white hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover hover:text-white border-2 border-solid border-blue-600">
                  {t("common:cancel")}
                </Button>
              </DialogClose>

              {/* Dialog Confirm */}
              <AlertDialog.Root>
                {/* <AlertDialog.Trigger asChild> */}
                  <Button
                    onClick={onConfirm}
                    className="text-white inline-flex items-center justify-center rounded-[4px] px-4 font-medium leading-none focus:shadow-[0_0_0_2px] focus:outline-none bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover">
                    {t("common:apply")}
                  </Button>
                {/* </AlertDialog.Trigger> */}
                <AlertDialog.Portal>
                  <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
                    <AlertDialog.Title className="text-gray-900 mb-2 text-[17px] font-medium">
                      {t("wallet:transactions.withdraw_confirmation")}
                    </AlertDialog.Title>
                    <div className="flex justify-end gap-[25px]">
                      <AlertDialog.Cancel
                        asChild
                      >
                        <button
                          className="text-primary hover:bg-blue-100 rounded-[4px] px-[15px] font-medium outline-none  focus:outline-0"
                          onClick={() => setOpenModal(false)}
                        >
                          {t("common:cancel")}
                        </button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action asChild>
                        <button
                          onClick={() => {
                            onClickConfirm();
                            form.handleSubmit(onSubmitTestIsSubmitting)(); // Trigger the submission
                          }}
                          className=" px-3 py-2 text-red-400 hover:bg-red-100 rounded-[4px] px-[15px] font-medium outline-none">
                          {t("common:confirm")}
                        </button>
                      </AlertDialog.Action>
                    </div>
                  </AlertDialog.Content>
                </AlertDialog.Portal>
              </AlertDialog.Root>
            </div>
            <DialogClose asChild>
              <button
                className="focus:shadow-blue-100 absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                aria-label="Close"
              >
                <XMarkIcon />
              </button>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};


export default WalletWithdraw;
