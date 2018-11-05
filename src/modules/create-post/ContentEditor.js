import React, { useMemo, useContext, useEffect, useState } from "react";
import {
  Button,
  Loader,
  Label,
  Visibility,
  Transition
} from "semantic-ui-react";
import Icon from "antd/lib/icon";
import Menu from "antd/lib/menu";
import AntButton from "antd/lib/button";
import Dropdown from "antd/lib/dropdown";
import "./ContentEditor.css";
import get from "lodash/get";
import debounce from "lodash/debounce";
import last from "lodash/last";
import { contents, MODES } from "./../../components/widgets";
import Tabs from "antd/lib/tabs";
import PostWidgetContext from "../../contexts/PostWidgetContext";
import { fromJS } from "immutable";
import nanoid from "nanoid";

const TabPane = Tabs.TabPane;

const WidgetEditor = React.memo(({ postRefNo, context }) => {
  const { currentContent, submitWidgetsFn, submitting } = context;

  if (!currentContent) return <Loader active inline="centered" />;

  const ContentComponent = contents[currentContent.code].component;
  const currentRefNo = get(currentContent, "_refNo");
  console.log("currentContent.values"); //TRACE
  console.log(typeof currentContent.values, currentContent.values); //TRACE
  return (
    <div>
      <ContentComponent
        mode={MODES.EDITOR}
        basic
        fitted
        _refNo={currentRefNo}
        postRefNo={postRefNo}
        defaultValues={currentContent.values}
        onValuesChanged={values => {
          // error.clear(PUBLISH_POST.key);
        }}
      >
        {() => <div />}
      </ContentComponent>
    </div>
  );
});

const WidgetSelector = ({ context }) => {
  const {
    currentContent,
    setCurrentContent,
    defaultContentCode,
    contentKeys
  } = context;

  const menu = (
    <Menu
      onClick={e => {
        const newCode = fromJS(currentContent)
          .set("code", e.key)
          .set("values", {})
          .toJS();
        console.log("newCode"); //TRACE
        console.log(newCode); //TRACE
        setCurrentContent(newCode);
      }}
    >
      {contentKeys.map(cKey => {
        return (
          <Menu.Item key={cKey}>
            <Icon {...contents[cKey].icon} />
            {contents[cKey].name}
          </Menu.Item>
        );
      })}
    </Menu>
  );
  const code = get(currentContent, "code", defaultContentCode);
  const selectedContent = contents[code];
  console.log("selectedContent"); //TRACE
  console.log(selectedContent); //TRACE
  if (!selectedContent) return null;
  return (
    <>
      <Dropdown
        overlay={menu}
        trigger={["click"]}
        placement="topLeft"
        size="large"
      >
        <AntButton style={{ marginTop: 5 }}>
          <Icon {...selectedContent.icon} />
          {selectedContent.name} <Icon type="down" />
        </AntButton>
      </Dropdown>
    </>
  );
};

export default function({ post, size, onSizeChanged }) {
  const context = useContext(PostWidgetContext.Context);
  const { currentContent } = context;
  const [vKey, setVKey] = useState(null);
  // if (!currentContent) return null;

  const handleOnScreen = debounce((e, { calculations }) => {
    onSizeChanged && onSizeChanged(calculations);
  }, 500);

  return (
    <Transition
      visible={!!currentContent}
      animation="fade up"
      duration={500}
      onComplete={() => {
        setVKey(nanoid());
      }}
    >
      <div
        className="content-editor-actions"
        style={{ width: size.width - 2, minHeight: size.height }}
      >
        <Visibility
          key={vKey}
          fireOnMount
          continuous
          updateOn="repaint"
          onUpdate={handleOnScreen}
        >
          <WidgetSelector context={context} />
          <WidgetEditor postRefNo={post._refNo} context={context} />
        </Visibility>
      </div>
    </Transition>
  );
}
