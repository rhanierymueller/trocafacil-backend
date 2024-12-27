import pool from '../config/db';

export const createUser = async (userData: any) => {
  const {
    name, email, password, cep, street, number, neighborhood, city, state,
  } = userData;

  const query = `
    INSERT INTO users (name, email, password, cep, street, number, neighborhood, city, state)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING id, name, email
  `;
  const values = [name, email, password, cep, street, number, neighborhood, city, state];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserByEmail = async (email: string) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};