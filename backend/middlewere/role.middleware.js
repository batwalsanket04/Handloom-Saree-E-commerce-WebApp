const authorizeRole = (...roles)=>{

return (req,res,next)=>{


if(!req.userRole){

return res.status(403).json({
success:false,
message:"Role missing"
});

}


if(!roles.includes(req.userRole)){

return res.status(403).json({
success:false,
message:"Access denied"
});

}


next();


}

}


export default authorizeRole;