import * as React from "react";
import { useState } from "react";
import { Input, Button, Modal } from "antd";
import { string } from "prop-types";
import { judgeValue, convertValue } from "../api";

interface ModifyMenuProp {
  keys: string;
  value: any;
  fun: Function;
}
////////////////////////edit node dialog//////////////////////////
export const ModifyMenu: React.FC<ModifyMenuProp> = ({ keys, value, fun }) => {
  const [input, setInput] = useState(value.toString()); //used to process value which is not object

  let tempArray: { [propName: string]: any } = []; //used to process object value

  tempArray.push(value);

  //user click OK btn and we will upload data to parent component
  const handleClick = () => {
    //the data is not object
    fun(convertValue(value, input));
  };

  const handleClickObject = (input: { [propName: string]: any }) => {
    //the data is object
    fun(convertValue(value, input));
  };

  const onChange = (e: any) => {
    setInput(e.target.value);
  };

  //note! if the data is object,we will call AddMenu to display data(EX:price)
  return (
    <div>
      {typeof value !== "object" && (
        <div>
          <div>
            {keys !== null && <span> {keys}:</span>}
            <Input
              data-id={keys}
              style={{ marginTop: "2%" }}
              value={input}
              onChange={onChange}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ marginTop: "10%" }}>
              <Button
                data-id={"ok1"}
                type="primary"
                onClick={handleClick}
                block={true}
                shape="round"
                disabled={!judgeValue(input, value)}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      )}
      {typeof value === "object" && (
        <AddMenu preNode={tempArray} fun={handleClickObject} />
      )}
    </div>
  );
};

//////////////////////////add node dialog////////////////////////////
interface AddMenuProp {
  preNode: { [propName: string]: any[] };
  fun: Function;
}

export const AddMenu: React.FC<AddMenuProp> = ({ preNode, fun }) => {
  const [visible, setVisible] = useState(false); //if display error message
  const [message, setMessage] = useState(""); //error message

  const [returnValue1, setReturnValue1] = useState({}); //storage user input object
  const [returnValue2, setReturnValue2] = useState(""); //storage user input string

  const obj = preNode[0]; //we want to get key to diaplay

  //user press ok to close error message dialog
  const handleOK = () => {
    setVisible(false);
  };

  //change the input value when user input text
  const handleInput = (keys: string, value: string) => {
    let tempValue: { [propName: string]: any } = {};
    if (typeof obj === "object") {
      tempValue = { ...returnValue1 };
      tempValue[keys] = value;
      setReturnValue1(tempValue);
    } else {
      setReturnValue2(value);
    }
  };

  //user press OK button,we will upload data to parent component,but before upload,we should do sth
  const handleClick = () => {
    //first we will check the user input
    if (typeof obj === "object") {
      if (judgeValue(returnValue1, obj) === false) {
        setMessage("Each key must have value or value is not correct.");
        setVisible(true);
        return;
      }
    } else {
      if (judgeValue(returnValue2, obj) === false) {
        setMessage("You must enter a value or value is not correct");
        setVisible(true);
        return;
      }
    }

    //call callback function and return
    if (typeof obj === "object") {
      fun(convertValue(obj, returnValue1));
    } else {
      fun(convertValue(obj, returnValue2));
    }
  };

  const keyList = [];
  if (typeof obj === "object") {
    for (let key in obj) {
      let temp = <KeyValue key={key} keys={key} fun={handleInput} />;
      keyList.push(temp);
    }
  } else {
    let temp = <KeyValue keys={null} fun={handleInput} />;
    keyList.push(temp);
  }

  return (
    <div>
      {typeof obj === "object" && <h2>Please input Key and Values </h2>}
      {typeof obj !== "object" && <h2>Please input Value </h2>}
      {keyList}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginTop: "10%" }}>
          <Button
            data-id={"ok2"}
            type="primary"
            onClick={handleClick}
            block={true}
            shape="round"
            disabled={returnValue1 === {} && returnValue2 === ""}
          >
            OK
          </Button>
        </div>
      </div>
      <Modal
        title="Message"
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
        <p>{message}</p>
      </Modal>
    </div>
  );
};

interface KeyValueProp {
  keys: string;
  fun: Function;
}
//////////////////////////////////display key&value pairs////////////////
const KeyValue: React.FC<KeyValueProp> = ({ keys, fun }) => {
  const [input, setInput] = useState("");

  const onChange = (e: any) => {
    setInput(e.target.value);
    fun(keys, e.target.value);
  };
  return (
    <div style={{ marginTop: "5%" }}>
      {keys !== null && <span> {keys}:</span>}
      <Input style={{ marginTop: "2%" }} value={input} onChange={onChange} />
    </div>
  );
};
