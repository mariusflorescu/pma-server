import { Request, Response, Router } from "express";
import Student from '../entities/Student';
import Company from '../entities/Company'

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

const router = Router();

router.get('/',getAll);
router.get('/students',getStudents);
router.get('/companies',getCompanies);
router.get('/student/:id',getStudentById);
router.get('/company/:id',getCompanyById);

export default router;