var express = require("express");
var router = express.Router();
const User = require("../../../models/User/user");
const CustomOrders = require("../../../models/user/customOrders");
const CustomItems = require("../../../models/user/customItems");






//                                    ---------------------------/api/user/-----------------------------------

// ---/new--- for adding a new user  ***WORKING***

router.post("/new", (req, res, next) => {
    // create a new user from the query parameters
    User.create({
            name: req.query.name,
            role: req.query.role,
            customItems: [],
            customOrders: [],
        },
        (err, newUser) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    ErrorMessage: "The server threw an error",
                });
            } else {
                res.status(200).json(newUser);
            }
        }
    );
});

//return a user record ***working***
router.get("/", (req, res, next) => {
    User.findById(req.query.userID, (err, userData) => {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log(`orderData:   ${userData}`);
            res.status(200).json(userData);
        }
    });
});

// delete user***skipping because this would require a propagated delete through customItems and customOrders for each of the users items or Orders***
router.delete("/", (req, res, next) => {
    res.status(405).json({
        ErrorMessage: "You Currently cant delete a User.",
    });
});


//                           ----------------------------------- /api/user/customItem---------------------------------------
//return a customItem record
router.get("/customItem", (req, res, next) => {
    CustomItems.findById(req.query.itemID, (err, itemData) => {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log(`orderData:   ${itemData}`);
            res.status(200).json(itemData);
        }
    });
});


// ---/new--- for adding a new custom Item for a user ***WORKING***
// params : userID / businessId / menuItemID / customizations --- ?userID=''&businessId=''&menuItemId=''&customizations=[]

router.post("/customItem/new", (req, res, next) => {
    let userId = req.query.userID;
    //build the customItem data from the queryParameters
    let words = req.query.customizations.split(",");
    let customItemData = {

            ownerID: `${userId}`,
            businessID: `${req.query.businessId}`,
            menuItemID: `${req.query.menuItemId}`,
            customizations: words
        }
        // add the custom item to the custom item collection
    CustomItems.create(customItemData, (err, newCustomItem) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                ErrorMessage: "The server threw an error",
            });
        } else {
            //if we succesfuly create the new customItem > add id to user customItem Array
            User.findById(userId, (err, userObj) => {
                //update the user's customItem's array to contain the new customItem ID
                let newData = [String(newCustomItem._id), ...userObj.customItems];
                console.log('newData      ' + newData);
                let newVersion = userObj.customItems + 1;
                User.findByIdAndUpdate(userId, { customItems: newData }, (err, newUserData) => {
                    if (err) {
                        console.log(' issue updating newUserData > adding custom item ID');
                    } else {
                        console.log("newUserData" + newUserData);
                    }
                });
            });
            res.status(200).json(newCustomItem);
        }
    });
})

// ---/delete---- delete customItem ***WORKING***
// params : itemID / userID --- ?itemID=''&userID=''
router.delete("/customItem", (req, res, next) => {
    let userId = req.query.userID;
    CustomItems.findOneAndDelete({ _id: req.query.itemID }, (err) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                ErrorMessage: "Error deleting from customItems",
            });
        } else {
            User.findById(userId, (err, userObj) => {
                //update the user's customItem's array to remove the customItem ID
                let newUserObj = userObj.customItems;
                console.log(req.query.itemID);
                let index = newUserObj.indexOf(String(req.query.itemID));
                console.log("index" + index);
                console.log("newUserObj before splice     " + newUserObj);

                newUserObj.splice(index, 1);
                console.log("newUserObj after splice     " + newUserObj);

                User.findByIdAndUpdate(
                    userId, { customItems: newUserObj },
                    (err, newUserData) => {
                        if (err) {
                            console.log(
                                " issue updating newUserData > adding custom item ID"
                            );
                        } else {
                            console.log("newUserData" + newUserData);
                        }
                    }
                );
            });
            console.log("sucess");
            res.status(200).json({ success: "true" });
        }
    });
});

