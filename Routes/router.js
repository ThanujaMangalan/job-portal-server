const express= require('express')
const router = new express.Router()
const userContoller = require('../Controller/userController')
const companyContoller = require('../Controller/companyController')
const jobController = require('../Controller/JobController')
const applicationController = require('../Controller/applicationController')
const savedJobController = require('../Controller/savedJobController')
const jwtMiddleware = require('../Middlewares/jwtMiddleware')
const multerMiddleware = require('../Middlewares/multerMiddleware')

//User
router.post('/register',userContoller.registercontroller)
router.post('/login',userContoller.loginController)
router.put('/update',jwtMiddleware,multerMiddleware.single('profilePhoto'),userContoller.updateUserController)
//company
router.post('/company/register',jwtMiddleware,companyContoller.registerCompany)
router.get('/company/get',jwtMiddleware,companyContoller.getCompany)
router.get('/company/get/:id',jwtMiddleware,companyContoller.getCompanyById)
router.put('/company/update/:id',jwtMiddleware,multerMiddleware.single('logo'),companyContoller.updateCompany)
router.delete('/company/:id/remove',jwtMiddleware,companyContoller.deleteCompanyController)

//jobs
router.post('/jobs/addjob',jwtMiddleware,jobController.addJobController)
router.get('/homeproject',jobController.homePageController)
router.get('/jobs/getjob',jobController.allJobController)
router.get('/jobs/getadmin',jwtMiddleware,jobController.getAminJobController)
router.get('/jobs/get/:id',jobController.getJobByIdController)
router.delete('/jobs/:id/remove',jwtMiddleware,jobController.deleteJobController)

// applications
router.post('/jobs/:id/apply', jwtMiddleware, applicationController.applyToJob)
router.get('/applications/my', jwtMiddleware, applicationController.getMyApplications)
router.get('/jobs/:id/application-status', jwtMiddleware, applicationController.checkApplicationStatus)
router.get('/applications/recruiter', jwtMiddleware, applicationController.getRecruiterApplications)
router.put('/applications/:id/status', jwtMiddleware, applicationController.updateApplicationStatus)

// saved jobs
router.post('/jobs/:id/save', jwtMiddleware, savedJobController.saveJob)
router.get('/jobs/saved', jwtMiddleware, savedJobController.getSavedJobs)
router.delete('/jobs/:id/save', jwtMiddleware, savedJobController.unsaveJob)

module.exports =router