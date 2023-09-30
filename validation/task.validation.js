import Joi from 'joi'


const taskValidationSchema = Joi.object({
    title:Joi.string().required(),
    description:Joi.string().required(),
    status: Joi.string().valid('toDo', 'doing', 'done').required(),
    creatorID: Joi.string(),
    assignedTo: Joi.string(),
    deadline: Joi.string().isoDate().required()
  
  });




  const updateTaskValidationSchema = Joi.object({
    id: Joi.string(),
    title:Joi.string(),
    description:Joi.string(),
    status: Joi.string().valid('toDo', 'doing', 'done'),
    creatorID: Joi.any().forbidden(),
    assignedTo: Joi.string(),
    deadline: Joi.string().isoDate()
  
  });


  export {taskValidationSchema,updateTaskValidationSchema}