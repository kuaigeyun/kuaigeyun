<img src="https://gw.alipayobjects.com/zos/antfincdn/R8sN%24GNdh6/language.svg" width="18"> [English](./README.md) | 简体中文

# zustand-utils

[![NPM version][npm-image]][npm-url] [![NPM downloads][download-image]][download-url] [![install size][npm-size]][npm-size-url]

[![Test CI status][test-ci]][test-ci-url] [![Deploy CI][release-ci]][release-ci-url] [![Coverage][coverage]][codecov-url]

[![ docs by dumi][dumi-url]](https://d.umijs.org/) [![Build With father][father-url]](https://github.com/umijs/father/)

<!-- gitpod url -->

[gitpod-badge]: https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod
[gitpod-url]: https://gitpod.io/#https://github.com/arvinxx/zustand-utils

<!-- umi url -->

[dumi-url]: https://img.shields.io/badge/docs%20by-dumi-blue
[father-url]: https://img.shields.io/badge/build%20with-father-028fe4.svg

<!-- npm url -->

[npm-image]: http://img.shields.io/npm/v/zustand-utils.svg?style=flat-square&color=deepgreen&label=latest
[npm-url]: http://npmjs.org/package/zustand-utils
[npm-size]: https://img.shields.io/bundlephobia/minzip/zustand-utils?color=deepgreen&label=gizpped%20size&style=flat-square
[npm-size-url]: https://packagephobia.com/result?p=zustand-utils

<!-- coverage -->

[coverage]: https://codecov.io/gh/arvinxx/zustand-utils/branch/master/graph/badge.svg
[codecov-url]: https://codecov.io/gh/arvinxx/zustand-utils/branch/master

<!-- Github CI -->

[test-ci]: https://github.com/arvinxx/zustand-utils/workflows/Test%20CI/badge.svg
[release-ci]: https://github.com/arvinxx/zustand-utils/workflows/Release%20CI/badge.svg
[test-ci-url]: https://github.com/arvinxx/zustand-utils/actions?query=workflow%3ATest%20CI
[release-ci-url]: https://github.com/arvinxx/zustand-utils/actions?query=workflow%3ARelease%20CI
[download-image]: https://img.shields.io/npm/dm/zustand-utils.svg?style=flat-square
[download-url]: https://npmjs.org/package/zustand-utils

## 简介

一些 zustand 的工具函数

### createContext

zustand v4 中废弃的 `createContext` 的替代方法。（详情： [#1276](https://github.com/pmndrs/zustand/discussions/1276)）

```tsx
import create from 'zustand'
import { createContext } from 'zustand-utils'

const { Provider, useStore } = createContext()

const createStore = () => create(...)

const App = () => (
  <Provider createStore={createStore}>
    ...
  </Provider>
)

const Component = () => {
  const state = useStore()
  const slice = useStore(selector)
  ...
```

## 典型用例

### createContext

#### createContext 在组件中的用法

> 出处： [zustand-v3-create-context.md](https://github.com/pmndrs/zustand/blob/b857d5e79f41e2e2c756448eca466ac31abdabc3/docs/previous-versions/zustand-v3-create-context.md)

```jsx
import create from 'zustand';
import { createContext } from 'zustand-utils';

// 最佳实践：你可以将下面的 createContext() 和 createStore 移动到一个单独的文件（store.js）中，并在需要的地方导入 Provider，useStore。
const { Provider, useStore } = createContext();

const createStore = () =>
  create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 }),
  }));

const Button = () => {
  return (
    // 每次使用 Button 组件都会创建自己的 store 实例，而不是所有组件使用同一个 store。
    <Provider createStore={createStore}>
      <ButtonChild />
    </Provider>
  );
};

const ButtonChild = () => {
  const state = useStore();
  return (
    <div>
      {state.bears}
      <button
        onClick={() => {
          state.increasePopulation();
        }}
      >
        +
      </button>
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <Button />
      <Button />
    </div>
  );
}
```

#### createContext 的初始化 props 用法

> 出处： [zustand-v3-create-context.md](https://github.com/pmndrs/zustand/blob/b857d5e79f41e2e2c756448eca466ac31abdabc3/docs/previous-versions/zustand-v3-create-context.md)

```tsx
import create from 'zustand';
import { createContext } from 'zustand-utils';

const { Provider, useStore } = createContext();

export default function App({ initialBears }) {
  return (
    <Provider
      createStore={() =>
        create((set) => ({
          bears: initialBears,
          increase: () => set((state) => ({ bears: state.bears + 1 })),
        }))
      }
    >
      <Button />
    </Provider>
  );
}
```

#### 使用 createContext 将应用转化为组件

`createContext` 最常见的用法是将应用程序重构为组件，步骤如下：

1. 创建一个没有 context 的 App store：

```ts
// store.ts
import create from 'zustand';

export const useStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
```

应用中的组件使用 `useStore` 来消费 store：

```tsx
// Component.ts

import { useStore } from './store';

const ButtonChild = () => {
  const state = useStore();
  return (
    <div>
      {state.bears}
      <button
        onClick={() => {
          state.increasePopulation();
        }}
      >
        +
      </button>
    </div>
  );
};
export default ButtonChild;
```

2. 只需要将 App 包裹在 `createContext` 中，不需要重构任何子组件中的代码，就可以将应用转为组件：

```diff
// store.ts
import create from "zustand";

+ const createStore = ()=> create((set) => ({
- export const useStore =  create((set) => ({
    bears: 0,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllBears: () => set({ bears: 0 })
  }));

+ const { Provider, useStore } = createContext();

+ export { Provider, useStore ,  createStore }
```

```tsx
// Wrapper.tsx

import { createStore, Provider } from './store';

const Wrapper = () => {
  return (
    <Provider createStore={createStore}>
      <ButtonChild />
    </Provider>
  );
};
```

这样它就变成了一个组件，可以被其他任何应用消费。

## createStoreUpdater

`createStoreUpdater` 是一个用于更新 Store 中指定 key 的值的函数。

### 参数

`createStoreUpdater` 接收一个 `StoreApi` 对象作为参数，该对象包含了一些操作 Store 的方法，如 `getState`、`setState`、`subscribe` 和 `destroy`。

`createStoreUpdater` 返回一个函数，该函数接收以下参数：

- `key`：需要更新的 Store 中的 key；
- `value`：需要更新的值；
- `deps`：依赖项数组，默认为 `[value]`；
- `setStoreState`：一个可选的回调函数，用于更新 Store 状态，默认为 `storeApi.setState`。

### 返回值

`createStoreUpdater` 返回一个函数，该函数用于更新 Store 中指定 key 的值。

### 示例

```typescript
import { createStoreUpdater } from 'path/to/createStoreUpdater';
import { useStore } from 'path/to/useStore';

interface User {
  name: string;
  age: number;
}

const storeApi = useStore<User>({ name: '', age: 0 });
const updateUser = createStoreUpdater(storeApi);

// 更新 name
updateUser('name', 'John Doe');

// 更新 age
updateUser('age', 18);
```

在上面的示例中，我们首先使用 `useStore` 创建了一个 Store，然后使用 `createStoreUpdater` 创建了一个更新器 `updateUser`，最后通过调用 `updateUser` 来更新 Store 中的 `name` 和 `age`。

## License

[MIT](./LICENSE)
