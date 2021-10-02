import * as React from "react";
import { useState, useEffect } from "react";

import getRequest from "../api";

import { processAfterFind, DELETE, ADD, MODIFY } from "../api";

import { Modal } from "antd";

import { SubNode, LeafNode } from "./node";

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
  const [data, setData] = useState<Nodes["node"]>({}); //ajax data
  //used to reflash
  const [count, setCount] = useState(0); //used to rendering

  useEffect(() => {
    getRequest(URL).then((result) => {
      //console.log(result);

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
  //If we want to display sub tree(expand/Collapse), the element which be put into the array should be displayed
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
    switch (type) {
      case DELETE:
        let result = processAfterFind(preNode, node, key, null, DELETE);
        if (result === false) {
          //display error message
          setVisible(true);
          return;
        }
        break;

      case ADD:
        processAfterFind(preNode, node, key, newValue, ADD);
        break;

      case MODIFY:
        processAfterFind(preNode, node, key, newValue, MODIFY);
        if (typeof node === "object") {
          //we do not need to render whole tree
          setCount(count + 1);
          return;
        }
        break;
    }
    handleReflash();
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

        //display sub node according to value of visible
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

export default JsonTree_container;
