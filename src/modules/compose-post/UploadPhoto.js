import React, { Component } from "react";
import Upload from "antd/lib/upload";
import Modal from "antd/lib/modal";
import { Icon } from "semantic-ui-react";
import CreatePostContext from "./../../contexts/CreatePost";

export default class UploadPhoto extends Component {
  state = {};

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  handleBeforeUpload = file => {
    //TODO: add hash validation (if already uploaded)
    return false;
  };

  render() {
    const { previewVisible, previewImage } = this.state;

    return (
      <React.Fragment>
        <CreatePostContext.Consumer>
          {({ setPhotos, photos }) => (
            <Upload
              //   action={`${storageHost}${uploadPhotoUrl}`}
              listType="picture-card"
              fileList={photos}
              onPreview={this.handlePreview}
              multiple
              onChange={({ fileList }) => setPhotos(fileList)}
              beforeUpload={this.handleBeforeUpload}
            >
              <div>
                <Icon.Group size="huge">
                  <Icon name="image" />
                  <Icon corner name="add" />
                </Icon.Group>
                <div>Add Photo</div>
              </div>
            </Upload>
          )}
        </CreatePostContext.Consumer>
        <div style={{ clear: "both" }} />

        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </React.Fragment>
    );
  }
}
