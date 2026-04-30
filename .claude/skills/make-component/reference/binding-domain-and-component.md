# ドメインをコンポーネントと結合

## Button, Paragraph, Linkがドメインの情報を持つコンポーネントの命名規則

次のようなケースのコンポーネントの命名規則を与えます。

- Button, Paragraph, Linkコンポーネントにおいて、表示されるテキストがドメイン固有の情報を含む
- イベントハンドラの登録が要求される

例えば、

```tsx
<button onClick={}>最新情報</button>
```

の場合、`最新情報`を英語化（`LatestInfo`）し、アッパーキャメルケースで利用するコンポーネント名（`Button`）と結合する。

```tsx
type LatestIntoButtonProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

const LatestInfoButton: React.FC<LatestInfoButtonProps> = (props) => {
  const buttonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
    ...props,
    children: "最新情報",
  };
  return <button {...buttonProps} />;
};
```
