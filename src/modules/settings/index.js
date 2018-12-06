import React from 'react';
import SettingsContext from '../../contexts/SettingsContext';
import UserContext from '../../contexts/UserContext';
// import get from 'lodash/get';

const Settings = React.lazy(() => import('./Settings'));

export const TYPES = {
  PROFILE: 'profile'
};

export default function SettingWrapper(props) {
  const { opened, open } = React.useContext(SettingsContext.Context);
  const { user } = React.useContext(UserContext.Context);
  React.useEffect(
    () => {
      if (user && !user.editDate) {
        open([TYPES.PROFILE]);
      }
    },
    [user]
  );
  // console.log('opened', opened); //TRACE
  if (!opened) return null;
  return (
    <React.Suspense fallback={null}>
      <Settings />
    </React.Suspense>
  );
}
