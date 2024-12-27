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

export const updateUserById = async (id: number, updates: any) => {
  const { name, email, phone, location, avatar } = updates;

  const query = `
    UPDATE users
    SET name = $1, email = $2, phone = $3, avatar = $4, city = $5, state = $6, cep = $7, street = $8, number = $9, neighborhood = $10
    WHERE id = $11
    RETURNING id, name, email, phone, avatar, city, state, cep, street, number, neighborhood;
  `;

  const values = [
    name,
    email,
    phone,
    avatar,
    location?.city,
    location?.state,
    location?.cep,
    location?.street,
    location?.number,
    location?.neighborhood,
    id,
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};


export const findUserById = async (id: number) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};