# JSON Tree Display
# running instructions:

1: Open the Terminal under the **Client** directory.

2: **npm install**

3: **npm start**

# running automatic testing:

1: Open the Terminal under the **Client** directory.

2: **npx cypress open**

# Summary of the assignment

The software is used to display and operate the JSON tree, You can edit, delete, add the node on the JSON tree.
But not all the node on the tree can be added and deleted. For example, **"price"** key can only be edited, Because 
the price value is not contained in the array, so I think the **"price"** key only has one value.

**About edit, delete, add node**
You can place the mouse on the **leaf node** on the tree and right click the mouse. The popup menu will be displayed.

Additionally, You can not delete all nodes under the parent node. Because if you do do, I can not add a node under this parent node as I do not know the
key name.

# software structure: #

The software includes files as follows:

1: **jsonTree.TSX:** main file, under **“components”** directory.he file contains the JsonTree component, which displays the whole JSON tree and operates node.

2:  **api.TSX:** under the **"client"** directory. The file contains all the API functions which are used by other files. The file includes ajax function, node operation functions and data validation functions.

3: **node.TSX** :under **“component”** directory.

The file contains the component used to display the leaf node (**LeafNode**) and the Parent node of the leaf node
(**SubNode**). The two types of components are called by (**JsonTree**) component.

4: **menu.TSX** under “**component**” directory.

The file contains the component used to display the popup menu and input dialog. The user uses these menus and dialogs
to input the parameter of the node. 

(**ModifyMenu**): used to input the parameter of the edit menu.
(**AddMenu**): used to input the parameter of the add menu.

The two components above are called by (**LeafNode**)

# Software algorithm #

The software uses a recursive component algorithm to display the whole JSON tree. The entire tree consists of many subtrees.
Each Jsontree component is a subtree.

The **JsonTree** component has three parameters:

**node**: current node of the trees.

**preNode** : the parent node of the current node.

**handleReflash**: callBack function, used to Refresh the whole tree.

Because Each component has props of current node and parent node. It is easy to operate the node(such as add, delete node) without 
query operation(such as recursive query)

# About automatic testing: # 

I created the automative testing issues under the “**Cypress/integration**” directory. The automative test includes show, add, delete and edit testing.
The test coverage is not 100%. I used mock http server to response the fixed JSON data in order to test.

# What will I do in the future: #

The first thing I will do is improving the rendering efficiency of the tree. I want to use React.memo to render the component, and I have almost done it. But there are some bugs in the program, and I will complete it if I have time. The React will render the tree only if the props of the component are changed. The code is as follows:
```
import { useState, useEffect,memo } from "react";

function comFun(
  nextProp: Readonly<React.PropsWithChildren<Nodes>>,
  preProp: Readonly<React.PropsWithChildren<Nodes>>
) {
  //current node. converted to string to compare
  return preProp.NodeStr === nextProp.NodeStr;
}

const JsonTree_p = memo(JsonTree, comFun);



```
The next thing I will do is storing JSON files to the local storage automatically. Suppose many of the other components will use the JSON. I will use Redux to store JSON data. The persist-redux can store the redux data to the local storage automatically. I have used it in another object. The code is as follows.
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

Finally, I will store the JSON data in the database(MySQL or web database). I think it is not difficult to do this.



