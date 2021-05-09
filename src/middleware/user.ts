import {NextFunction,Request,Response} from 'express'
import jwt from 'jsonwebtoken'

import Company from '../entities/Company'
import Student from '../entities/Student'

export default async (req:Request,res:Response,next:NextFunction) => {
  try {
    const token = req.cookies.token;
    if(!token) return next();

    const {username,type}:any = jwt.verify(token,process.env.JWT_SECRET!)
    let user : Company | Student;
    if(type === 'STUDENT'){
      user = await Student.findOne({username})
    } else if(type === 'COMPANY'){
      user = await Company.findOne({username})
    } else {
      return res.status(400);
    }

    res.locals.user = user;
    res.locals.type = (type === 'STUDENT') ? 'STUDENT' : 'COMPANY';

    return next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({error: 'Not authenticated'})
  }
}