import { validate,isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import cookie from 'cookie';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import Student from '../entities/Student';
import Company from '../entities/Company'


const mapErrors = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1]
    return prev
  }, {})
}

const register = async (req:Request,res:Response) => {
  const {type,data} = req.body;
  const {username,email,password,confirmPassword} = data;

  let errors:any = {};

  if(password !== confirmPassword) errors.confirmPassword = 'Passwords must match';

  let isUsernameAvailable:Student|Company;
  let isEmailAvailable:Student|Company;

  isUsernameAvailable= await Student.findOne({username});
  isEmailAvailable = await Student.findOne({email});

  if(isUsernameAvailable) errors.username = 'Username taken';
  if(isEmailAvailable) errors.email = 'Email taken';

  isUsernameAvailable = await Company.findOne({username});
  isEmailAvailable = await Company.findOne({email});

  if(isUsernameAvailable) errors.username = 'Username taken';
  if(isEmailAvailable) errors.email = 'Email taken';

  if(Object.keys(errors).length>0){
    return res.status(400).json(errors);
  }

  if(type === 'STUDENT'){
    const {firstname,lastname,github_username,description} = data;
    if(firstname.trim() === '') errors.firstname = 'Firstname must not be empty'
    if(lastname.trim() === '') errors.lastname = 'Lastname must not be empty'
    if(github_username.trim() === '') errors.github_username = 'Github username must not be empty'

    if(Object.keys(errors).length > 0){
      return res.status(400).json(errors);
    }
  
    try {
      const student = new Student({username,email,password,firstname,lastname,github_username,description})
      errors = await validate(student);

      if(errors.length>0) return res.status(400).json(mapErrors(errors));

      await student.save();
      return res.json(student);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }

  } else if (type === 'COMPANY'){
      const {name,website,description} = data;

      if(name.trim() === '') errors.name='Company name must not be empty'
      if(website.trim() === '') errors.website='Website must not be empty'

      if(Object.keys(errors).length > 0){
        return res.status(400).json(errors);
      }

      try {
        const company = new Company({username,email,password,name,website,description})
        errors = await validate(company);

        if(errors.length>0) return res.status(400).json(mapErrors(errors));

        await company.save();

        return res.json(company);
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }

    } else {
      return res.status(400).json({error: 'Not a valid type'});
    } 
}

const login = async (req:Request,res:Response) => {
  const {username,password} = req.body;

  try {
    let errors:any = {};

    if(isEmpty(username)) errors.username = 'Must not be empty'
    if(isEmpty(password)) errors.password = 'Must not be empty'

    if(Object.keys(errors).length > 0) return res.status(400).json(errors);

    const student = await Student.findOne({username});
    const company = await Company.findOne({username});

    if(!student && !company) return res.status(401).json({password:'Invalid credentials'});

    if(student) {
      const hashedPass = await bcrypt.compare(password,student.password);

      if(!hashedPass) return res.status(401).json({password:'Invalid credentials'});

      const type = "STUDENT"
      const token = jwt.sign({username,type},process.env.JWT_SECRET);
      res.set('Set-Cookie', cookie.serialize('token',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600*24*30,
        path: '/'
      }))

      return res.json(student);

    } else {
      const hashedPass = await bcrypt.compare(password, company.password);

      if(!hashedPass) return res.status(401).json({password:'Invalid credentials'});
      
      const type = "COMPANY"
      const token = jwt.sign({username,type},process.env.JWT_SECRET);
      res.set('Set-Cookie', cookie.serialize('token',token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600*24*30,
        path: '/'
      }))

      return res.json(company);
    }

  } catch (err) {
    console.log(err);
    return res.status(500).json({error:'Something went wrong...'});
  }
}

const me = async (req:Request,res:Response) => {
  try {
    const token = req.cookies.token;

    if(!token) return res.status(401).json({error:'Not authenticated'});

    const {username}:any = jwt.verify(token,process.env.JWT_SECRET);
    console.log("HELLO")
    const student = await Student.findOne({username});
    if(student) {
      return res.json({type:"STUDENT",data:student})
    };

    const company = await Company.findOne({username});
    if(company){
      return res.json({type:"COMPANY",data:company});
    }

    return res.status(404).json('Account no longer existing');
  } catch (err) {
    console.log(err);
    return res.status(401).json({error:'Not authenticated'});
  }
}

const logout = async (_: Request, res: Response) => {
  res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
      })
  );

  return res.status(200).json({ success: true });
};

const router = Router()
router.post('/register',register);
router.post('/login',login);
router.get('/logout',logout);
router.get('/me',me);

export default router;