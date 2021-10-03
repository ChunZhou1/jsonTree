# JSON Tree Display
# How to run the program:

1: Open the terminal under the **Client** directory.

2: ```npm install```

3: ```npm start```

# How to run automatic testing:

1: Open the terminal under the **Client** directory.

2: ```npx cypress open```

# Summary of the assignment

The software is used to display and operate on the JSON tree, You can edit, delete, add nodes to the JSON tree.
But not all the node on the tree can be added and deleted. For example, **"price"** key can only be edited, Because 
the price value is not contained in the array, so I think the **"price"** key only has one value.

```About edit, delete, add node:You can place the mouse on the leaf node on the tree and right click on it. The popup menu will show up. ```

```For boolean variables(EX: optedin), You must input "true" or "false", otherwise the error will show up or OK button will be disabled.```

Additionally, You can not delete all the nodes under the parent node. Because if you do that, I can not add a node under this parent node as I do not know the
key name.

# software structure: #

The software includes files as follows:

1: **jsonTree.TSX:** main file, under **“components”** directory.The file contains the JsonTree component, which displays the whole JSON tree and manipulates node.

2:  **api.TSX:** under the **"client"** directory. The file contains all the API functions which are used by other files. The file includes ajax functions, functions to manipulate nodes, and data validation functions.

3: **node.TSX** :under **“component”** directory.

The file contains the components used to display the leaf node (**LeafNode**) and the parent node of the leaf node
(**SubNode**). The two types of components are called by (**JsonTree**) component.

4: **menu.TSX** under “**component**” directory.

The file contains the component used to display the popup menu and input dialog. The user uses these menus and dialogs
to input the parameter of the node. 

(**ModifyMenu**): used to input the parameter of the edit menu.
(**AddMenu**): used to input the parameter of the add menu.

The two components above are called by (**LeafNode**)

![image](https://github.com/ChunZhou1/jsonTree/blob/master/client/component_relationship.png)

# Software algorithm #

The software uses a recursive algorithm to display the whole JSON tree. The entire tree consists of many subtrees.
Each Jsontree component is a subtree.

The **JsonTree** component has four parameters:

**node**: current node of the trees.

**preNode** : the parent node of the current node.

**reflashFun**: callBack function, used to refresh the whole tree.

**NodeStr**: this parameter is very important, React.memo use this parameter to determin if the component should be updated

Since each component has props of the current node and the parent node, it is easy to operate on the node(such as add, delete node) without 
query operations(such as recursive query)

**How to avoid over-rendering**

When the user add, delete, and edit the node, First, we attempt to update each component, but we only update the components whose content has been changed. We use React.memo to do this. React.memo will compare the previous status and next status of the content and determine if the component should be updated.

This helped us avoid over-rendering.

```
import { useState, useEffect, memo } from "react";
function comFun(
  preProp: Readonly<React.PropsWithChildren<Nodes>>,
  nextProp: Readonly<React.PropsWithChildren<Nodes>>
) {
  //if the content of component does not change,we should not update it

  return preProp.NodeStr === nextProp.NodeStr;
}

/////////////Important!! used to determin if child component should update itself when parent component let it update

const JsonTree_p = memo(JsonTree, comFun);
```

# About automatic testing: # 

I created the automative testing script under the “**Cypress/integration**” directory. The automative test includes show, add, delete and edit testing.
I used a mock http server to return fixed JSON data to facilitate test.

# What will I do in the future to improve the program: #

The first thing I will do is storing JSON files to the local storage automatically since many of the other components might also use the JSON data. I will use Redux to store JSON data. The persist-redux can store the redux data to the local storage automatically. I have used it in another object. The code is as follows.
```
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/lib/integration/react";

const storageConfig = {
  key: "root", 
  storage: storage, 
  blacklist: [], 
};


const myPersistReducer = persistReducer(storageConfig, Reducer);
export const store = createStore(myPersistReducer);
export const persistor = persistStore(store);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router history={history}>
          <div style={sectionStyle}>
            <Main />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
}

```

Finally, I will store the JSON data in the database(MySQL or web database).





