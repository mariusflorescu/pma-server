import { getRepository } from 'typeorm';
import Company from '../entities/Company';
import connection from '../utils/connection';

describe('companies', () => {
  beforeAll(async () => {
    await connection.create();
  });
  
  afterAll(async () => {
    await connection.close();
  });
  
  beforeEach(async () => {
    await connection.clear();
  });

  it('Creates company TestCom', async () => {
    await getRepository(Company).insert({
      "username":"testcom",
      "email":"testcom@mail.com",
      "password":"ParolaMea1234",
      "name":"TestComp",
      "website":"www.website.com"
    })

    let company = await getRepository(Company).find({
      where:{
        username: "testcom"
      }
    })

    expect(company[0].username).toBe("testcom");
  });

  it('Creates company RoTesters', async () => {
    await getRepository(Company).insert({
      "username":"rotesters",
      "email":"rotesters@gmail.com",
      "password":"passwordrotesters",
      "name":"RoTesters",
      "website":"www.rotesters.com"
    })

    let company = await getRepository(Company).find({
      where:{
        email: "rotesters@gmail.com"
      }
    })

    expect(company[0].email).toBe("rotesters@gmail.com");
  });

  it('Creates company CompareSize', async () => {
    await getRepository(Company).insert({
      "username":"comparesize",
      "email":"hello@comparesize.com",
      "password":"ParolaMea1234x",
      "name":"CompareSize",
      "website":"www.comparesize.co.uk"
    })

    let company = await getRepository(Company).find({
      where:{
        name: "CompareSize"
      }
    })

    expect(company[0].name).toBe("CompareSize");
  });

  //should fail
  it('Fails to create company TestCom', async () => {
    try {
      await getRepository(Company).insert({
        "email":"testcom@mail.com",
        "password":"ParolaMea1234",
        "name":"TestComp",
        "website":"www.website.com"
      })
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  });

  it('Fails to create company', async () => {
    try {
      await getRepository(Company).insert({
        "username":"testcom",
        "email":"testcom@mail.com",
        "name":"TestComp",
        "website":"www.website.com"
      })
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  });

  // it('Fails to create company', async () => {
  //   try {
  //     await getRepository(Company).insert({
  //       "username":"testCom",
  //       "email":"testcom@mail.com",
  //       "password":"ParolaMea1234",
  //     })
  //   } catch (err) {
  //     expect(err).toBeInstanceOf(Error)
  //   }
  // });
})