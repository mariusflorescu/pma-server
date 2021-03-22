import { getRepository, QueryFailedError } from 'typeorm';
import Student from '../entities/Student';
import connection from '../utils/connection';

describe('students', () => {

  beforeAll(async () => {
    await connection.create();
  });
  
  afterAll(async () => {
    await connection.close();
  });
  
  beforeEach(async () => {
    await connection.clear();
  });

  it('Creates student Marius', async () => {
    await getRepository(Student).insert({
      "username":"marius",
      "email":"mariusflorescu23@icloud.com",
      "password":"ParolaMea1234",
      "firstname":"Marius",
      "lastname":"Florescu",
      "github_username":"mariusflorescu"
    })

    let student = await getRepository(Student).find({
      where:{
        firstname:"Marius"
      }
    })

    expect(student[0].firstname).toBe("Marius");
  });

  it('Creates student Victor', async () => {
    await getRepository(Student).insert({
      "username":"victor27",
      "email":"victorcerna@gmail.com",
      "password":"ParolaMea1234",
      "firstname":"Victor",
      "lastname":"Cerna",
      "github_username":"victorcerna27"
    })

    let student = await getRepository(Student).find({
      where:{
        lastname:"Cerna"
      }
    })

    expect(student[0].lastname).toBe("Cerna");
  });
  
  it('Creates student dorel2', async () => {
    await getRepository(Student).insert({
      "username":"dorel2",
      "email":"dorel2@test.com",
      "password":"parola123",
      "firstname":"Dorelu",
      "lastname":"Delatest",
      "github_username":"doreltester"
    })

    let dorel = await getRepository(Student).find({
      where:{
        email:"dorel2@test.com"
      }
    })

    expect(dorel[0].email).toBe("dorel2@test.com");
  });

  it('Creates student dorelul', async () => {
    await getRepository(Student).insert({
      "username":"dorelul",
      "email":"dorel@test.com",
      "password":"parola123",
      "firstname":"Dorelu",
      "lastname":"Delatest",
      "github_username":"doreltester"
    })

    let dorel = await getRepository(Student).find({
      where:{
        username:"dorelul"
      }
    })

    expect(dorel[0].username).toBe("dorelul");
  });

  it('Creates student John', async () => {
    await getRepository(Student).insert({
      "username":"johndoe",
      "email":"johndoe123@mail.me",
      "password":"ParolaMea1234",
      "firstname":"John",
      "lastname":"Doe",
      "github_username":"johndoe9"
    })

    let student = await getRepository(Student).find({
      where:{
        github_username:"johndoe9"
      }
    })

    expect(student[0].github_username).toBe("johndoe9");
  });
})