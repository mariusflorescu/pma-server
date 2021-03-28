import {createConnection, getConnection} from 'typeorm';
import Company from '../entities/Company';
import Student from '../entities/Student';

const connection = {
  async create(){
    await createConnection({
        type: "postgres",
        username: "mariusflorescu",
        password: "root",
        database: "pmatest",
        dropSchema: true,
        entities: [Student,Company],
        synchronize: true,
        logging: false
    });
  },

  async close(){
    await getConnection().close(); 
  },

  async clear(){
    const connection = getConnection();
    const entities = connection.entityMetadatas;

    entities.forEach(async (entity) => {
      const repository = connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName}`);
    });
  },
};
export default connection;