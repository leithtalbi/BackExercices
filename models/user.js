var mongoose = require('mongoose');
const opts = { toObject: { virtuals: true },toJSON: { virtuals: true } };
const uniqueValidator = require('mongoose-unique-validator')

var userSchema = mongoose.Schema({
    firstName : {type : String,required : true},
    lastName : {type : String,required : true},
    role: {
        type: String,
        enum: ['admin', 'user'], 
        default: 'user' 
    },
    email : {type: String, required: true, unique : true},
    password: {type : String, required: true},
    
}, opts)

userSchema.virtual('name').get(function () {
    return this.firstName + ' ' + this.lastName;
});

userSchema.methods.toPublic = function () {
    const userObject = this.toObject();
    delete userObject.password; 
    console.log(userObject.name)
    return userObject;
}

userSchema.plugin(uniqueValidator)
module.exports = mongoose.model('User', userSchema);