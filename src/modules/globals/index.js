import React from "react";
import { GlobalConsumer } from "./../../contexts";
import Modal from "antd/lib/modal";

const GlobalComponents = () => (
  <GlobalConsumer>
    {({
      createPost: { key, modalOpened, closeModal },
      uploader: { upload, status, isUploading }
    }) => (
      <React.Fragment>
        <Modal visible={modalOpened} onCancel={closeModal} footer={null} />
      </React.Fragment>
    )}
  </GlobalConsumer>
);

export default GlobalComponents;
