import React, { PropsWithChildren } from "react";

interface IFocusModeContext {
  isFullscreen: boolean;
  isFocusMode: boolean;
  isFocusModeSet: boolean;
  setIsFocusMode: (isFocusMode: boolean) => void;
}

const FocusModeContext = React.createContext<IFocusModeContext>({
  isFullscreen: false,
  isFocusMode: false,
  isFocusModeSet: false,
  setIsFocusMode: () => {},
});

const storageKey = "focusMode";

export const useFocusMode = () => React.useContext(FocusModeContext);
export const FocusModeProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isFocusMode, setIsFocusMode] = React.useState(
    localStorage.getItem(storageKey) === "true"
  );

  React.useLayoutEffect(() => {
    const onSizeUpdate = () => {
      setIsFullscreen(window.screen.height === window.innerHeight);
    };
    window.addEventListener("resize", onSizeUpdate);
    onSizeUpdate();
    return () => window.removeEventListener("resize", onSizeUpdate);
  }, []);

  const setFocusMode = React.useCallback((value: boolean) => {
    setIsFocusMode(value);
    localStorage.setItem(storageKey, value.toString());
  }, []);

  return (
    <FocusModeContext.Provider
      value={{
        isFullscreen,
        isFocusMode: isFocusMode || isFullscreen,
        isFocusModeSet: isFocusMode,
        setIsFocusMode: setFocusMode,
      }}
    >
      {children}
    </FocusModeContext.Provider>
  );
};
