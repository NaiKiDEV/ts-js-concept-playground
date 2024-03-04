type Some<T> = { value: T };
type None<E extends Error> = { error: E | Error };

// TODO: Doesn't really work for functional programming
type OptionMethods = {
  //   unwrapValue: <T, E extends Error>(option: Option<T, E>) => T;
  //   unwrapError: <T, E extends Error>(
  //     option: Option<TemplateStringsArray, E>
  //   ) => E | Error;
  //   isSome: boolean;
  //   isNone: <T, E extends Error>(
  //     option: Partial<Option<T, E>>
  //   ) => option is None<E>;
};

type Option<T, E extends Error> = OptionMethods & (Some<T> | None<E>);

const unwrapValue = <T, E extends Error>(option: Option<T, E>): T => {
  if (!("value" in option)) {
    throw new Error("Option is None");
  }

  return option.value;
};

const unwrapError = <T, E extends Error>(option: Option<T, E>): E | Error => {
  if ("value" in option) {
    throw new Error("Option is Some");
  }

  return option.error;
};

const isSome = <T, E extends Error>(
  option: Partial<Option<T, E>>
): option is Some<T> => {
  return "value" in option;
};

const isNone = <T, E extends Error>(
  option: Partial<Option<T, E>>
): option is None<E> => {
  return "error" in option;
};

const optionMethods: OptionMethods = {
  //   unwrapValue,
  //   unwrapError,
  //   isSome,
  //   isNone,
};

const createOption = <T, E extends Error>(
  value: T | E | Error
): Option<T, E> => {
  if (
    value instanceof Error ||
    (typeof value === "object" &&
      value &&
      "message" in value &&
      "name" in value)
  ) {
    return {
      ...optionMethods,
      error: value as E,
    };
  }

  return {
    ...optionMethods,
    value,
  };
};

const invokeSyncAction = <T, E extends Error>(
  callback: () => T
): Option<T, E> => {
  try {
    const result = callback();

    return createOption<T, E>(result);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      "name" in Error
    ) {
      return createOption<T, E>(error as E);
    }

    return createOption<T, E>(
      new Error(`Illegal error thrown: ${typeof error} = '${error}'`)
    );
  }
};

const invokeAsyncAction = async <T, E extends Error>(
  callback: () => Promise<T>
): Promise<Option<T, E>> => {
  try {
    const result = await callback();

    return createOption<T, E>(result);
  } catch (error) {
    if (
      typeof error === "object" &&
      error &&
      "message" in error &&
      "name" in Error
    ) {
      return createOption<T, E>(error as E);
    }

    return createOption<T, E>(
      new Error(`Illegal error thrown: ${typeof error} = '${error}'`)
    );
  }
};

export {
  createOption,
  invokeSyncAction,
  invokeAsyncAction,
  isNone,
  isSome,
  unwrapError,
  unwrapValue,
};
export type { OptionMethods, Some, None, Option };
