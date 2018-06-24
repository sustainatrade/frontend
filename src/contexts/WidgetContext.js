import React from "react";
import gql from "graphql-tag";
import apolloClient from "./../lib/apollo";
import Modal from "antd/lib/modal";
import WidgetEditor from "./../components/widget-editor/WidgetEditor";
import nanoid from "nanoid";

const Context = React.createContext();
const { Consumer } = Context;

const UPDATE_POST_WIDGETS = gql`
  mutation($hash: String, $widgets: [WidgetUpdateInput]!) {
    UpdatePostWidgets(input: { _hash: $hash, widgets: $widgets }) {
      status
      widgets {
        id
        displayName
        types
        values
        _refNo
      }
    }
  }
`;

class Provider extends React.Component {
  state = {
    creating: false,
    submitting: false,
    editorKey: nanoid(),
    selectingWidget: false,
    selectWidgetFn: editData => {
      return new Promise((resolve, reject) => {
        this.setState({
          editorKey: nanoid(),
          selectingWidget: {
            editData,
            resolve,
            reject
          }
        });
      });
    },
    setCreatingFn: creating => {
      this.setState({ creating });
    },
    submitNewFn: async widgetData => {
      this.setState({ submitting: true });
      widgetData.type = "CREATE";
      const widgetInput = Object.assign({}, widgetData, {
        types: JSON.stringify(widgetData.types),
        values: JSON.stringify(widgetData.values)
      });
      const ret = await apolloClient.mutate({
        mutation: UPDATE_POST_WIDGETS,
        variables: {
          widgets: [widgetInput]
        }
      });
      this.setState({ submitting: false });
      return ret.data.UpdatePostWidgets.widgets[0]._refNo;
    }
  };

  //TESTING
  componentDidMount() {}

<<<<<<< HEAD
  render() {
    const { children } = this.props;
    return (
      <Context.Provider value={this.state}>
        {children}
        <Modal
          title="New Spec"
          visible={!!this.state.selectingWidget}
          onOk={() => {
            const { selectingWidget, currentWidget } = this.state;
            selectingWidget.resolve(currentWidget);
            this.setState({ selectingWidget: false });
          }}
          onCancel={() => {
            this.state.selectingWidget.resolve();
            this.setState({ selectingWidget: false });
          }}
        >
          <WidgetEditor
            key={this.state.editorKey}
            editData={this.state.selectingWidget.editData}
            onChange={data => this.setState({ currentWidget: data })}
          />
        </Modal>
      </Context.Provider>
    );
  }
=======
    render() {
        const { children } = this.props;
        return <Context.Provider value={this.state}>
                    { children }
                    <Modal
                      title="New Spec"
                      visible={!!this.state.selectingWidget}
                      onOk={()=>{
                        const {selectingWidget,currentWidget} = this.state
                        selectingWidget.resolve(currentWidget)
                        this.setState({selectingWidget:false})

                      }}
                      onCancel={()=>{
                        this.state.selectingWidget.resolve()
                        this.setState({selectingWidget:false})
                      }}
                    >
                      <WidgetEditor key={this.state.editorKey} onChange={(data)=>this.setState({currentWidget:data})}/>
                    </Modal>
                </Context.Provider>
      }
>>>>>>> 979ed72... display widgets in create post
}

export default {
  Provider,
  Consumer
};
