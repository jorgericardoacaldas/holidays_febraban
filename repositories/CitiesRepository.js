import db from '../config/database.js';

export async function findCity(state, city) {
 try {
    const query = `
      SELECT * FROM sic.cities
      WHERE State = "` + state + `" AND Name = "` + city + `"`;

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
        INSERT INTO sic.cities (Name, State, Created_At) values ("`+name+`","`+ state + `",now())
    `;
  
    const {rows} = await db.query(query);
  
    return rows
}