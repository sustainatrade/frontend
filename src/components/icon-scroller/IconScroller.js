import React, { useContext } from "react";
import "./IconScroller.css";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import PostStackContext from "../../contexts/PostStackContext";
import { useWindowScrollPosition } from "the-platform";
import get from "lodash/get";
import LayoutContext from "../../contexts/LayoutContext";

const ICON_HEIGHT = 40;

export default function IconScroller({ height, width }) {
  const { postStack } = useContext(PostStackContext.Context);
  const { y: scrollY } = useWindowScrollPosition();
  const { contentStyle } = useContext(LayoutContext.Context);

  const iconBtns = [];

  postStack.map(post => {
    const curEl = get(post, "ref.current");
    const { y: offsetTop } = curEl.getBoundingClientRect();
    // console.log("mount parents", parentEl, parentEl.parentElement);

    offsetTop &&
      iconBtns.push({
        id: post.id,
        offsetY: offsetTop - contentStyle.paddingTop
      });
  });
  return (
    <div className="icon-scoller" style={{ height, width }}>
      {iconBtns.map((iconBtn, i) => {
        const iconTop = iconBtn.offsetY - i * ICON_HEIGHT;
        return (
          <Button
            key={iconBtn.id}
            shape="circle"
            size="large"
            className="icon-button"
            style={{ top: iconTop }}
            title={iconBtn.id}
          >
            <Icon type="font-size" theme="outlined" />
          </Button>
        );
      })}
    </div>
  );
}
