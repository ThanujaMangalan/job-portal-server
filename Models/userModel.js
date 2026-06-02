const {default:mongoose} = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname:{
        type : String,
        required:true
    },
    email:{
        type : String,
        required:true,
        unique:true
    },
    phoneNumber:{
        type : String,
        required:true
    },
    password:{
        type : String,
        required:true
    },
    role:{
        type : String,
        enum:['student','recruiter'],
        required:true
    },
    bio:{
        type:String
    },
    profile:{
        skills:   {
            type:[String]
        },
     
        profilePhoto:{
            type:String,
            default:""
        }
   
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
    }]

})

const User = mongoose.model("User",userSchema)
module.exports = User