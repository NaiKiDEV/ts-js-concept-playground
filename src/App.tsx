import { createStore, useStore } from "./store";
import "./App.css";
import {
  invokeSyncAction,
  isNone,
  isSome,
  unwrapError,
  unwrapValue,
} from "./language-break";

type TestState = {
  test: number;
  optional?: string;
};

type TestActions = {
  test: () => void;
  setSomething: (value: number) => void;
};

const defaultState: TestState = {
  test: 123,
};

const store = createStore<TestState, TestActions>((get, set) => ({
  test: () => console.log(get()),
  setSomething: (value: number) => {
    set({ test: value });
  },
}))(defaultState);

// store.test();
// store.setSomething(456);
// store.test();

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }

  test() {
    console.log("Test");
  }
}
let test = false;

const result = invokeSyncAction<never, CustomError>(() => {
  throw new CustomError("Custom Error");
  // throw new Error("Error");
});

const positiveResult = invokeSyncAction(() => {
  return {
    name: "John",
  };
});

if (isNone(result)) {
  if (result.error instanceof CustomError) {
    console.error(result.error.test());
  }
  console.error(unwrapError(result));
}

// This throws!
// unwrapValue(result);

if (isSome(positiveResult)) {
  console.log(positiveResult.value);

  const value = unwrapValue(positiveResult);
  console.log(value);
}

const App = () => {
  const { test } = useStore(store);

  return (
    <div className="content">
      <div>
        <p>State: {test}</p>
        <button type="button" onClick={() => store.setSomething(test + 1)}>
          Set Value
        </button>
      </div>
    </div>
  );
};

export default App;
