import Joi from "joi";

const emptyBodySchema = Joi.object({});
 


const phoneRegex = /^[6-9]\d{9}$/;

const passwordRegex =
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,128}$/;


export const registerSchema = Joi.object({

name: Joi.string()
.trim()
.min(2)
.max(255)
.required()
.messages({
"string.empty":"Name is required",
"string.min":"Name must contain minimum 2 characters"
}),


email: Joi.string()
.trim()
.email()
.lowercase()
.required()
.messages({
"string.email":"Please enter valid email",
"string.empty":"Email is required"
}),


mobile:Joi.string()
.pattern(phoneRegex)
.messages({
"string.pattern.base":"Please enter valid 10 digit mobile number"
}),


password:Joi.string()
.pattern(passwordRegex)
.required()
.messages({

"string.pattern.base":
"Password must contain 8 characters with uppercase, lowercase, number and special character",

"string.empty":
"Password is required"

})

})
.custom((value,helpers)=>{

if(!value.email && !value.mobile){

return helpers.message(
"Either email or mobile number is required"
);

}

return value;

});



export const loginSchema = Joi.object({

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required()
    .messages({
      "string.email": "Please enter a valid email",
      "string.empty": "Email is required"
    }),

  password: Joi.string()
    .min(1)
    .max(128)
    .required()
    .messages({
      "string.empty": "Password is required"
    })

});

export const adminLoginSchema = loginSchema;
export const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid("user", "seller", "admin").required(),
});

export const refreshTokenSchema = emptyBodySchema;
export const logoutSchema = emptyBodySchema;
