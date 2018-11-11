import React, { useContext } from "react";
import "./IconScroller.css";
import Button from "antd/lib/button";
import Icon from "antd/lib/icon";
import PostStackContext from "../../contexts/PostStackContext";
import { useWindowScrollPosition } from "the-platform";
import get from "lodash/get";
import LayoutContext from "../../contexts/LayoutContext";

// const ICON_HEIGHT = 24;
const EDGE_OFFSET = 70;
function Edges({ edges }) {
  const defaultEdgeStyle = {
    borderLeftColor: "gainsboro",
    borderLeftStyle: "dashed",
    top: 0,
    bottom: 0
  };
  return (
    <>
      <div className="edge" style={defaultEdgeStyle} />
      {edges.map(edge => {
        const edgeY = EDGE_OFFSET + edge.offsetY;
        const border = {
          borderLeftColor: "gainsboro",
          borderLeftStyle: "solid"
        };
        return (
          <div
            key={edge.id}
            className="edge"
            style={{ height: edgeY, top: 0, ...border }}
          />
        );
      })}
    </>
  );
}

export default function IconScroller({ height, width }) {
  const { postStack } = useContext(PostStackContext.Context);
  const { y: scrollY } = useWindowScrollPosition();
  const { contentStyle } = useContext(LayoutContext.Context);

  const edges = [];

  postStack.map(post => {
    const curEl = get(post, "ref.current");
    const { y: offsetTop } = curEl.getBoundingClientRect();
    // console.log("mount parents", parentEl, parentEl.parentElement);

    offsetTop &&
      edges.push({
        id: post.id,
        parentId: post.parentPostRefNo,
        offsetY: offsetTop - contentStyle.paddingTop
      });
  });
  return (
    <div className="icon-scroller" style={{ height, width }}>
      <Edges edges={edges} />
      {edges.map((iconBtn, i) => {
        const iconTop = EDGE_OFFSET + iconBtn.offsetY;
        return (
          <Button
            key={iconBtn.id}
            shape="circle"
            size="large"
            className="icon-button"
            style={{ top: iconTop }}
            title={iconBtn.id}
          >
            <Icon type="up-circle" theme="outlined" />
          </Button>
        );
      })}
    </div>
  );
}
