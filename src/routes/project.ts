import { Request, Response, Router } from "express";
import Application from "../entities/Application";
import Company from "../entities/Company";
import Project from "../entities/Project";
import isCompany from "../middleware/isCompany";
import isStudent from '../middleware/isStudent'
import user from '../middleware/user'

/*
*
* STUDENT RELATED FUNCTIONS !!!
*
*/

const getAllProjects = async (_:Request,res:Response) => {
  try {
    const projects = await Project.find({relations:["applicants"]});

    return res.status(200).json(projects);
  } catch (err) {
    console.log(err);
    return res.status(400).json({error: 'Ahh...Something went wrong'});
  }
}

const applyToProject = async (req:Request,res:Response) => {
  const {id} = req.params;
  const student = res.locals.user;

  try {
    const project = await Project.findOne({id},{relations:["team"]})

    if(project.status === 'closed') return res.status(401).json({error:'Can not apply to closed projects'});

    //check if already applied
    const hasAppliedAlready = await Application.findOne({project,student});
    if(hasAppliedAlready) return res.status(400).json({error: 'Already applied'})

    //check if its already in a team.
    project.team.map((stud) => {
      if(stud.username === student.username) return res.status(401).json({error:'Already in a team'});
    })

    const application = new Application({status:'pending',student,project,username:student.username});
    
    await application.save();
    
    return res.json(application);
    
  } catch (err) {
    console.log(err);
    return res.status(400).json({error:'Project not found'})
  }
}

/*
*
* COMPANY RELATED FUNCTIONS !!!
*
*/

const getCompanyProjects = async (req:Request,res:Response) => {
  const company = res.locals.user;

  try {
    const projects = await Project.find({where: {username:company.username}, relations:["team","applicants"] });
    return res.json(projects);
  } catch (err) {
    console.log(err);
    return res.status(400).json({error:'Ahh...Something went bad'});
  }
}

const getCompanySpecificProjectDetails = async(req:Request,res:Response) => {
  const {id} = req.params;
  
  try {
    const project = await Project.findOne({where: {id}, relations:["team","applicants"] });
    return res.json(project);
  } catch (err) {
    console.log(err);
    return res.status(400).json({error:'Ahh...Something went bad'});
  }
} 

const createProject = async (req:Request,res:Response) => {
  const {name,description,status} = req.body;
  let errors : any = {};
  if(!name) errors.name = 'Name must not be empty';
  if(!description) errors.description = 'Description must not be empty'
  if(!status) errors.status = 'Status must not be empty';

  if(Object.keys(errors).length>0) return res.status(400).json(errors);

  if(status !== 'open' && status !== 'closed') errors.status = 'Status must be either open or closed';

  if(Object.keys(errors).length>0) return res.status(400).json(errors);

  try {
    const company = res.locals.user;
    const project = new Project({name,description,status,company});
    await project.save();

    return res.json(project);
  } catch (err) {
    console.log(err);
    return res.status(400).json({error: 'Ahh... Something went wrong'});
  }
}

const editProject = async(req:Request,res:Response) => {
  const {name,description,status} = req.body;
  const {id} = req.params;
  const company = res.locals.user;

  let errors : any = {};

  if(status !== 'open' && status !== 'closed') errors.status = 'Status must be either open or closed';

  if(Object.keys(errors).length>0) return res.status(400).json(errors);

  try {
    const project = await Project.findOneOrFail({id});

    //check if project owner
    if(company.username !== project.username) return res.status(401).json({error:'Access denied!'});

    if(name) project.name = name;
    if(description) project.description = description;
    if(status) project.status = status;

    await project.save();

    return res.json(project);
  } catch (err) {
    console.log(err);
    return res.status(400).json({error: 'Project not found...'})
  }
}

const deleteProject = async (req:Request,res:Response) => {
  const {id} = req.params;
  const company = res.locals.user;

  try {
    const project = await Project.findOneOrFail({id});

    //check if project owner
    if(company.username !== project.username) return res.status(401).json({error: 'Access denied'});

    await project.remove();

    return res.json({
      success:true,
      message: 'Project deleted successfully'
    })
  } catch (err) {
    console.log(err);
    return res.status(400).json({error: 'Project not found'})
  }
}

const getApplicants = async (req:Request,res:Response) => {
  const {id} = req.params;
  const company = res.locals.user;

  try {
    const project = await Project.findOneOrFail({id},{relations:["applicants","applicants.student"]});

    //check if project owner
    if(company.username !== project.username) return res.status(401).json({error:'Access denied'});

    return res.json(project.applicants);
  } catch (err) {
    console.log(err);
    return res.status(400).json({error:'Project not found'});
  }
}

const changeApplicationStatus = async (req:Request,res:Response) => {
  const {id} = req.params;
  const {status} = req.body;
  const company = res.locals.user;

  if(status !== 'pending' && status !== 'accepted' && status !== 'declined') return res.status(400).json({error:'Invalid status type'});

  try {
    const application = await Application.findOneOrFail({id},{relations:["project","student"]});
    
    //check if project owner
    if(company.username  !== application.project.username){
      return res.status(401).json({error: 'Access forbidden'});
    }

    if(status === application.status) return res.json(application);

    if(status === 'accepted'){
      const project = await Project.findOneOrFail({id:application.project.id},{relations:["team","applicants"]});
      const student = application.student;

      project.team.push(student);
      await project.save();
      await application.remove();

      return res.json(project);
    }

    if(status === 'declined'){
      await application.remove();

      return res.json({
        success: true,
        message: 'Application declined'
      })
    }

  } catch (err) {
    console.log(err);
    return res.status(400).json({error: 'Ahh...Something went bad'})
  }

}

const router = Router();

//
// --- STUDENT ROUTES
//
router.get('/all',user,isStudent,getAllProjects);
router.get('/:id/apply',user,isStudent,applyToProject);

//
// --- COMPANY ROUTES
//
router.post('/create',user,isCompany,createProject);
router.get('/:id',user,isCompany,getCompanySpecificProjectDetails); //where id is PROJECT ID
router.put('/:id/edit',user,isCompany,editProject); //where id is PROJECT ID
router.delete('/:id/delete',user,isCompany,deleteProject); //where id is PROJECT ID
router.get('/:id/applicants',user,isCompany,getApplicants); //where id is PROJECT ID
router.put('/application/:id',user,isCompany,changeApplicationStatus); //where id is APPLICATION ID
router.get('/',user,isCompany,getCompanyProjects);

export default router;