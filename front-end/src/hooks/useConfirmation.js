import { useCallback, useRef, useState } from "react";

export const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState({
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    confirmColor: "#d33",
    cancelColor: "#3085d6",
  });
  const resolveRef = useRef(null);

  const confirm = useCallback((config) => {
    setIsOpen(true);
    setConfig({
      title: config.title || "Are you sure?",
      message: config.message || "",
      confirmText: config.confirmText || "Confirm",
      cancelText: config.cancelText || "Cancel",
      confirmColor: config.confirmColor || "#d33",
      cancelColor: config.cancelColor || "#3085d6",
    });
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  const handleConfirm = useCallback(() => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current(true);
      resolveRef.current = null;
    }
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
    if (resolveRef.current) {
      resolveRef.current(false);
      resolveRef.current = null;
    }
  }, []);

  return {
    confirm,
    confirmationProps: {
      isOpen,
      onConfirm: handleConfirm,
      onCancel: handleCancel,
      ...config,
    },
  };
};