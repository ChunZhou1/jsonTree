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
  preNode: Nodes1["node1"],  //parents node
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
  }
  return true;
};

/////////////////edit node///////////////////////
const modifyNode = (
  preNode: Nodes1["node1"], //parents node
  node: Nodes1["node1"],   //current node
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
  console.log(obj);
  if (typeof obj === "object" && typeof oldObj === "object") {
    for (let key in oldObj) {
      if (obj[key] === "" || obj[key] === undefined) {
        console.log("error");
        return false;
      }
    }
  } else {
    if (obj === "" || obj === undefined) {
      console.log("error");
      return false;
    }
  }
  return true;
};

export default getRequest;
