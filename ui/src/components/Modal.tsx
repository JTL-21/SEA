import { Dialog } from "@headlessui/react";
import ModalOverlay from "./ModelOverlay";
import React from "react";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface ModalProps {
  open: boolean;
  title?: React.ReactNode;
  children?: React.ReactNode;
  onClose: () => void;
}

const Modal = ({ open, title, children, onClose }: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 grid place-content-center p-2"
    >
      <ModalOverlay />

      <Dialog.Panel
        as="div"
        className="ring-border relative flex min-h-[500px] w-[90vw] max-w-[1200px] flex-col rounded-md bg-white text-gray-600 shadow-2xl"
      >
        <div className="flex items-stretch gap-2 border-b-[1px] pl-4 text-2xl">
          {title}
          <div className="ml-auto aspect-square border-l-[1px]">
            <button
              className="grid h-full w-full place-content-center rounded-tr-md bg-white p-2 hover:bg-gray-100"
              onClick={onClose}
            >
              <XMarkIcon className="h-10 w-10" />
            </button>
          </div>
        </div>
        {children}
      </Dialog.Panel>
    </Dialog>
  );
};

export default Modal;
