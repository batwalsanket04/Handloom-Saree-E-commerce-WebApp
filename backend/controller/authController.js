import User from "../models/userModel.js";
import RefreshToken from "../models/refreshtoken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import { validateRefreshToken, generateAndStoreTokens, blacklistAccessToken, clearAuthCookies, revokeAllUserRefreshTokens, cacheUser } from "../Utils/redisAuth.js";


// Generate Access Token
const createAccessToken = (user)=>{

    return jwt.sign(
        {
            id:user.id,
            role:user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"15m"
        }
    );

};


// Generate Refresh Token
const createRefreshToken = (user)=>{

    return jwt.sign(
        {
            id:user.id
        },
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn:"7d"
        }
    );

};


const handleError=(res,status,message)=>{

return res.status(status).json({
    success:false,
    message
});

};



 

const registerUser = async(req,res,next)=>{

try{


const {
    name,
    email,
    password
}=req.body;


if(!name || !email || !password){

return handleError(
    res,
    400,
    "Name email password required"
);

}


if(!validator.isEmail(email)){

return handleError(
    res,
    400,
    "Invalid email"
);

}


const exists = await User.findOne({

where:{
    email:email.toLowerCase()
}

});


if(exists){

return handleError(
    res,
    409,
    "User already exists"
);

}


const hashPassword = await bcrypt.hash(
    password,
    10
);


const user = await User.create({

name:name.trim(),

email:email.toLowerCase(),

password:hashPassword,

role:"user"

});

// Generate tokens and store refresh token in Redis + PostgreSQL
const { accessToken } = await generateAndStoreTokens(user, res);


res.status(201).json({

success:true,

message:"User registered",

accessToken,


user:{
    id:user.id,
    name:user.name,
    email:user.email,
    role:user.role
}


});


}
catch(error){

next(error);

}


};


 

const loginUser = async(req,res,next)=>{

try{


const {
email,
password
}=req.body;


const user = await User.findOne({

where:{
    email:email.toLowerCase()
}

});


if(!user){

return handleError(
    res,
    401,
    "Invalid credentials"
);

}


const match = await bcrypt.compare(
    password,
    user.password
);


if(!match){

return handleError(
    res,
    401,
    "Invalid credentials"
);

}


// Generate tokens and store refresh token in Redis + PostgreSQL
const { accessToken } = await generateAndStoreTokens(user, res);


res.json({

success:true,

accessToken,

user:{
id:user.id,
name:user.name,
email:user.email,
role:user.role
}


});

}
catch(error){

next(error);

}


};

// ================= REFRESH TOKEN =================


const refreshToken = async(req,res,next)=>{

try{


const token=req.cookies.refreshToken;


if(!token){

return handleError(
res,
401,
"Refresh token missing"
);

}


// Use Redis-integrated validation (checks Redis cache first, falls back to PostgreSQL)
const { user, isValid, isRevoked, reason } = await validateRefreshToken(token);

if(!isValid || !user){

return handleError(
res,
403,
reason || "Invalid refresh token"
);

}


const accessToken = createAccessToken(user);


res.json({

success:true,
accessToken


});

}
catch(error){

next(error);

}


};


// ================= LOGOUT =================


const logout = async(req,res,next)=>{

try{


const token=req.cookies.refreshToken;


if(token){

// Revoke in PostgreSQL
await RefreshToken.destroy({
where:{
token
}
});

// Remove from Redis cache
await tokenCache.delRefreshToken(token);
}

// Blacklist the access token if present
const authHeader = req.headers.authorization;
if (authHeader) {
    const accessToken = authHeader.split(" ")[1];
    if (accessToken) {
        await blacklistAccessToken(accessToken);
    }
}

clearAuthCookies(res);


res.json({

success:true,
message:"Logout successful"


});

}
catch(error){

next(error);

}


};


// ================= PROFILE =================


const getProfile = async(req,res,next)=>{

try{


const user = await User.findByPk(
req.userId,
{
attributes:{
exclude:["password"]
}
}
);


if(!user){

return handleError(
res,
404,
"User not found"
);

}


res.json({

success:true,
user


});

}
catch(error){

next(error);

}


};


export {

registerUser,
loginUser,
refreshToken,
logout,
getProfile

};