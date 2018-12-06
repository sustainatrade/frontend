import React from 'react';
import UserContext from '../../contexts/UserContext';
import { Form, Input, Button, Image, Placeholder, Divider } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import random from 'lodash/random';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { Map } from 'immutable';
import { UPDATE_USER_PROFILE, GET_ME } from '../../gql-schemas';
import { PHOTO_DATA_URI_KEY } from '../../components/user-auth/WelcomeModal';
import SettingsContext from '../../contexts/SettingsContext';

const MAX_RANDOM = 1000;

function getRandom() {
  return random(0, MAX_RANDOM);
}

export default function ProfileSetting() {
  const photoDataUri = localStorage.getItem(PHOTO_DATA_URI_KEY);

  const { user } = React.useContext(UserContext.Context);
  const { close } = React.useContext(SettingsContext.Context);
  const [avatarUrl, setAvatarUrl] = React.useState(get(user, 'photoUrl') || photoDataUri);
  const [randLoading, setRandLoading] = React.useState(false);
  const [updates, setUpdates] = React.useState(Map(user));
  const [saved, setSaved] = React.useState(false);
  // React.useEffect(
  //   () => {
  //     if (saved) {
  //       reload();
  //     }
  //   },
  //   [saved]
  // );

  React.useEffect(
    () => {
      setUpdates(Map(user));
      setAvatarUrl(get(user, 'photoUrl') || photoDataUri);
    },
    [user]
  );

  React.useEffect(
    () => {
      setRandLoading(true);
      user && setUpdates(oldUser => oldUser.set('photoUrl', avatarUrl));
      setTimeout(() => setRandLoading(false), 500);
      localStorage.setItem(PHOTO_DATA_URI_KEY, avatarUrl);
    },
    [avatarUrl]
  );
  // console.log('cccc', JSON.stringify(updates.toJS()), '==================', JSON.stringify(user)); //TRACE
  const changed = user && updates && JSON.stringify(updates.toJS()) !== JSON.stringify(user);

  return (
    <div>
      <center>
        <Form>
          <Divider horizontal>Display Name</Divider>
          {user ? (
            <>
              <Input
                focus
                size="massive"
                type="text"
                placeholder="Your Name"
                defaultValue={user.displayName}
                onChange={(_, { value }) => setUpdates(oldUser => oldUser.set('firstName', value))}
              >
                <input style={{ fontWeight: 'bold', textAlign: 'center' }} />
              </Input>
            </>
          ) : (
            <Placeholder style={{ width: 200 }}>
              <Placeholder.Line length="full" />
            </Placeholder>
          )}
          <Divider horizontal>Avatar</Divider>
          {user ? (
            <Image rounded src={avatarUrl} style={{ width: 50 }} />
          ) : (
            <Placeholder style={{ height: 50, width: 50 }}>
              <Placeholder.Image />
            </Placeholder>
          )}
          <Button.Group basic size="small" style={{ marginTop: 10 }}>
            <Button
              content="Random"
              loading={randLoading}
              icon="refresh"
              onClick={debounce(() => {
                setAvatarUrl(`https://api.adorable.io/avatars/50/usapph@set6-${getRandom()}.png`);
              }, 500)}
            />
            <Button disabled icon="photo" title="Sooon!!" />
          </Button.Group>
          <Divider />
          <Mutation
            mutation={UPDATE_USER_PROFILE.query}
            variables={{
              updates: { firstName: updates.get('firstName'), photoUrl: updates.get('photoUrl') }
            }}
            onCompleted={data => {
              setSaved(get(data, 'UpdateUserInfo.user', false));
            }}
            refetchQueries={() => [GET_ME]}
          >
            {(updateUserProfile, { loading, error }) => {
              return (
                <>
                  {error && JSON.stringify(error)}
                  <Button
                    size="big"
                    icon={saved ? 'check' : 'save'}
                    loading={loading}
                    disabled={!changed}
                    color={saved ? 'green' : 'blue'}
                    content="Save"
                    onClick={updateUserProfile}
                  />
                </>
              );
            }}
          </Mutation>
          <Button size="big" icon="close" content="Close" onClick={() => close()} />
        </Form>
      </center>
    </div>
  );
}
