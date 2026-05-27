# Factoryコンポーネントのお作法

## FactoryコンポーネントのPropsは判別可能なUnion Typeで表現する

\*_Bad_

```tsx
export interface Square {
  size: number;
}

export interface Circle {
  radius: number;
}

export type Shape = Square | Circle;

export const ShapeFactory: React.FC<{ shape: Shape }> = ({ shape }) => {
  if ("size" in shape) {
    return <div>正方形</div>;
  } else if ("radius" in shape) {
    return <div>円</div>;
  }
  return null;
};
```

**Good**

```tsx
export interface Square {
  kind: "square";
  size: number;
}

export interface Circle {
  kind: "circle";
  radius: number;
}

export type Shape = Square | Circle;

export const ShapeFactory: React.FC<{ shape: Shape }> = ({ shape }) => {
  switch (shape.kind) {
    case "square": {
      const { kind, ...rest } = shape;
      return <Square {...rest} />;
    }
    case "circle": {
      const { kind, ...rest } = shape;
      return <Circle {...rest} />;
    }
    default:
      return null;
  }
};
```

## Factoryコンポーネントで生成するコンポーネントにPropsを渡すときはI/Fを明示する

**Bad**

```tsx
export const ShapeFactory: React.FC<{ shape: Shape }> = ({ shape }) => {
  switch (shape.kind) {
    case "square": {
      const squareProps = {
        /** etc... */
      };
      return <Square {...squareProps} />;
    }
    case "circle": {
      const circleProps = {
        /** etc */
      };
      return <Circle {...circleProps} />;
    }
    default:
      return null;
  }
};
```

**Good**

```tsx
export const ShapeFactory: React.FC<{ shape: Shape }> = ({ shape }) => {
  switch (shape.kind) {
    case "square": {
      const squareProps: SquareProps = {
        /** etc... */
      };
      return <Square {...squareProps} />;
    }
    case "circle": {
      const circleProps: CircleProps = {
        /** etc */
      };
      return <Circle {...circleProps} />;
    }
    default:
      return null;
  }
};
```
