import React from "react";
import Notification from "antd/lib/notification";
import axios from "axios";
import { Button } from "semantic-ui-react";
import compact from "lodash/compact";

const Context = React.createContext({});

const storageHost = localStorage.getItem("storage");
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
class Provider extends React.Component {
  // state = {};

  // constructor(props){
  //     super(props);
  // }

  updateStatus = (name, index, props) => {
    const { status } = this.state;
    const oldTheStatus = status[name] || [];
    console.log("index"); //TRACE
    console.log(index); //TRACE
    oldTheStatus[index] = Object.assign(oldTheStatus[index] || {}, props);
    return this.setState({
      status: Object.assign(status, { [name]: oldTheStatus })
    });
  };

  state = {
    status: {},
    isUploading: name => {
      const { status } = this.state;
      const theStatus = status[name];
      if (!theStatus) return false;

      for (const fileObj of theStatus) {
        if (
          fileObj.progress === 0 ||
          (fileObj.progress && fileObj.progress < 100)
        )
          return true;
      }
      return false;
    },
    upload: async options => {
      const { name, path, files, metadata } = options;
      // const { status } = this.state;
      console.log("options"); //TRACE
      console.log(options); //TRACE

      if (!files || files.length === 0) return;

      let done = 0;

      Notification.info({
        key: name,
        duration: 0,
        message: `Uploading ${name}`,
        description: `${done}/${files.length} Files`,
        btn: <Button basic size="tiny" content="Cancel" />
      });
      //initial state to 0

      for (let i = 0; i < files.length; i++) {
        this.updateStatus(name, i, { progress: 0 });
      }
      for (let i = 0; i < files.length; i++) {
        try {
          const file = files[i];
          let data;
          // skip if uploaded
          if (file.status === "done") {
            data = {
              status: "SUCCESS",
              data: [file]
            };
          } else {
            let formData = new FormData();
            let originFile = file.originFileObj || file;
            formData.append("file", originFile);
            for (const key in metadata) {
              formData.append(key, metadata[key]);
            }

            const response = await axios({
              method: "post", //CHANGE TO POST
              url: storageHost + path,
              data: formData
            });
            data = response.data;
            await sleep(250);
          }

          if (data.status === "SUCCESS") {
            ++done;
            const finished = done === files.length;
            const cfg = {
              key: name,
              duration: finished ? 1 : 0,
              message: `Uploading ${name}`,
              description: `${done}/${files.length} Files`
            };
            let method;
            if (finished) {
              cfg.btn = (
                <Button
                  basic
                  size="tiny"
                  color="green"
                  disabled
                  content="Complete"
                />
              );
              method = "success";
            } else {
              cfg.btn = <Button basic size="tiny" content="Cancel" />;
              method = "info";
            }

            Notification[method](cfg);
            await this.updateStatus(name, i, {
              progress: 100,
              data: data.data[0]
            });
          }
        } catch (err) {
          console.log("err"); //TRACE
          console.log(err); //TRACE
          await this.updateStatus(name, i, { error: err });
        }
      }

      const theStatus = this.state.status[name] || [];
      theStatus.forEach(fileObj => {
        if (fileObj.error) throw fileObj.error;
      });
      return compact(
        theStatus.map(pObj => {
          if (pObj.data) return pObj.data.name;
          return null;
        })
      );
    }
  };

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default {
  Provider,
  Consumer: Context.Consumer
};
