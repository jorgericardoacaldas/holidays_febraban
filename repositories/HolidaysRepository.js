import db from '../config/database.js';

export async function createHoliday(cityId, day, month, year, name, type) {
    const query = `
        INSERT INTO services.holidays (created_at, status, city_id, day, month, year, name, type) values (now(), true, `+cityId+`,`+ day + `,`+ month + `,`+ year + `,"` + name + `",`+ type+`)
    `;
  
    const {rows} = await db.query(query);
  
    return rows
}

export async function findHoliday(day, month, year, cityId) {
    const query = `
      SELECT * FROM services.holidays
      WHERE day = `+ day + ` AND month = `+ month +` AND year = `+ year +` AND city_id = ` + cityId;
  
    const {rows} = await db.query(query);
  
    return rows
}
