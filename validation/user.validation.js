
import Joi from "joi"

const signUpValidationSchema = Joi.object({
  fName:Joi.string().required(),
  lName:Joi.string().required(),
  userName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .required(),
  gender: Joi.string(),
    
  age: Joi.number(),
  phone: Joi.string(),
  isVerified: Joi.bool().required(),
  createdTasks: Joi.array().items(Joi.string()),
  assignedTasks: Joi.array().items(Joi.string()),
  isLogout: Joi.bool(),
  isDeleted: Joi.bool().required()

});

const setPPicValidationSchema = Joi.object({

  pPic: Joi.string(),
  userID: Joi.string()

},
);

const signInValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required(),

});

const loginGoogleValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .required(),

});

export {
   signInValidationSchema,loginGoogleValidationSchema,
    signUpValidationSchema,setPPicValidationSchema
}
