import db from '../config/database.js';

export async function createHoliday(cityId, day, month, year, name, type) {
    const query = `
        INSERT INTO sic.holidays (Created_At, Status, CityId, Day, Month, Year, Name, Type) values (now(), true, `+cityId+`,`+ day + `,`+ month + `,`+ year + `,"` + name + `",`+ type+`)
    `;
  
    const {rows} = await db.query(query);
  
    return rows
}

export async function findHoliday(day, month, year, cityId) {
    const query = `
      SELECT * FROM sic.holidays
      WHERE Day = `+ day + ` AND Month = `+ month +` AND Year = `+ year +` AND CityId = ` + cityId;
  
    const {rows} = await db.query(query);
  
    return rows
}
