import pool from '../config/db';

export const createItem = async (itemData: any) => {
  const {
    userId,
    title,
    description,
    type,
    category,
    price,
    offering,
    lookingFor,
    images,
    latitude,
    longitude,
  } = itemData;

  const query = `
    INSERT INTO items 
    (user_id, title, description, type, category, price, offering, looking_for, images, latitude, longitude)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, title, description, type, category, price, status, created_at;
  `;

  const values = [
    userId,
    title,
    description,
    type,
    category,
    price,
    offering,
    lookingFor,
    images,
    latitude,
    longitude,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getItemsByUser = async (userId: number) => {
  const query = `SELECT * FROM items WHERE user_id = $1 ORDER BY created_at DESC`;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

export const getAllItems = async () => {
  const query = `
    SELECT 
      items.id,
      items.title,
      items.description,
      items.type,
      items.category,
      items.price,
      items.offering,
      items.looking_for AS "lookingFor",
      items.images,
      items.latitude,
      items.longitude,
      items.created_at AS "createdAt",
      users.name AS "userName",
      users.city AS "userCity",
      users.state AS "userState",
      users.cep AS "userCep",
      users.street AS "userStreet",
      users.number AS "userNumber",
      users.neighborhood AS "userNeighborhood",
      users.phone AS "userPhone",
      users.avatar AS "userAvatar"
    FROM items
    JOIN users ON items.user_id = users.id
    ORDER BY items.created_at DESC;
  `;
  const result = await pool.query(query);
  return result.rows;
};
