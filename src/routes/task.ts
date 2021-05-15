import { Request, Response, Router } from "express";
import Company from "../entities/Company";
import Project from "../entities/Project";
import Student from '../entities/Student';
import Task from '../entities/Task'
import isCompany from "../middleware/isCompany";
import isStudent from '../middleware/isStudent'
import user from '../middleware/user'

/*
*
* COMPANY RELATED FUNCTIONS !!!
*
*/

const createProjectTask = async (req:Request, res: Response) => {
    const {id,name,description,studentId} = req.body;
    let errors : any = {};

    if(!name) errors.name = 'Name must not be empty';
    if(!description) errors.description = 'Description must not be empty'
    if(!studentId) errors.student = 'You must provide a student'

    if(Object.keys(errors).length>0) return res.status(400).json(errors);

    try{
        const project = await Project.findOneOrFail({id});
        const student = await Student.findOneOrFail({id:studentId});

        const task = new Task({name,description,status:"To do",project,student});

        await task.save();

        return res.status(200).json(task);
    }catch(err){
        return res.status(500).json({error: 'Ahh... Something went wrong'});
    }
}

const getProjectTasks = async (req: Request,res: Response) => {
    const {projectId} = req.body;

    try{
        let tasks = await Task.find({relations: ["student"]});
        tasks = tasks.filter((task) => task.projectId === projectId);

        if(!tasks) return res.status(404).json({error: 'Not found'});

        return res.status(200).json(tasks);
    }catch(err){
        return res.status(500).json({error: "Ahh... Something went wrong"});
    }
}

const changeTaskStatus = async(req:Request,res:Response) => {
    const {id,status} = req.body;

    try{
        console.log("Hello");
        const task = await Task.findOneOrFail({id});
        console.log(task);

        task.status = status;
        await task.save();

        return res.status(200).json(task);
    }catch(e){
        return res.status(500).json({error: 'Ahh... Something went wrong'});
    }
}

const router = Router();

router.post('/create',user,isCompany,createProjectTask);
router.put('/change',user,changeTaskStatus);
router.get('/',user,getProjectTasks);


export default router;