import * as React from "react";
import { useState, useEffect, useMemo } from "react";

import getRequest from "../api";

import { processAfterFind } from "../api";

import { Modal } from "antd";

import { SubNode, LeafNode } from "./node";

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
  //If we want to display sub tree(expand/Collapse), the element which be put into the array should be display
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
    if (type === "delete") {
      let result = processAfterFind(preNode, node, key, null, "delete");

      if (result === false) {
        //display error message
        setVisible(true);
        return;
      }
    } else {
      if (type === "modify") {
        processAfterFind(preNode, node, key, newValue, "modify");

        if (typeof node === "object") {
          setCount(count + 1);
          return;
        }
      } else {
        if (type === "add") {
          console.log("begin to add");
          processAfterFind(preNode, node, key, newValue, "add");
        }
      }
    }

    handleReflash();
  };

  //The function used to rendering tree
  const render_node = (
    node: Nodes["node"],
    preNode: Nodes["node"],
    handleCallBack1: Function,
    handleCollapse: Function
  ) => {
    let element = [];
    let temp;
    let visible_element;

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
          visible_element =
            display.findIndex(findStr, key) === -1 ? false : true;

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

          //display sub node

          const temp = (
            <div style={{ marginBottom: "5px" }} key={key}>
              <SubNode
                str={key}
                handleClick={handleCollapse}
                visible={visible_element}
              />

              {visible_element && (
                <div style={{ marginLeft: "5%" }}>{subTree}</div>
              )}
            </div>
          );
          element.push(temp);
        }
      }
    }
    return element;
  };

  //The code below is used to display tree

  const element_r = useMemo(() => {
    console.log("enter,enter");
    return render_node(node, preNode, handleCallBack1, handleCollapse);
  }, [JSON.stringify(preNode), display]);

  return (
    <div>
      {element_r != [] && (
        <div style={{ marginBottom: "5%", width: "100%" }}>{element_r}</div>
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
