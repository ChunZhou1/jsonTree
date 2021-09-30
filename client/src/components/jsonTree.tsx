import * as React from "react";
import { useState, useEffect } from "react";

import getRequest from "../api";
import { objToString } from "../api";
import { processAfterFind } from "../api";

import { Menu, Dropdown, Modal } from "antd";

import { ModifyMenu, AddMenu } from "./menu";

//test data
import { data1, data2 } from "../mock_data";

const URL = "https://bs-random-json.vercel.app/api/data ";

export interface Nodes {
  node: {
    [propName: string]: any[];
  };
  preNode: {
    [propName: string]: any[];
  };

  handleReflash: Function;
}

const JsonTree_container = () => {
  const [data, setData] = useState<Nodes["node"]>({});
  //used to reflash
  const [count, setCount] = useState(0);

  useEffect(() => {
    getRequest(URL).then((result) => {
      console.log(result);

      setData(result);
    });
  }, []);

  const handleReflash = () => {
    //reflash the tree
    setCount(count + 1);
  };

  return (
    <div style={{ marginLeft: "40%", marginTop: "10%", width: "60%" }}>
      <JsonTree node={data} preNode={data} handleReflash={handleReflash} />
    </div>
  );
};

///////////////////////////////////////////////////////////////
//////////Json tree/////we use recursive to display whole tree///////////////////////////////
///input: node: current node to display
/////////preNode: parents node,we will use it to add,delete node  !important
/////////handleReflash: when add or delete,we should rendering the whole tree,this is callback fun

function findStr(obj: string) {
  return obj === this;
}

const JsonTree: React.FC<Nodes> = ({ node, handleReflash, preNode }) => {
  let element = [];
  let temp;
  //If we want to display sub tree(expand/Collapse), the element which be put into the array should be display
  const [display, setDisplay] = useState([]);
  const [count, setCount] = useState(0); //used to rendering the current node
  const [visible, setVisible] = useState(false); //if display error message;

  //close error message dialog
  const handleOK = () => {
    setVisible(false);
  };

  const handleCollapse = (str: string) => {
    //switch between expand and Collapse,it will be displayed when add subNode name to the array. str=subNode name
    let tempArr = display.slice(0);
    let index = display.findIndex(findStr, str);
    if (index === -1) {
      tempArr.push(str);
    } else {
      tempArr.splice(index, 1);
    }
    setDisplay(tempArr);
  };

  //we will add,remove or edit the leaf node
  const handleCallBack1 = (
    key: string,
    value: any,
    newValue: any,
    type: string
  ) => {
    if (type === "delete") {
      let result = processAfterFind(preNode, node, key, null, "delete");

      if (result === false) {
        //display error message
        setVisible(true);
      } else {
        //we need to rendering whole tree
        handleReflash();
      }
    } else {
      if (type === "modify") {
        processAfterFind(preNode, node, key, newValue, "modify");

        if (typeof node !== "object") {
          handleReflash();
        } else {
          //we do not need to rendering whole tree
          setCount(count + 1);
        }
      } else {
        if (type === "add") {
          processAfterFind(preNode, node, key, newValue, "add");
          handleReflash();
        }
      }
    }
  };

  //The code below is used to display tree
  if (typeof node !== "object") {
    temp = (
      <LeafNode
        preNode={preNode}
        key={node}
        keys={null}
        value={node}
        callBackFun={handleCallBack1}
      />
    );
    element.push(temp);
  } else {
    //The node is object,next we will judge if it contain the array of child node
    for (let key in node) {
      if (Array.isArray(node[key]) === false) {
        //we will display directly
        const temp = (
          <LeafNode
            preNode={preNode}
            key={key}
            keys={key}
            value={node[key]}
            callBackFun={handleCallBack1}
          />
        );
        element.push(temp);
      } else {
        //The node contain the array of child node, we will display subNode
        let visible; //expand or Collapse

        //judge if we should display sub tree(Collapse/expand)
        if (display.findIndex(findStr, key) === -1) {
          visible = false;
        } else {
          visible = true;
        }

        let tempArray: { [propName: string]: any } = node[key];

        //display array
        const subTree = tempArray.map((item: any) => {
          return (
            <JsonTree
              node={item}
              handleReflash={handleReflash}
              preNode={tempArray}
            />
          );
        });

        //display sub node according to var visible
        const temp = (
          <div style={{ marginBottom: "5px" }} key={key}>
            <SubNode str={key} handleClick={handleCollapse} visible={visible} />

            {visible && <div style={{ marginLeft: "10%" }}>{subTree}</div>}
          </div>
        );
        element.push(temp);
      }
    }
  }

  return (
    <div>
      {element != [] && (
        <div style={{ marginBottom: "5%", width: "50%" }}>{element}</div>
      )}
      <Modal
        title="Sorry"
        visible={visible}
        onOk={handleOK}
        width={400}
        closable={false}
        centered={true}
        cancelButtonProps={{ disabled: true }}
        maskClosable={false}
        okText="OK"
        cancelText="Cancel"
      >
        <h3>
          Leaving only one node, I can let you delete it, but once you delete
          it, I am not be able to add node, because I can not remeber key value.
          Sorry!
        </h3>
      </Modal>
    </div>
  );
};

