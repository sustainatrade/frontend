import React, { Component } from "react";
import Timeline from "antd/lib/timeline";
import { Icon, Divider } from "semantic-ui-react";

export default class SubmitPanel extends Component {
  render() {
    const { steps } = this.props;

    return (
      <React.Fragment>
        <Timeline>
          {steps &&
            Object.keys(steps).map(stepKey => {
              const step = steps[stepKey];
              if (step.loading)
                return (
                  <Timeline.Item
                    key={stepKey}
                    dot={<Icon name="spinner" fitted loading />}
                  >
                    {step.description}
                  </Timeline.Item>
                );
              else if (step.done)
                return (
                  <Timeline.Item
                    key={stepKey}
                    dot={<Icon name="check" fitted />}
                    color="green"
                  >
                    {step.description}
                  </Timeline.Item>
                );
              else
                return (
                  <Timeline.Item key={stepKey}>
                    {step.description}
                  </Timeline.Item>
                );
            })}
        </Timeline>
      </React.Fragment>
    );
  }
}
