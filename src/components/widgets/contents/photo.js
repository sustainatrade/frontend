import React, { Component, useState, useContext, useEffect } from 'react';
import Content from './../base/Content';

import Upload from 'antd/lib/upload';
import Modal from 'antd/lib/modal';

import { Icon, Button, Image } from 'semantic-ui-react';
import Uploader from '../../../contexts/Uploader';
import get from 'lodash/get';
import MsImage from '../../ms-image/MsImage';
import { DefaultSaveButton } from './_template';

const UPLOAD_NAME = 'Post Image Upload';

const path = localStorage.getItem('postPhotoPath');
const storage = localStorage.getItem('storage');

class UploadPhoto extends Component {
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
    const { photos = [], onChange } = this.props;
    const hasSelectedPhoto = photos.length > 0;
    console.log('hasSelectedPhoto', hasSelectedPhoto); //TRACE
    return (
      <React.Fragment>
        <Upload
          //   action={`${storageHost}${uploadPhotoUrl}`}
          listType="picture"
          fileList={photos}
          onPreview={this.handlePreview}
          multiple
          disabled={hasSelectedPhoto}
          onChange={({ fileList }) => {
            onChange && onChange(fileList);
          }}
          beforeUpload={this.handleBeforeUpload}
        >
          <>
            {hasSelectedPhoto ? (
              <span>Selected Photo</span>
            ) : (
              <Button
                fluid
                color="blue"
                basic
                onClick={() => {
                  console.log('clinging');
                }}
              >
                <Icon.Group size="huge">
                  <Icon name="image" />
                  <Icon corner name="add" />
                </Icon.Group>
                <div>Select Photo</div>
              </Button>
            )}
          </>
        </Upload>
        <div style={{ clear: 'both', marginBottom: 10 }} />
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </React.Fragment>
    );
  }
}

function Editor(props) {
  const [photos, setPhotos] = useState(null);
  const { status, isUploading, upload } = useContext(Uploader.Context);
  const uploading = isUploading(UPLOAD_NAME);
  const uploaded = get(status, `${UPLOAD_NAME}.0`);
  const uploadedName = get(uploaded, `data.name`);

  useEffect(
    () => {
      console.log('uploadedName', uploadedName); //TRACE
      if (!uploaded) return;
      if (uploaded.progress === 100) {
        const values = {
          name: uploadedName,
          originalName: get(uploaded, `data.originalName`),
          photoUrl: `${storage}${path}/${uploadedName}`
        };
        props.updateValues(values);
        console.log('values', values); //TRACE
      }
    },
    [uploadedName]
  );
  useEffect(
    () => {
      if (uploading || photos === null) return;
      if (photos && photos.length > 0) {
        const path = localStorage.getItem('postPhotoPath');
        upload({
          name: UPLOAD_NAME,
          path,
          files: photos
        });
      } else {
        console.log('empting');

        const values = {
          name: null,
          originalName: null,
          photoUrl: null
        };
        props.updateValues(values);
      }
    },
    [photos]
  );
  console.log('status', status); //TRACE
  console.log('props', props); //TRACE
  // useEffect(() => {

  // }, [props.defaultValues]);
  const defaultFileList = [];
  const defaultPhotoUrl = get(props, 'defaultValues.photoUrl');
  const defaultPhotoName = get(props, 'defaultValues.originalName');
  if (defaultPhotoUrl) {
    console.log('defaultPhotoUrl', defaultPhotoUrl); //TRACE
    defaultFileList.push({
      uid: '1',
      name: defaultPhotoName,
      status: 'done',
      url: defaultPhotoUrl
    });
  }
  return (
    <div style={{ padding: 15 }}>
      <UploadPhoto
        photos={photos || defaultFileList}
        onChange={files => {
          console.log('files', files); //TRACE
          setPhotos(files);
        }}
      />
      {photos && photos.length > 0 && <DefaultSaveButton {...props} />}
      {/* <Divider /> */}
      {/* <Button.Group>
        <Button>Fit</Button>
        <Button>Stretched</Button>
      </Button.Group> */}
    </div>
  );
}

export default class Text extends React.Component {
  render() {
    return (
      <Content
        previewData={{
          test: 'haha'
        }}
        editor={props => {
          return <Editor {...props} />;
        }}
        view={props => {
          const src = get(props, 'values.photoUrl');
          return <div>{src ? <Image src={src} /> : 'No image selected'}</div>;
        }}
        compact={props => {
          const src = get(props, 'values.photoUrl');
          return (
            <div
              style={{
                textAlign: 'center',
                backgroundColor: 'whitesmoke'
              }}
            >
              {src ? (
                <MsImage height={50} width={50} style={{ cursor: 'pointer' }} src={src} />
              ) : (
                'No image selected'
              )}
            </div>
          );
        }}
        {...this.props}
      />
    );
  }
}
