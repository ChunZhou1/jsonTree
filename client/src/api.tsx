import { Nodes } from "./components/jsonTree";

interface JsonObj {
  obj: {
    [propName: string]: any;
  };
}

const getRequest = (url: string) => {
  return window
    .fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return null;
      }
    })
    .then((data) => {
      if (!data || data.error) {
        console.log("API error:", { data });
        throw new Error("getRequest " + url + " error!");
      } else {
        return data;
      }
    });
};

export const objToString = (obj: JsonObj["obj"] | string) => {
  let result = "";
  if (typeof obj === "object") {
    for (let key in obj) {
      result = result + key + ":" + obj[key] + " ";
    }
  } else {
    return obj.toString();
  }
  return result;
};

export const gerKey = () => {
  return Math.trunc(Math.random() * 1000);
};

export interface Nodes1 {
  node1: {
    [propName: string]: any | any[];
  };
}

//process node function

export const processAfterFind = (
  preNode: Nodes1["node1"],
  node: Nodes1["node1"],
  key: string,
  newValue: any,
  type: string
) => {
  if (type === "delete") {
    if (preNode.toString() === node.toString()) {
      console.log("can not delete");
      return false;
    } else {
      deleteLeafNode(preNode, node, key);
      return true;
    }
  }

  if (type === "modify") {
    return modifyNode(preNode, node, key, newValue);
  }

  if (type === "add") {
    return addNode(preNode, newValue);
  }

  return false;
};

/////////////////delete node///////////////////////

const deleteLeafNode = (
  preNode: Nodes1["node1"], //parents node
  node: Nodes1["node1"], //current node
  key: string
) => {
  if (Array.isArray(preNode) === true) {
    let index = preNode.findIndex(function (obj: Object) {
      return obj === this;
    }, node);
    if (index !== -1) {
      preNode.splice(index, 1);
    }
  } else {
    preNode[key] = null;
    node = null;
  }
  return true;
};

/////////////////edit node///////////////////////
const modifyNode = (
  preNode: Nodes1["node1"], //parents node
  node: Nodes1["node1"], //current node
  key: string,
  newValue: any
) => {
  if (typeof node === "object") {
    node[key] = newValue;
    return true;
  }

  if (Array.isArray(preNode) === true) {
    let index = preNode.findIndex(function (obj: any) {
      return obj === this;
    }, node);

    if (index !== -1) {
      preNode.splice(index, 1, newValue);
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const addNode = (preNode: Nodes1["node1"], newValue: any) => {
  if (Array.isArray(preNode) === true) {
    preNode.push(newValue);

    return true;
  } else {
    return false;
  }
};

///judge if the user input value is OK
export const judgeValue = (
  obj: JsonObj["obj"] | string,
  oldObj: JsonObj["obj"] | string
) => {
  if (typeof obj === "object" && typeof oldObj === "object") {
    for (let key in oldObj) {
      if (
        obj[key] === "" ||
        obj[key] === undefined ||
        validateValue(oldObj[key], obj[key]) === false
      ) {
        console.log("error");
        return false;
      }
    }
  } else {
    if (
      obj === "" ||
      obj === undefined ||
      validateValue(oldObj, obj.toString()) === false
    ) {
      console.log("error");
      return false;
    }
  }
  return true;
};

// convert string value to orginal value
const assignValue = (oldValue: any, newValue: any) => {
  let result: any;
  switch (typeof oldValue) {
    case "number":
      result = Number(newValue);
      break;

    case "boolean":
      console.log("boolean");
      if (newValue === "true") {
        result = true;
      } else {
        result = false;
      }

      break;

    default:
      result = newValue;
      break;
  }

  return result;
};

//onvert string obj to original obj
export const convertValue = (oldObj: any, newObj: any) => {
  if (typeof newObj !== "object") {
    return assignValue(oldObj, newObj);
  }

  for (let key in newObj) {
    newObj[key] = assignValue(oldObj[key], newObj[key]);
  }

  return newObj;
};

export const validateValue = (oldValue: any, newValue: string) => {
  if (typeof oldValue === "number") {
    if (isNaN(convertValue(oldValue, newValue))) {
      return false;
    }
  }

  if (typeof oldValue === "boolean") {
    if (newValue != "true" && newValue != "false") {
      return false;
    }
  }

  return true;
};

export default getRequest;
