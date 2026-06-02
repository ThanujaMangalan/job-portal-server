const jobs = require('../Models/JobModel')
//admin
exports.addJobController = async (req,res)=>{
    console.log("inside addJobcontroller");
    const userId = req.userId
    console.log(userId);
    
    const {title,description,requirements,salary,experience,location,jobType,position,companyId} = req.body
   
    try {
       
            const newJob = new jobs({
                title,
                description,
                requirements:requirements.split(","),
                salary:Number(salary),
                experience,
                location,
                jobType,
                position,
                company:companyId,
                created_by:userId
            })
            await newJob.save()
            res.status(200).json(newJob)
       
    } catch (err) {
        res.status(401).json(err)
    
    }

    

}

exports.deleteJobController = async (req,res)=>{
    console.log("inside deleteJobcontroller");
    const {id} = req.params

    try {
        const deleteJob = await jobs.findByIdAndDelete({_id:id})
        res.status(200).json(deleteJob)
    } catch (err) {
        res.status(401).json(err)
    
    }

    

}

exports.homePageController = async (req,res) =>{
    console.log("iside homePagecontroller");
   
    try{
        const allHomeProject = await jobs.find()
            .populate({ path: "company" })
            .sort({ createdAt: -1 })
            .limit(6)
        res.status(200).json(allHomeProject)
     
    }catch(err){
        res.status(401).json(err)
    }

}
//student
exports.allJobController = async (req,res)=>{
    console.log("inside AllJobcontroller");
    try {
    const keyword = req.query.keyword || ""
    const query ={
        $or:[{title:{$regex: keyword,$options: "i"}},
            {description: {$regex: keyword, $options:"i"}}

            ]}
    
        const job = await jobs.find(query).populate({
            path:"company"
        }).sort({createdAt: -1})
        res.status(200).json(job)
    } catch (err) {
        res.status(401).json(err)
    
    }

 }

//student
exports.getJobByIdController = async (req,res)=>{
    console.log("inside getJbcontroller");
    const jobId = req.params.id

    try {
        const job = await jobs.findById(jobId).populate({ path: "company" })
        if (!job) {
            return res.status(404).json({ message: "Job not found" })
        }
        res.status(200).json(job)
    } catch (err) {
        res.status(401).json(err)
    
    }

    

}
//admin
exports.getAminJobController = async (req,res)=>{
    console.log("inside AllJobcontroller");
    const adminId = req.userId

    try {
        const job = await jobs.find({created_by:adminId}).populate({
            path:'company'
        })
        res.status(200).json(job)
    } catch (err) {
        res.status(401).json(err)
    
    }

    

}






