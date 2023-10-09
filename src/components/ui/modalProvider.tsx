import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

export interface IModalContext {
  isModalOpen: boolean;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const useModalComponentContext = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  return {
    isModalOpen,
    setIsModalOpen,
    toggleModal,
  };
};

const ModalContext = createContext({} as ReturnType<typeof useModalComponentContext>);

export const ModalContextProvider = ({ children }: any) => {
  return (
    <ModalContext.Provider value={useModalComponentContext()}>{children}</ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
