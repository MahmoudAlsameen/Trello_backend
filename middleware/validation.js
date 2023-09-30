



const userValidation = (schema,source) => {
    return   (req, res, next) => {
           let { error } = schema.validate(req[source]);
           if (error) {
               res.status(400).json({ message: "Err", error })
           } else {
               next()
           }
       }
   
   }
   
   
   export default userValidation