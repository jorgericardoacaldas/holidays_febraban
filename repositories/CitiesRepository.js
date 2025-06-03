import db from '../config/database.js';

export async function findCity(state, city) {
 try {
    const query = `
      SELECT * FROM services.cities
      WHERE state = "` + state + `" AND name = "` + city + `"`;

    const [rows] = await db.query(query);
    return rows;  
  }
  catch (error) {
    console.error('Error finding city:', error);
    throw error;
  }
}

export async function createCity(name, state) {
    const query = `
        INSERT INTO services.cities (name, state, created_at) values ("`+name+`","`+ state + `",now())
    `;
  
    const {rows} = await db.query(query);
  
    return rows
}