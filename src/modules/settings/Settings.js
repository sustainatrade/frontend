import React from 'react';
import Modal from 'antd/lib/modal';
import SettingsContext from '../../contexts/SettingsContext';
import Iconify from '../../components/icon-provider/Icon';
import { TYPES } from './index';

const TABS = {
  [TYPES.PROFILE]: {
    Component: React.lazy(() => import('./Profile')),
    Header: (
      <div>
        <Iconify type="fxemoji-frontfacingchick" /> <strong>Profile</strong>
      </div>
    )
  }
};

export default function Settings(props) {
  const { opened, open, closing, close } = React.useContext(SettingsContext.Context);
  const openedTabs = [];
  if (opened.length > 0) {
    opened.forEach(tabKey => {
      openedTabs.push(TABS[tabKey]);
    });
  } else {
    //open all
    Object.keys(TABS).forEach(tabKey => {
      openedTabs.push(TABS[tabKey]);
    });
  }
  let Title;
  if (openedTabs.length === 1) {
    Title = openedTabs[0].Header;
  } else {
    Title = (
      <div>
        <Iconify type="flat-color-icons:settings" />
        {'  '}Settings
      </div>
    );
  }
  return (
    <div>
      <Modal
        title={Title}
        visible={!closing}
        onCancel={() => close()}
        afterClose={() => open(false)}
        footer={null}
      >
        {openedTabs.map((tab, ii) => (
          <tab.Component key={ii} />
        ))}
      </Modal>
    </div>
  );
}
