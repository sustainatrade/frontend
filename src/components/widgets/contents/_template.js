import React from 'react';
import Content from './../base/Content';
import { Button, Divider } from 'semantic-ui-react';

export const DIVIDER_COLOR = 'ghostwhite';
export const FOOTER_STYLES = {
  backgroundColor: DIVIDER_COLOR,
  padding: 5,
  color: 'darkgray',
  fontSize: 'small',
  paddingBottom: 0,
  paddingLeft: 15
};

export function DefaultSaveButton(props) {
  const txt = Object.keys(props.defaultValues || {}).length > 0 ? 'Update' : 'Add';
  const { onSave, onCancel } = props;
  return (
    <div style={{ marginTop: 5, marginBottom: 0 }}>
      <Divider clearing />
      <Button
        primary
        icon={props.saveIcon || 'plus'}
        size="large"
        content={props.saveText || txt}
        disabled={props.submitting}
        loading={props.submitting}
        onClick={() => {
          onSave ? onSave() : props.actions.save();
        }}
      />
      <Button
        icon="x"
        size="large"
        disabled={props.submitting}
        loading={props.submitting}
        onClick={() => {
          onCancel ? onCancel() : props.actions.cancel();
        }}
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
        editor={props => {
          return <div style={{ padding: 15 }} />;
        }}
        view={props => <div />}
        compact={props => <div />}
        {...this.props}
      />
    );
  }
}
