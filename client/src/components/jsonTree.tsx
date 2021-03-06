import * as React from "react";
import { useState, useEffect, memo } from "react";

import getRequest from "../api";

import { processAfterFind, DELETE, ADD, MODIFY } from "../api";

import { Modal } from "antd";

import { SubNode, LeafNode } from "./node";

const URL = "https://bs-random-json.vercel.app/api/data ";

//var count1 = 0;

export interface Nodes {
  node: {
    [propName: string]: any[];
  };
  preNode: {
    [propName: string]: any[];
  };
  reflashFun: Function;
  NodeStr: string;
}

const JsonTree_container = () => {
  const [data, setData] = useState<Nodes["node"]>({}); //ajax data
  const [count, setCount] = useState(0); //used to force update

  useEffect(() => {
    getRequest(URL).then((result) => {
      setData(result);
    });
  }, []);

  const reflashFun = () => {
    //console.log("setCount");
    setCount((count) => count + 1); //import force update
  };

  return (
    <div style={{ marginLeft: "40%", marginTop: "10%", width: "60%" }}>
      <JsonTree_p
        node={data}
        preNode={data}
        reflashFun={reflashFun}
        NodeStr={JSON.stringify(data)}
      />
    </div>
  );
};

//////////Json tree/////we use recursive to display whole tree///////////////////////////////
///input: node: current node
/////////preNode: parents node,we will use it to add,delete node  !important
/////////handleReflash: when add or delete,we should update tree, this is callback function
/////////  NodeStr: this parameter is very important, Although I force update, but React.memo use this parameter to determin if the component should be updated
////////// The reason why we convert node to string is that the node is object,if node is changed,the previous state and next state of node are all changed,
////////// in this situation,we can not use React.memo to determin if we should update, so we must convert it to string and pass to the child component

function findStr(obj: string) {
  return obj === this;
}

const JsonTree: React.FC<Nodes> = ({ node, preNode, reflashFun, NodeStr }) => {
  let element = [];
  let temp;
  //If we want to display sub tree(expand/Collapse), the element which be put into the array should be displayed
  const [display, setDisplay] = useState([]);
  const [visible, setVisible] = useState(false); //if display error message;
  const [count, setCount] = useState(0);

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
        }
        break;

      case ADD:
        processAfterFind(preNode, node, key, newValue, ADD);
        break;

      case MODIFY:
        processAfterFind(preNode, node, key, newValue, MODIFY);
        if (typeof node === "object") {
          setCount((count) => count + 1); //we only need to update this component only and do not need to force update
          return;
        }
        break;
    }

    reflashFun(); //force update, But no problem,we use React.memo to determin if we should update
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
            <JsonTree_p
              node={item}
              preNode={tempArray}
              reflashFun={reflashFun}
              NodeStr={JSON.stringify(item)} //important! must be passed on the child compoennt along with node object
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

  //console.log(count1++);

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

/////////////////////////////////////////React.memo function/////////////////////////////////////////////
function comFun(
  preProp: Readonly<React.PropsWithChildren<Nodes>>,
  nextProp: Readonly<React.PropsWithChildren<Nodes>>
) {
  //if the content of component does not change,we should not update it

  return preProp.NodeStr === nextProp.NodeStr;
}

/////////////Important!! used to determin if child component should update itself when parent component let it update

const JsonTree_p = memo(JsonTree, comFun);

export default JsonTree_container;
