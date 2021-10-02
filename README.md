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



