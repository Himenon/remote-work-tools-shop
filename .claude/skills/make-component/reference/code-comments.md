# コードコメントの書き方

## プロパティ名から自明なことは書かない

### イベントハンドラーの場合

**Bad**

```tsx
export interface Button {
  /** ボタンがクリックされたときに呼び出されるコールバック関数 */
  onClick: () => void;
}
```

**Good**

```tsx
export interface Button {
  onClick: () => void;
}
```

### Propsの場合

**Bad**

```tsx
export interface AwesomeSection {
  /** DescriptionのProps */
  description: DescriptionProps;
}
```

**Good**

```tsx
export interface AwesomeSection {
  description: DescriptionProps;
}
```

### 構造から推測できる場合

**Bad**

```tsx
export interface Notification {
  user: {
    /** ユーザー名 */
    name: string;
  };
}
```

**Good**

```tsx
export interface Notification {
  /** 現在ログインしているユーザー */
  user: {
    name: string;
  };
}
```

## プロパティがOptionalになる理由を明示的に書く

**Good**

```tsx
export interface AwesomeSection {
  /** 詳細ページでは更新ボタンの表示を消すことがあるため、Optionalを許容する */
  updateButton?: Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;
}
```

## 1行で終わるコードコメントは複数行展開しない

**Bad**

```tsx
export interface AwesomeSection {
  /**
   * 詳細
   */
  description: string;
}
```

**Good**

```tsx
export interface AwesomeSection {
  /** 詳細 */
  description: string;
}
```

## チェックリスト

- [ ] プロパティ名から自明なことは書かない - イベントハンドラの場合
- [ ] プロパティ名から自明なことは書かない - Propsの場合
- [ ] プロパティ名から自明なことは書かない - 構造から推測できるの場合
- [ ] プロパティがOptionalになる理由を明示的に書く
- [ ] 1行で終わるコードコメントは複数行展開しない
