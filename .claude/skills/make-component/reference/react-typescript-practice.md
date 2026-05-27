# React内におけるTypeScriptの書き方Practice

## 同時に変化する値は1つのオブジェクトで管理し凝集性を高める

**Not Good**

```tsx
export interface AwesomeSectionProps {
  defaultOpenIndex: number; // 外部から見たらnumberは様々な値を指定できる
}

export const AwesomeSection: React.FC<AwesomeSectionProps> = (props) => {
  const [tabIndex, setTabIndex] = useState(props.defaultOpenIndex);
  const names = ["A", "B", "C"]; // tabIndexとnamesの関係がコード上に存在しない
  const tabsProps: TabsProps = {
    names: names,
    value: tabIndex,
    onChange: (_, newTabIndex) => {
      setTabIndex(newTabIndex);
    },
  };
  return (
    <div>
      <Tabs {...tabsProps} />
    </div>
  );
};
```

\*_Good_

```tsx
const TABS = {
  A: {
    name: "A",
    index: 0,
  },
  B: {
    name: "B",
    index: 1,
  },
  C: {
    name: "C",
    index: 2,
  },
} satisfies Record<string, { label: string; index: number }>;
type TabKey = keyof typeof TABS;

export interface AwesomeSectionProps {
  defaultTab: TabKey; // 外部から見たらどのタブを指定できるか一目瞭然となる
}

export const AwesomeSection: React.FC<AwesomeSectionProps> = (props) => {
  const [tabIndex, setTabIndex] = useState(TABS[props.defaultTab].index); // 内部で利用するstateに変換する
  const tabsProps: TabsProps = {
    names: Object.values(TABS).map((tab) => tab.name), // Tabの種類が増えても壊れる心配がない
    value: tabIndex,
    onChange: (_, newTabIndex) => {
      setTabIndex(newTabIndex);
    },
  };
  return (
    <div>
      <Tabs {...tabsProps} />
    </div>
  );
};
```
