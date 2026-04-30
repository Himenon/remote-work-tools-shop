# コンポーネントに依存しない処理の分離

## Propsの宣言以外の処理は可能な限りコンポーネントの外側で定義する

Primitiveな引数を宣言するだけで、純粋なJavaScriptの関数として振る舞える関数はコンポーネント外側に定義し、単体テストができるようにexportで宣言すること。
また、コンポーネント外の関数に対しては本SKILLのルールは適用しなくて良い。

**Bad**

```tsx
export const AwesomeSection = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const generateName = () => {
    return `${lastName} ${firstName}`;
  };
  const displayName = generateName();
  return <p>{displayName}</p>;
};
```

**Good**

```tsx
export const generateName = (lastName: string, firstName: string): string => {
  return `${lastName} ${firstName}`;
};

export const AwesomeSection = () => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const displayName = generateName(lastName, firstName);
  return <p>{displayName}</p>;
};
```

## チェックリスト

- [ ] Primitiveな引数を取る関数として定義することでコンポーネント外に関数定義可能な実装は切り出すこと
- [ ] 関数内部の情報で引数のI/Fが定義されていること
