import { NextFunction, Request, Response } from 'express'

import Company from '../entities/Company'
import Student from '../entities/Student'

export default async (_: Request, res: Response, next: NextFunction) => {
  try {
    const user : Student | Company | undefined = res.locals.user
    const type : "STUDENT" | "COMPANY" | undefined = res.locals.type

    if(!user) throw new Error('Not authenticated')
    if(!type) throw new Error('Not authenticated');

    if(type === 'COMPANY'){
      return res.status(403).json({error: 'Access forbidden.'});
    }

    return next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({error: 'Not authenticated'})
  }
}