import React, { Component } from "react";
import {
  Label,
  Item,
  Button,
  List,
  Icon,
  Divider
  // Container
} from "semantic-ui-react";
import "./WidgetGroup.css";
import { manifests } from "./../../components/widgets/";
import config from "./../../config";
import { get, compact, sortBy } from "lodash";

export default class WidgetGroup extends Component {
  state = { activeWidgetIdx: 0 };
  render() {
    const { entity } = this.props;
    const { activeWidgetIdx } = this.state;
    const entityWidgets = get(entity, "widgets", []);
    const list = entityWidgets.map(widget => {
      return { type: manifests[widget.name], widget };
    });
    return (
      <div className="widget-group">
        {compact(
          sortBy(list, "type.weight").map((wData, ii) => {
            if (!wData || !wData.type) return null;
            if (activeWidgetIdx === ii) {
              const widgetMetadata =
                wData.type.metadata &&
                wData.type.metadata(wData.widget, entity);
              if (!widgetMetadata) return null;
              return (
                <Label
                  basic
                  size="large"
                  key={wData.widget.id}
                  color={widgetMetadata.color}
                  style={{ color: widgetMetadata.color }}
                >
                  {widgetMetadata.text}
                </Label>
              );
            } else {
              return (
                <Button
                  basic
                  size="small"
                  circular
                  key={wData.widget.id}
                  icon={wData.type.icon}
                  onClick={() => this.setState({ activeWidgetIdx: ii })}
                />
              );
            }
          })
        )}
      </div>
    );
  }
}
