import { Request, Response, Router } from "express";
import Student from '../entities/Student';
import Company from '../entities/Company'
import isStudent from "../middleware/isStudent";
import user from "../middleware/user";
import isCompany from "../middleware/isCompany";

const getAll = async (_:Request,res:Response) => {
  const students = await Student.find();
  const companies = await Company.find();

  const all = {
    students,
    companies
  }

  return res.json(all);
}

const getStudents = async (_:Request,res:Response) => {
  const students = await Student.find();

  return res.json(students);
}

const getCompanies = async (_:Request,res:Response) => {
  const companies = await Company.find();

  return res.json(companies);
}

const getStudentById = async (req:Request,res:Response) => {
  const id = req.params.id;
  const student = await Student.findOneOrFail({id});

  return res.json(student);
}

const getCompanyById = async (req:Request,res:Response) => {
  const id = req.params.id;
  const company = await Company.findOneOrFail({id});

  return res.json(company);
}

const updateStudentProfileDescription = async (req:Request,res:Response) => {
  const {id,description} = req.body;

  try{
    const student = await Student.findOneOrFail({id});

    if(res.locals.user.id !== id){
      return res.status(401).json({error: "Not allowed"});
    }

    student.description = description;
    await student.save();

    return res.status(200).json(student);
  }catch(e){
    return res.status(500).json({error: 'Ahh... Something went wrong'});
  }
}

const updateCompanyProfileDescription = async (req:Request,res:Response) => {
  const {id,description} = req.body;

  try{
    const company = await Company.findOneOrFail({id});

    if(res.locals.user.id !== id){
      return res.status(401).json({error: "Not allowed"});
    }

    company.description = description;
    await company.save();

    return res.status(200).json(company);
  }catch (e){
    return res.status(500).json({error: 'Ahh... Something went wrong'});
  }
}

const router = Router();

router.get('/',getAll);
router.get('/students',getStudents);
router.get('/companies',getCompanies);
router.get('/student/:id',getStudentById);
router.get('/company/:id',getCompanyById);
router.put('/student/description',user,isStudent,updateStudentProfileDescription);
router.put('/company/description',user,isCompany,updateCompanyProfileDescription);

export default router;