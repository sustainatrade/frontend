import { createWidget } from "./lib";
import { capitalize } from "lodash";
import config from "./../../config";

const manifests = {
  HelloWorld: createWidget(import("./HelloWorld"), {
    icon: "plus",
    disabled: true
  }),
  PriceTag: createWidget(import("./PriceTag"), {
    icon: "money bill alternate",
    weight: 0,
    metadata(widget, entity) {
      switch (entity.__typename) {
        case "Post":
          const section = config.sections.find(
            ({ key }) => key === entity.section
          );
          const { currency, price } = widget.values;
          return {
            color: section.color,
            key: widget.name,
            text: `${currency} ${Number(price).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`
          };
        default:
          return {};
      }
    }
  }),
  Color: createWidget(import("./Color"), {
    icon: "paint brush",
    weight: 1,
    metadata(widget, entity) {
      switch (entity.__typename) {
        case "Post":
          const { color } = widget.values;
          return {
            color,
            key: widget.name,
            text: capitalize(color)
          };
        default:
          return {};
      }
    }
  }),
  Quality: createWidget(import("./Quality"), { icon: "shield alternate" })
};

export { manifests };
