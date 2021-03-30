import { Request, Response, Router } from "express";
import Project from "../entities/Project";
import isCompany from "../middleware/isCompany";
import isStudent from '../middleware/isStudent'
import user from '../middleware/user'

const getAllProjects = async (req:Request,res:Response) => {
  try {
    const projects = await Project.find();
    if(!projects) return res.status(400);

    return res.json(projects);
  } catch (err) {
    console.log(err);
    return res.status(400).json({error: 'Ahh...Something went wrong'});
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
  const id = req.params;

  let errors : any = {};

  if(status !== 'open' && status !== 'closed') errors.status = 'Status must be either open or closed';

  if(Object.keys(errors).length>0) return res.status(400).json(errors);

  try {
    const project = await Project.findOne({
      where: id
    });

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
  const id = req.params
  try {
    const project = await Project.findOne({
      where: id
    })

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

const router = Router();

router.get('/',user,isStudent,getAllProjects) //TODO: isStudent - middleware
router.post('/create',user,isCompany,createProject);
router.put('/edit/:id',user,isCompany,editProject);
router.delete('/delete/:id',user,isCompany,deleteProject)

export default router;