// ---/update---- update updatedItemCustomizations    ***WORKING***
// params : itemID / businessID / menuItemID / Customizations --- 
//         ?itemId=h54j5h4j?&businessID=2&menuItemID=2&customizations=[cheese, double bacon, sub sauce, pickles]
router.put("/customItem", async(req, res, next) => {
    CustomItems.findById(req.query.itemId, function(err, customItemObj) {
        if (err) {
            console.log(err);
        } else {
            customItemObj.customizations = req.query.customizations;
            customItemObj.businessID = req.query.businessID;
            customItemObj.menuItemID = req.query.menuItemID;


            CustomItems.findByIdAndUpdate(req.query.itemId, customItemObj, (err, updatedItem) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Updated Item : ", customItemObj);
                    console.log("sucess");
                    res.status(200).json({ success: "true" });
                }
            });
        }
    });
});



//                                  ------------------------------/api/user/customOrder-------------------------
//for retrieving a customOrder Record
// params : userID / customItems --- ?userID=''&customItems=''
router.get("/customOrder", (req, res, next) => {
    CustomOrders.findById(req.query.orderID, (err, orderData) => {
        if (err) {
            console.log("Error" + err);
        } else {
            console.log(`orderData:   ${orderData}`);
            res.status(200).json(orderData);
        }
    });
});

//for creating a new customOrder
// params : userID / customItems --- ?userID=''&customItems=''
// ---/new---   ***WORKING***
router.post("/customOrder/new", (req, res, next) => {
    let userId = req.query.userID;
    // build the customOrderData from the query string
    let customOrderData = {
        ownerID: `${userId}`,
        customItemsIds: `${req.query.customItems}`
    };
    //create a new customOrder in the collection and assign it to  the customOrderObj
    CustomOrders.create(customOrderData, (err, newCustomOrder) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                ErrorMessage: "The server threw an error",
            });
        } else {
            //update the users customOrders to include the new orderId
            User.findById(userId, (err, userObj) => {
                //update the user's customItem's array to contain the new customItem ID
                let newData = [String(newCustomOrder._id), ...userObj.customOrders];
                console.log(newData);
                User.findByIdAndUpdate(userId, { customOrders: newData }, (err, newUserData) => {
                    if (err) {
                        console.log(' issue updating newUserData > adding custom order ID');
                    } else {
                        console.log("newUserData" + newUserData);
                    }
                });
            });
            //return status code and new custom order data.
            res.status(200).json(newCustomOrder);
        }
    });
});

//for deleting a customOrder
// ---/delete---- delete customOrder
// params : orderID --- ?orderId=''
// add delte order from user ***WORKING***
router.delete("/customOrder", async(req, res, next) => {
    CustomOrders.findOneAndDelete({ _id: req.query.orderId }, (err, deletedOrder) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                ErrorMessage: "Error deleting from customItems",
            });
        } else {
            User.findById(deletedOrder.ownerID, (err, user) => {
                if (err) { console.log("Error" + err) } else {
                    console.log(`user.custom Orders    ${user.customOrders}`);
                    console.log(`req.query.id: ${req.query.orderId}`);
                    let index = user.customOrders.indexOf(req.query.orderId);
                    console.log(`index: ${index}`);

                    if (index !== -1) {
                        user.customOrders.splice(index, 1);
                    } else {
                        console.log(`index was -1, not splicing.`)
                    }
                    console.log(
                        `user.customOrders after splice: ${user.customOrders}`
                    );

                    User.findByIdAndUpdate(deletedOrder.ownerID, user, (err, updatedUserData) => {
                        err ? console.log("Error" + err) : console.log("userObjData " + updatedUserData)
                    });
                }
            });
            console.log("sucess");
            res.status(200).json({ success: "true" });
        }
    });
});



// ---/update---- update updatedOrderItems
// params : orderId --- ?itemId=''

router.put("/customOrder", async(req, res, next) => {
    CustomOrders.findById(req.query.orderID, (err, customOrderObj) => {
        if (err) {
            console.log(err);
        } else {
            console.log(customOrderObj);
            customOrderObj.customItemsIds = req.body.customItemIds;

            CustomOrders.findByIdAndUpdate(
                req.query.orderID,
                customOrderObj,
                (err, updatedItem) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Updated Item : ", customOrderObj);
                        console.log("sucess");
                        res.status(200).json({ success: "true" });
                    }
                }
            );
        }
    });
});



/* router.post("/shareOrder/:userID&:")*/
module.exports = router;