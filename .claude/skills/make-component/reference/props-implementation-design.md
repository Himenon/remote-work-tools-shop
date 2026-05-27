# Propsの実装方法

## `children`は変数に切り出さない

**Good**

```tsx
const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {};

<button {...buttonProps}>OK</button>;
```

**Bad**

```tsx
const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
  children: "OK",
};

<button {...buttonProps} />;
```

## コンポーネントのProps単位で条件分岐を表現する

- 条件分岐を含むPropsは`useMemo`と`if`文利用し、条件ごとにPropsを早期リターンする。
- 各`if`文にその条件の内容を日本語でコメントを残す。
- 条件分岐の表現で三項演算子を利用しない。

Propsの例は次のものとする。

```tsx
interface LinkOrButtonProps {
  href?: string;
  onClick?: () => void;
}
```

**Good**

`useMemo`と`if`文利用し、条件ごとにPropsを早期リターンすること。

```tsx
import { useMemo } from "react";
import { LinkOrButton, type LinkOrButtonProps } from "./LinkOrButton";

const Parent = () => {
  const linkOrButton: LinkOrButtonProps = useMemo((): LinkOrButtonProps => {
    /** conditionの詳細についてコメントを残す */
    if (condition) {
      return {
        href: "https://example.com"
      }
    }
    return {
      onClick?: () => console.log("Clicked"),
    };
  }, [condition]);
  return (
    <div>
      <LinkOrButton {...linkOrButton} />
    </div>
  )
}
```

**Bad**

Propsを実装する際に三項演算子が登場する場合は表現方法が間違っています。

```tsx
import { LinkOrButton, type LinkOrButtonProps } from "./LinkOrButton";

const Parent = () => {
  const linkOrButtonProps: LinkOrButtonProps = {
    href: condition ? "https://example.com" : undefined, // 禁止
    onClick: condition ? undefined : () => console.log("Clicked"), // 禁止
  };
  return (
    <div>
      <LinkOrButton {...linkOrButtonProps} />
    </div>
  );
};
```

## 複数の条件分岐が発生する、または階層が深くなる場合は場合は早期リターンを利用すること

**Bad**

Propsのそれぞれのプロパティに対して条件分岐を書いてはいけません。

```tsx
import { LinkOrButton, type LinkOrButtonProps } from "./LinkOrButton";

const Parent = () => {
  const linkOrButtonProps = useMemo((): LinkOrButtonProps | undefined => {
    /** XXXという条件ではないときはLinkOrButtonは表示しない */
    if !(condition1) {
      return;
    }
    /** YYYという条件ではリンクを表示する */
    if (condition2) {
      return {
        href: "https://example.com"
      }
    }
    /** ZZZという条件ではボタンを表示する */
    return {
      onClick?: () => console.log("Clicked"),
    };
  }, [condition1, condition2]);
  return (
    <div>
      {linkOrButtonProps && <LinkOrButton {...linkOrButtonProps} />}
    </div>
  )
}
```

## Propsを実装する際は一時変数を用意しない

**Bad**

```tsx
const handleClick = (): void => {
  /** Click時のイベント */
};

const buttonProps: ButtonProps = {
  onClick: handleClick,
};
```

**Good**

```tsx
const buttonProps: ButtonProps = {
  onClick: () => {
    /** Click時のイベント */
  },
};
```

## propsの変数は展開して利用する

Propsが以下のとき、

```tsx
export interface ActionAreaProps {
  addButton: Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
  cancelButton: Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
}
```

**Bad**

```tsx
export const ActionArea: React.FC<ActionAreaProps> = (props) => {
  const addButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...props.addButton,
    children: "Add",
  };
  const cancelButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...props.cancelButton,
    children: "Cancel",
  };
  /** 省略 */
};
```

**Good**

```tsx
export const ActionArea: React.FC<ActionAreaProps> = ({ addButton, cancelButton }) => {
  const addButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...addButton,
    children: "Add",
  };
  const cancelButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...cancelButton,
    children: "Cancel",
  };
  /** 省略 */
};
```

## チェックリスト

- [ ] `children`は変数に切り出さない
- [ ] コンポーネントのProps単位で条件分岐を表現する
- [ ] 複数の条件分岐が発生する、または階層が深くなる場合は場合は早期リターンを利用すること
- [ ] Propsを実装する際は一時変数を用意しない
- [ ] propsの変数は展開して利用する
