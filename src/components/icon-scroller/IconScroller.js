import React, { useContext } from "react";
import "./IconScroller.css";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import IconScrollerContext from "../../contexts/IconScrollerContext";

export default function IconScroller({ height, width }) {
  const {} = useContext(IconScrollerContext.Context);
  
  return (
    <div className="icon-scoller" style={{ height, width }}>
      <Button shape="circle" size="large">
        <Icon type="font-size" theme="outlined" />
      </Button>
    </div>
  );
}
