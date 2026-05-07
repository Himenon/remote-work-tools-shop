"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export interface CheckoutButtonProps {
  disabled: boolean;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({ disabled }) => {
  const router = useRouter();
  const [processing, setProcessing] = useState(false);

  const handleClick = async (): Promise<void> => {
    setProcessing(true);
    await fetch("/api/checkout", { method: "POST" });
    setProcessing(false);
    router.push("/");
  };

  const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    type: "button",
    disabled: disabled || processing,
    onClick: handleClick,
    className:
      "w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50",
  };

  return <button {...buttonProps}>{processing ? "決済処理中..." : "決済を確定する"}</button>;
};

CheckoutButton.displayName = "CheckoutButton";
