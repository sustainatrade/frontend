import React, { useContext, useRef, useState, useEffect } from "react";
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
      {edges.map((edge, ii) => {
        let edgeY = EDGE_OFFSET + edge.offsetY;
        const border = {
          borderLeftColor: "gainsboro",
          borderLeftStyle: "dashed"
        };
        // if (edge)
        const nextEdge = get(edges, [ii + 1]);
        if (nextEdge) {
          console.log("nextEdge"); //TRACE
          console.log(edge, nextEdge); //TRACE
          if (nextEdge.parentRefNo === edge.refNo) {
            border.borderLeftColor = "darkblue";
            border.borderLeftStyle = "solid";
          } else if (nextEdge.parentRefNo === edge.parentRefNo) {
            border.borderLeftColor = "gainsboro";
            border.borderLeftStyle = "solid";
          }
        }
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
  const ctrlRef = useRef(null);
  let edges = [];

  const ctrlOffsetY = contentStyle.paddingTop;
  postStack.map(postObj => {
    const curEl = get(postObj, "ref.current");
    const { y: offsetTop } = curEl.getBoundingClientRect();
    // console.log("mount parents", parentEl, parentEl.parentElement);
    offsetTop &&
      edges.push({
        id: postObj.id,
        refNo: postObj.post._refNo,
        parentRefNo: postObj.post.parentPostRefNo,
        offsetY: offsetTop - contentStyle.paddingTop
      });
  });
  edges = edges.sort((e1, e2) => e1.offsetY - e2.offsetY);
  return (
    <div ref={ctrlRef} className="icon-scroller" style={{ height, width }}>
      <Edges edges={edges} />
      {edges.map((edge, i) => {
        let iconTop = EDGE_OFFSET + edge.offsetY;
        if (iconTop < ctrlOffsetY) {
          iconTop = ctrlOffsetY;
        }
        return (
          <Button
            key={edge.id}
            shape="circle"
            size="large"
            className="icon-button"
            style={{ top: iconTop }}
            title={edge.id}
          >
            <Icon type="up-circle" theme="outlined" />
          </Button>
        );
      })}
    </div>
  );
}
