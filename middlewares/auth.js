const jwt = require("jsonwebtoken")
const User = require('../models/user')
module.exports.loggedMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET")
    const userId = decodedToken.userId
    User.findOne({_id: userId}).then((user) => {
      if(user){
        req.auth = {
          userId: userId,
          role : user.role
      }
      next()
    }
    else{
         res.status(401).json({message: "User doesn't exist"})
    }
  }).catch ((error) => {
    res.status(500).json({ error: error.message })})
}
catch(error){
  res.status(401).json({error: error.message})
}
}
  

module.exports.isAdmin = (req,res,next) => {
  try {
    if(req.auth.role === "admin"){
      next()
    }
    else{
      res.status(403).json({ message: "Access refused. you are not an admin !!"})
    }
  } catch (e){
    res.status(401).json({error: error.message})
  }
}