
const bookSchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(), 
    categories : Joi.string().required(), 
  });
  
  const signUpSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });
const validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
  };

  const validateSignUp = (req, res, next) => {
    const { error } = signUpSchema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    next();
  };
  module.exports ={
    validateBook,
    validateSignUp
  }