import React from 'react';
import Content from './../base/Content';
import { Label, Icon, Dropdown } from 'semantic-ui-react';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import { DefaultSaveButton } from './_template';

function TagList(props) {
  const tags = get(props, 'values.tags', []);
  return (
    <div style={{ marginTop: 5, marginBottom: 5 }}>
      {!props.compact && <span style={{ color: 'gainsboro', marginLeft: 15 }}>Tags </span>}
      {tags.length === 0 && <i>None</i>}
      {tags.map(t => (
        <Label key={t} size="mini">
          {t}
        </Label>
      ))}
    </div>
  );
}

function Editor(props) {
  const [tags, setTags] = React.useState(get(props, 'defaultValues.tags', []));
  const [options, setOptions] = React.useState([]);
  function updateOptions(search = '') {
    setOptions(
      [...tags, search].map(t => ({
        key: t,
        value: t,
        icon: 'tag',
        text: t
      }))
    );
  }
  React.useEffect(
    () => {
      if (tags.length > 0) {
        updateOptions();
      }
    },
    [tags]
  );
  return (
    <div style={{ padding: 15 }}>
      <span>
        <b>Tags</b>
      </span>
      <Dropdown
        placeholder="Search Here"
        fluid
        multiple
        search
        value={tags}
        onChange={(_, { value }) => {
          setTags(value);
        }}
        onSearchChange={(_, { searchQuery }) => {
          updateOptions(searchQuery);
        }}
        selection
        options={options}
      />
      <DefaultSaveButton
        saveIcon="save"
        saveText="Submit"
        {...props}
        onSave={() => props.actions.save({ tags })}
      />
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
        editor={Editor}
        view={props => <TagList {...props} />}
        compact={props => <TagList {...props} compact />}
        {...this.props}
      />
    );
  }
}
