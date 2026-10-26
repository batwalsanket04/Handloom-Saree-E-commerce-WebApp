 import User from "./userModel.js";
 import Saree from "./sareeModel.js";
 import Wishlist from "./wishlist.js";
 import Order from "./orderModel.js";
 import RefreshToken from "./refreshtoken.js";


// Seller → Sarees
User.hasMany(Saree, {
    foreignKey: "sellerId",
});

Saree.belongsTo(User, {
    foreignKey: "sellerId",
    as: "seller",
});

// Wishlist
User.belongsToMany(Saree, {
    through: Wishlist,
    foreignKey: "userId",
    otherKey: "sareeId",
});

Saree.belongsToMany(User, {
    through: Wishlist,
    foreignKey: "sareeId",
    otherKey: "userId",
});

// User -> Orders
User.hasMany(Order, {
    foreignKey: "userId",
});

Order.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

User.hasMany(RefreshToken,{
    foreignKey:"userId",
});


RefreshToken.belongsTo(User,{
    foreignKey:"userId"
});


export { User, Saree, Wishlist,Order};