import { useLayoutEffect } from "react";
import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

interface SetFormErrorOnMountProps {
  name: string;
  message: string;
  children: ReactNode;
}

/**
 * FormProvider 内でマウント直後にフォームエラーをセットするラッパーコンポーネント。
 *
 * 子コンポーネントを包む形で使うことで、React のレイアウトエフェクト実行順（子→親）を利用する。
 * 子 (CheckboxField 等) の useController が useLayoutEffect でサブスクライブした後に、
 * 親であるこのコンポーネントの useLayoutEffect が実行されるため、
 * setError の通知がサブスクライバーに確実に届く。
 */
export function SetFormErrorOnMount({ name, message, children }: SetFormErrorOnMountProps) {
  const { setError } = useFormContext();
  useLayoutEffect(() => {
    setError(name, { type: "manual", message });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>{children}</>;
}
