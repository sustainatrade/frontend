import { useEffect, useContext } from "react";
import { Context as LayoutContext } from "../contexts/LayoutContext";

export function useSetSubHeader(content, options = { hideBackButton: false }) {
  const { showSubHeader, subHeader, setHideBackButton } = useContext(
    LayoutContext
  );

  useEffect(
    () => {
      setHideBackButton(options.hideBackButton);
    },
    [options.hideBackButton]
  );

  useEffect(
    () => {
      showSubHeader(content);
    },
    [content !== subHeader]
  );
}