//The SubNode //////////
interface SubNodesProp {
  str?: string;
  handleClick?: Function;
  visible?: boolean;
}

const SubNode: React.FC<SubNodesProp> = ({ str, handleClick, visible }) => {
  const onClick = () => {
    handleClick(str);
  };
  return (
    <span
      style={{ color: visible ? "red" : "#5377a6", fontWeight: 700 }}
      onClick={onClick}
    >
      {str}
    </span>
  );
};

interface LeafNodeProp {
  preNode: {
    [propName: string]: any[];
  };
  keys: string;
  value: any;
  callBackFun: Function;
}

//The LeafNode///////////////////////////////////

const LeafNode: React.FC<LeafNodeProp> = ({
  preNode,
  keys,
  value,
  callBackFun,
}) => {
  const [visible, setVisible] = useState(false); //if display edit and add dialog
  const [title, setTitle] = useState(""); //set title of dialog
  const [addDisable, setAddDisable] = useState(true); //set if user can click add button

  useEffect(() => {
    //if preNode only contain one element,I believe this is not be added but can be edited,EX:price
    if (Array.isArray(preNode) === true) {
      setAddDisable(false);
    } else {
      setAddDisable(true);
    }
  }, []);

  //user click popup menu
  const onClick = (e: any) => {
    switch (e.key) {
      case "DELETE":
        callBackFun(keys, value, null, "delete");
        break;

      case "MODIFY":
        //display edit dialog
        setTitle("MODIFY");
        setVisible(true);
        break;

      case "ADD":
        //display add dialog
        setTitle("ADD");
        setVisible(true);
        break;

      default:
        break;
    }
  };

  //user close dialog and do not want to edit or modify
  const onClose = () => {
    setVisible(false);
  };

  //user close dialog and want to modify

  const callBackModify = (input: any) => {
    callBackFun(keys, value, input, "modify");
    setVisible(false);
  };

  //user close dialog and want to add
  const callBackAdd = (input: any) => {
    callBackFun(keys, value, input, "add");
    setVisible(false);
  };

  //the popdown menu
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item disabled={addDisable} key="ADD">
        Add
      </Menu.Item>
      <Menu.Item key="DELETE">Delete</Menu.Item>
      <Menu.Item key="MODIFY">Edit</Menu.Item>
    </Menu>
  );
  return (
    <div>
      <Dropdown overlay={menu} trigger={["contextMenu"]}>
        <div style={{ marginBottom: "5px" }}>
          {keys !== null && (
            <span style={{ fontWeight: 700 }}>{keys}:&nbsp;&nbsp;</span>
          )}
          <span style={{ color: "blue" }}>{objToString(value)}</span>
        </div>
      </Dropdown>
      <Modal
        title={title}
        visible={visible}
        onOk={onClose}
        onCancel={onClose}
        width={400}
        closable={true}
        centered={true}
        maskClosable={false}
        footer={null}
        destroyOnClose={true}
      >
        {title === "MODIFY" && (
          <ModifyMenu keys={keys} value={value} fun={callBackModify} />
        )}
        {title === "ADD" && <AddMenu preNode={preNode} fun={callBackAdd} />}
      </Modal>
    </div>
  );
};

export default JsonTree_container;
