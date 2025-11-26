import { createContext as createReactContext, useMemo, useContext as useReactContext } from 'react';

export type TProviderProps<ContextValue = object | null> = ContextValue & {
  children: React.ReactNode;
};

function createContext<ContextValue extends object | null>(
  rootComponentName: string,
  defaultValue?: ContextValue,
) {
  const Context = createReactContext<ContextValue | undefined>(defaultValue);

  function Provider({ children, ...props }: TProviderProps<ContextValue>) {
    // Use object values directly as dependencies instead of stringifying
    // This allows React to properly track changes including Sets, Maps, and functions
    const value = useMemo(
      () => props,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(props),
    ) as ContextValue;

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  Provider.displayName = `${rootComponentName}Provider`;

  function useContextValue() {
    const context = useReactContext(Context);

    if (context !== undefined) {
      return context;
    }

    if (defaultValue !== undefined) {
      return defaultValue;
    }

    throw new Error(`useContext must be used within \`${rootComponentName}Provider\`.`);
  }

  return [Provider, useContextValue] as const;
}

export default createContext;
