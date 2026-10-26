import User from "../models/userModel.js";
import RefreshToken from "../models/refreshtoken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";


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



const accessToken=createAccessToken(user);



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



const accessToken=createAccessToken(user);

const refreshToken=createRefreshToken(user);



// save refresh token

await RefreshToken.create({

userId:user.id,

token:refreshToken,

expiresAt:new Date(
Date.now()+7*24*60*60*1000
)

});



// cookie

res.cookie(
"refreshToken",
refreshToken,
{
httpOnly:true,
secure:false,
sameSite:"lax",
maxAge:7*24*60*60*1000
}

);



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



const storedToken =
await RefreshToken.findOne({

where:{
token,
revoked:false
}

});



if(!storedToken){

return handleError(
res,
403,
"Invalid refresh token"
);

}



const decoded = jwt.verify(
token,
process.env.JWT_REFRESH_SECRET
);



const user =
await User.findByPk(decoded.id);



if(!user){

return handleError(
res,
404,
"User not found"
);

}



const accessToken =
createAccessToken(user);



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

await RefreshToken.destroy({

where:{
token
}

});

}



res.clearCookie("refreshToken");



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


const user =
await User.findByPk(
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