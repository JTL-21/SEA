import { Dialog } from "@headlessui/react";
import cn from "clsx";

interface ModalOverlayProps {
  opaque?: boolean;
}

const ModalOverlay = ({ opaque }: ModalOverlayProps) => (
  <Dialog.Overlay
    className={cn(
      "fixed inset-0",
      opaque ? "bg-white" : "bg-gray-700 bg-opacity-50"
    )}
  />
);

export default ModalOverlay;
