import React from "react";
import { GlobalConsumer } from "./../../contexts";
import ComposePost from "./../compose-post";
import Modal from "antd/lib/modal";

const GlobalComponents = () => (
  <GlobalConsumer>
    {({
      createPost: { key, modalOpened, closeModal },
      uploader: { upload, status, isUploading },
      widget: { submitWidgetsFn }
    }) => (
      <React.Fragment>
        <Modal visible={modalOpened} onCancel={closeModal} footer={null}>
          <ComposePost key={key} />
        </Modal>
      </React.Fragment>
    )}
  </GlobalConsumer>
);

export default GlobalComponents;
