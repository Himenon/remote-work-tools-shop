# コンポーネントの実装パターン

## React Componentの実装テンプレート

Reactのコンポーネント名を`${Component}`としたとき、次のようなテンプレートコードの記法を守ります。
ファイル名: `${Component}/index.tsx`または`${Component}.tsx`のどちらかを利用することができます。

```tsx
import React from "react";
import { ChildComponent, type ChildComponentProps } from "./ChildComponent";

export interface ${Component}Props {};

// ${Component}Props と ${Component} の宣言の間は何も入れないこと

export const ${Component}: React.FC<${Component}Props> = (props) => {
  const childComponentProps: ChildComponentProps = {
    // propsから組み立てる
  };
  // returnで表現するComponentはContainer/Presentationalパターンで実装され、Containerのロジックが含まれないこと
  return <ChildComponent {...childComponentProps} />;
};
```

**Propsが省略可能な場合**

Propsの宣言が不要な場合は次のように省略することができます。

```tsx
import React from "react";
import { ChildComponent, type ChildComponentProps } from "./ChildComponent";

export const ${Component} = () => {
  const childComponentProps: ChildComponentProps = {};
  return <ChildComponent {...childComponentProps} />;
};
```

## 子コンポーネントのPropsの宣言

`ParentComponent`に於いて、`ChildComponent`を利用する場合、`ChildComponentProps`のcamelCaseで変数を宣言し、Spraed Operatorで`ChildComponent`に対してPropsを渡します。

```tsx
import React from "react";
import { ChildComponent, type ChildComponentProps } from "./ChildComponent";

export const ParentComponent = () => {
  const childComponentProps: ChildComponentProps = {};
  return <ChildComponent {...childComponentProps} />;
};
```

**Bad**

propsをバケツリレーの途中で加工せずに渡す場合はコンポーネント化が不要である。

```tsx
export interface ChildButtonProps {
  button: ButtonProps;
}

export const ChildButton: React.FC<ParentProps> = (props) => {
  const buttonProps: ChildProps = {
    ...props.button, // 禁止: ただ渡すだけになっているため
  };
  return <button {...props.button} />;
};
```

```tsx
export interface ParentProps {
  childButton: ChildButtonProps; // 利用する型定義はtypeofの推論を利用せず、型定義をimportして利用すること
}

export const Parent: React.FC<ParentProps> = (props) => {
  const childButtonProps: ChildButtonProps = {
    ...props.childButton, // 禁止: ただ渡すだけになっているため
  };
  return (
    <div>
      <ChildButton {...childButtonProps} />;
    </div>
  );
};
```

**Improve**

コンポーネントとして表現するのではなく、変数でコンポーネント名を表現する。

- `ChildButton`を宣言せずに`childButtonProps`として受け取る。

```tsx
export interface ParentProps {
  childButton: ButtonProps; // 利用する型定義はtypeofの推論を利用せず、型定義をimportして利用すること
}

export const Parent: React.FC<ParentProps> = (props) => {
  const childButtonProps: ButtonProps = {
    ...props.childButton,
  };
  return (
    <div>
      <button {...childButtonProps} />;
    </div>
  );
};
```

## 子コンポーネントのPropsの型定義は`typeof`を利用せず型定義を直接利用する

**Bad**

```tsx
import { ChildButton } from "./ChildComponent";

export interface ParentProps {
  childButton: React.ComponentProps<typeof ChildButton>;
}

export const Parent: React.FC<ParentProps> = () => {
  const childButtonProps: React.ComponentProps<typeof ChildButton> = {
    ...props.childButton,
    className: "sample",
  };
  return (
    <div>
      <ChildButton {...childButtonProps} />;
    </div>
  );
};
```

**Good**

```tsx
import { ChildButton, type ChildButtonProps } from "./ChildComponent";

export interface ParentProps {
  childButton: ChildButtonProps;
}

export const Parent: React.FC<ParentProps> = () => {
  const childButtonProps: ChildButtonProps = {
    ...props.childButton,
    className: "sample",
  };
  return (
    <div>
      <ChildButton {...childButtonProps} />;
    </div>
  );
};
```

## Componentの返り値はContainer/Presentationalパターンを意識してPresentational Componentのみを返すようにする

**Good**

ReactのComponentはContainer/Presentationalパターンで実装され、Presentational Componentは単純なコンポーネントを返す。

```tsx
export const AwesomeSection: React.FC<AwesomeSectionProps> = (props) => {
  const childComponentProps: ChildComponentProps = {
    title: "Title",
    body: props.condition ? "Good" : "Bad",
  };
  return <ChildComponent {...childComponentProps} />;
};
```

**Bad**

Componentの宣言に直接値を渡す記述はしてはいけません。

```tsx
export const AwesomeSection: React.FC<AwesomeSectionProps> = (props) => {
  return <ChildComponent title="Title" body={props.condition ? "Good" : "Bad"} />;
};
```

## 1ファイル中に宣言可能なPropsのInterfaceは1ファイルになるようにファイル分割をする

**Good**

`CustomParagraph`はpropsを持たないため、同じファイルに宣言することができます。

```tsx
const CustomParagraph = () => {
  return <p style={{ fontWeight: "bold" }}>some text...</p>;
};

export interface AwesomeSectioinProps {
  title: string;
}

export const AwesomeSection: React.FC<AwesomeSectioinProps> = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <CustomParagraph />
    </div>
  );
};
```

**Bad**

`CustomParagraph`は`CustomParagraphProps`のI/Fを宣言するため、ファイル分割しなければなりません。

```tsx
interface CustomParagraphProps {
  kind: "bold" | "normal";
}

const CustomParagraph: React.FC<CustomParagraphProps> = (props) => {
  return <p style={{ fontWeight: props.kind === "bold" ? "bold" : "normal" }}>{props.children}</p>;
};

export interface AwesomeSectioinProps {
  title: string;
}

export const AwesomeSection: React.FC<AwesomeSectioinProps> = (props) => {
  const customParagraphProps: CustomParagraphProps = {
    kind: "bold",
  };
  return (
    <div>
      <h1>{props.title}</h1>
      <CustomParagraph {...customParagraphProps}>Some text...</CustomParagraph>
    </div>
  );
};
```

**修正方法**

```tsx
// CustomParagraph.tsx
export interface CustomParagraphProps {
  kind: "bold" | "normal";
}

const CustomParagraph: React.FC<CustomParagraphProps> = (props) => {
  return <p style={{ fontWeight: props.kind === "bold" ? "bold" : "normal" }}>{props.children}</p>;
};
```

```tsx
// AwesomeSection.tsx
import { CustomParagraph, type CustomParagraphProps } from "./CustomParagraph";

export interface AwesomeSectioinProps {
  title: string;
}

export const AwesomeSection: React.FC<AwesomeSectioinProps> = (props) => {
  const customParagraphProps: CustomParagraphProps = {
    kind: "bold",
  };
  return (
    <div>
      <h1>{props.title}</h1>
      <CustomParagraph {...customParagraphProps}>Some text...</CustomParagraph>
    </div>
  );
};
```

## チェックリスト

- [ ] コンポーネントとPropsの命名規則が守れていること
- [ ] 1ファイル中に宣言可能なPropsのI/Fは1ファイルになるようにファイル分割をする
- [ ] 単純なPropsのバケツリーレとなっているコンポーネントが存在しないこと
- [ ] PropsのOptionalを利用したコンポーネントの表示・非表示が表現されていること
