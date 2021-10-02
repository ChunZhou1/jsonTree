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

2:  **api.TSX:** under the **"client"** directory
    The file contains all the API functions which are used by other files. The file includes ajax function, Node operation functions and data validation functions.



