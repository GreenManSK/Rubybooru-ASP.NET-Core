import React, { PropsWithChildren } from "react";

interface IFocusModeContext {
  isFullscreen: boolean;
  isFocusMode: boolean;
  setIsFocusMode: (isFocusMode: boolean) => void;
}

const FocusModeContext = React.createContext<IFocusModeContext>({
  isFullscreen: false,
  isFocusMode: false,
  setIsFocusMode: () => {},
});

export const useFocusMode = () => React.useContext(FocusModeContext);
export const FocusModeProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isFocusMode, setIsFocusMode] = React.useState(false);

  React.useLayoutEffect(() => {
    const onSizeUpdate = () => {
      setIsFullscreen(window.screen.height === window.innerHeight);
    };
    window.addEventListener("resize", onSizeUpdate);
    onSizeUpdate();
    return () => window.removeEventListener("resize", onSizeUpdate);
  }, []);

  return (
    <FocusModeContext.Provider
      value={{
        isFullscreen,
        isFocusMode: isFocusMode || isFullscreen,
        setIsFocusMode,
      }}
    >
      {children}
    </FocusModeContext.Provider>
  );
};
