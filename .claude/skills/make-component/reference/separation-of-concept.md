# 関心の分離

## 関数の引数は関数内のドメイン知識のみで完結すること

**Good**

関数の引数は内側から外側に向けてI/Fを作ること。

```ts
export interface CalculateAgeArguments = {
  year: number;
  month: number;
  day: number;
}

/** 年齢を計算する関数 */
export const calculateAge = (year: number, month: number; day: number): number => {
  return /** Implements */
}
```

**Bad**

```tsx
export interface User {
  year: number;
  month: number;
  day: number;
}

export interface CalculateAgeArguments = {
  user: User; // Bad: 「ユーザー」と言う言葉・ドメイン知識は年齢計算に不要である。
}

/** 年齢を計算する関数 */
export const calculateAge = ({ user }: CalculateAgeArguments): number => {
  return /** Implements */
}
```
