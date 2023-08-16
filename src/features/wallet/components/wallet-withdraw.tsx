import { Button } from "@/components/ui";
import { useTranslation } from "react-i18next";
// import { Portal } from "@radix-ui/react-dialog";
// import { useCallback, useState } from "react";
// import { useForm } from "react-hook-form";
// import * as Dialog from '@radix-ui/react-dialog';
// import { Cross2Icon } from '@radix-ui/react-icons';



type WalletWithdrawProps = {
  balance?: number;
};

const WalletWithdraw = (props: WalletWithdrawProps) => {
  const { t } = useTranslation();

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

  return (
    <>
      <Button
        className="Button violet w-full text-sm bg-primary hover:bg-primary-hover xs:hover:bg-primary-hover sm:hover:bg-primary-hover md:hover:bg-primary-hover px-3 py-2 my-2"
        // onClick={() => setIsWithdrawModalOpen(true)}
      >
        {t("wallet:transactions.withdraw")}
      </Button>

      
      {/* <Portal portalName="modalRoot">
        <Popup
          id="withdraw-popup"
          visible={isWithdrawModalOpen}
          onVisibleChange={setIsWithdrawModalOpen}
        >
          <Popup.Header title={t("transactions.withdraw_form")} />
          <Popup.Content>
            <Form methods={form} onFinish={onSubmitHandler}>
              <Form.Item label={t("sum")} name="amount">
                <InputNumber />
              </Form.Item>
              <div className="justify-content-end d-flex align-items-center space-x-2">
                <Button
                  className="me-2"
                  type="outline"
                  size="sm"
                  onClick={() => setIsWithdrawModalOpen(false)}
                >
                  {t("cancel")}
                </Button>

                <Confirm
                  content={t("transactions.withdraw_confirmation")}
                  // onConfirm={form.handleSubmit(onSubmitHandler)}
                  isAsync
                >
                  <Button size="sm">{t("apply")}</Button>
                </Confirm>
              </div>
            </Form>
          </Popup.Content>
        </Popup>
      </Portal> */}
    </>
  );
};

export default WalletWithdraw;
