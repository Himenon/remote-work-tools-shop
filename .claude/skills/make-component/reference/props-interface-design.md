# PropsのI/F設計

## 1. 動作が排他的なコンポーネントの線形結合で表現されるコンポーネントのPropsの設計

Propsを定義する場合、Propsを必要とする`子コンポーネント`の名前をPropsのProperty名として宣言し、`子コンポーネント`のPropsからPickまたはOmitした型定義を宣言してください。
これにより、露出するPropsが変化した場合にOmit, Pickの対象を変化する最小限の変更に留めることができます。

**Good**

```tsx
import React from "react";

export interface ActionAreaProps {
  addButton: Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
  cancelButton: Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
}

export const ActionArea: React.FC<ActionAreaProps> = ({ addButton, cancelButton }) => {
  const addButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...addButton,
    children: "Add",
  };
  const cancelButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...cancelButton,
    children: "Cancel",
  };
  return (
    <div>
      <button {...cancelButtonProps} />
      <button {...addButtonProps} />
    </div>
  );
};
```

**Bad**

```tsx
import React from "react";

export interface ActionAreaProps {
  addButtonOnClick: () => void; // addButtonに必要なPropsが変化したときに壊れる
  cancelButton: {
    onClick: () => void; // onClickの引数が必要な場合に変更が必要になる
  };
}

export const ActionArea: React.FC<ActionAreaProps> = (props) => {
  const cancelButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...props.cancelButton,
    children: "Cancel",
  };
  return (
    <div>
      {/* onClick以外のPropsが必要となった場合に、不必要なJSXの変更が発生する */}
      <button onClick={props.addButtonOnClick}>Add</button>
      <button {...addButtonProps} />
    </div>
  );
};
```

## 2. コンポーネントとして集約される子コンポーネント群が1次独立の線形結合ではないコンポーネントの組み合わせのPropsの設計

**Good**

```tsx
import React from "react";

export interface RadioItemProps {
  id: string;
  name: string;
  value: string;
  label: string;
}

export const RadioItem: React.FC<RadioItemProps> = (props) => {
  const inputProps: React.InputHTMLAttributes<HTMLInputElement> = {
    type: "radio",
    id: props.id,
    name: props.name,
    value: props.value,
  };
  const labelProps: React.LabelHTMLAttributes<HTMLLabelElement> = {
    htmlFor: props.id, // 動作のためにinputとidが同じ必要がある
    children: props.label,
  };
  return (
    <div>
      <input {...inputProps} />
      <label {...labelProps} />
    </div>
  );
};
```

## 3. 仕様上明らかに用途が限定されているコンポーネントのPropsの設計

仕様が明らかで拡張性が不要な場合は簡易化したPropsを定義して良い。
ただし、Propsの各フィールドにはその用途を明確にコメントで表現すること。

```tsx
import React from "react";
import { RadioItem, type RadioItemProps } from "./RadioItem";

export interface RadioFieldProps {
  // Good
  title: string;
  // Bad: 拡張が不要と判断されるPropsは不必要に抽象度の高い型定義を利用しない。ただし、開発者の判断に委ねる
  // legend: Pick<React.HTMLAttributes<HTMLLegendElement>, "children">;
  items: RadioItem[];
}

export const RadioField: React.FC<RadioFieldProps> = (props) => {
  return (
    <fieldset>
      <legend>{props.title}</legend>
      {/*
        <legend {...props.legend} />
      */}
      {props.items.map((item) => (
        <RadioItem key={item.id} {...item} />
      ))}
    </fieldset>
  );
};
```

## 4. コンポーネント名とPropsのプロパティ名が連続しないように命名する

**Bad**

```tsx
export interface CustomButtonProps {
  button: ButtonProps;
}

export const CustomButton: React.FC<CustomButtonProps> = (props) => {
  return <button {...props.button} />;
};
```

利用する親コンポーネントでのPropsが

```tsx
const customButtonProps: CustomButtonProps {
  button: { /**...*/ }, // customButtonProps.button と連続した表現になることを禁止する
}
```

**Good**

利用するコンポーネントのPropsで表現する。

```tsx
export interface Parent {
  customButton: ButtonProps;
}

export const CustomButton: React.FC<CustomButton> = (props) => {
  return (
    <div>
      {/* button.button のといった連続した命名規則にならない */}
      <button {...props.customButton} />
    </div>
  );
};
```

## PropsのOptionalを利用したコンポーネントの表示・非表示の表現

Propsに子コンポーネントのPropsが利用されている場合、そのプロパティの有無で子コンポーネントの表示・非表示を制御すること。

```tsx
interface AwesomeSection {
  description?: DescriptionProps;
}
```

**Good 1**

```tsx
export const AwesomeSection: React.FC<AwesomeSection> = (props) => {
  return <section>{props.description && <Description {...props.description} />}</section>;
};
```

**Good 2**

```tsx
export const AwesomeSection: React.FC<AwesomeSection> = (props) => {
  const descriptionProps = useMemo((): DescrptionProps | undefined => {
    if (!props.description) {
      return undefined;
    }
    return {
      ...props.description,
      // 固定の値を合成する
    };
  }, []);
  return <section>{descriptionProps && <Description {...descriptionProps} />}</section>;
};
```

## 不必要にBoolean利用せずLiteral Typeで表現する

**Bad**

```tsx
export interface TabProps {
  showTabA: boolean;
}
```

**Good**

```tsx
export interface TabProps {
  defaultShowingTab: "tabA" | "tabB";
}
```

## OptionalのBooleanのPropsを定義しない

**Bad**

理由: 開発者が`undefined`の場合の振る舞いがI/Fを通して推測できないため。

```tsx
export interface DialogProps {
  open?: boolean;
}
```

**Best**

仕様の存在する実装の場合はその振る舞いは確定しているため、`required`で表現することができます。

```tsx
export interface DialogProps {
  open: boolean;
}
```

**Good**

ライブラリや抽象度の高いコンポーネントを実装するときだけ、デフォルト値をコメントで示すことにより利用することができます。

```tsx
export interface DialogProps {
  /**
   * @default false
   */
  open?: boolean;
}
```
