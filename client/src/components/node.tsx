import * as React from "react";
import { useState, useEffect, useMemo } from "react";
import { Menu, Dropdown, Modal } from "antd";
import { ModifyMenu, AddMenu } from "./menu";
import { objToString } from "../api";
import { RightOutlined, DownOutlined } from "@ant-design/icons";

//The SubNode //////////
interface SubNodesProp {
  str?: string;
  handleClick?: Function;
  visible?: boolean;
}

export const SubNode: React.FC<SubNodesProp> = ({
  str,
  handleClick,
  visible,
}) => {
  const onClick = () => {
    handleClick(str);
  };
  return (
    <div>
      <span
        style={{ color: visible ? "red" : "#5377a6", fontWeight: 700 }}
        onClick={onClick}
      >
        {str}
      </span>
      {!visible ? <RightOutlined /> : <DownOutlined />}
    </div>
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

export const LeafNode: React.FC<LeafNodeProp> = ({
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
