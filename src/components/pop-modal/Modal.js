import React from 'react';
import Modal from 'antd/lib/modal';

export default function PopModal(props) {
  const { onClose, children, ...rest } = props;
  const [closing, setClosing] = React.useState(false);

  return (
    <Modal
      visible={!closing}
      afterClose={() => {
        closing && onClose && onClose();
      }}
      onCancel={() => setClosing(true)}
      footer={null}
      closable={false}
      bodyStyle={{ padding: 0 }}
      {...rest}
    >
      {children({
        close() {
          setClosing(true);
        }
      })}
    </Modal>
  );
}
