import React from "react";
import { Dropdown, Button } from "semantic-ui-react";
import Icon from "antd/lib/icon";
import { contents } from "../../components/widgets";

export default class ContentDropdown extends React.Component {
  state = { selectedCode: null };
  handleClick = code => {
    const { onChange } = this.props;
    this.setState({ selectedCode: code });
    onChange && onChange(code);
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.defaultValue !== prevState.defaultValue) {
      return {
        selectedCode: nextProps.defaultValue
      };
    }
    // Return null to indicate no change to state.
    return null;
  }
  render() {
    const { selectedCode } = this.state;
    const { compact, defaultValue } = this.props;
    const tagOptions = [];
    let Trigger;
    if (selectedCode) {
      const selectedContent = contents[selectedCode];
      Trigger = (
        <Button.Group>
          <Button color="green">
            <Icon {...selectedContent.icon} />
            {!compact && ` ${selectedContent.name}`}
          </Button>
          <Button
            icon="angle down"
            color="green"
            basic
            style={{ marginRight: 5 }}
          />
        </Button.Group>
      );
    } else Trigger = <Button basic icon="plus" content="Add Content" />;
    return (
      <Dropdown trigger={Trigger} icon={null} pointing="top left">
        <Dropdown.Menu>
          {/* <Input icon="search" iconPosition="left" className="search" /> */}
          {/* <Dropdown.Divider /> */}
          <Dropdown.Header icon="tags" content="Select Content" />
          <Dropdown.Menu scrolling>
            {Object.keys(contents).map(code => {
              const content = contents[code];
              const style = {};
              const active = selectedCode === code;
              if (active) style.backgroundColor = "whitesmoke";
              return (
                <Dropdown.Item
                  key={code}
                  active={active}
                  onClick={() => this.handleClick(code)}
                  style={style}
                >
                  <Icon {...content.icon} />
                  {` ${content.name}`}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}
