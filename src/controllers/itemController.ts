import { Request, Response } from 'express';
import { createItem, getItemsByUser, getAllItems } from '../models/itemModel';
import { findUserById } from '../models/userModel';
import pool from '../config/db';

export const createItemController = async (req: Request, res: Response) => {
  try {
    const userId = req.body.userId;

    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const latitude = user.latitude;
    const longitude = user.longitude;

    const itemData = { ...req.body, userId, latitude, longitude };

    const newItem = await createItem(itemData);
    return res.status(201).json(newItem);
  } catch (error) {
    console.error('Erro ao criar item:', error);
    return res.status(500).json({ message: 'Erro ao criar item' });
  }
};

export const getItemsByUserController = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    const items = await getItemsByUser(userId);
    return res.status(200).json(items);
  } catch (error) {
    console.error('Erro ao obter itens:', error);
    return res.status(500).json({ message: 'Erro ao obter itens' });
  }
};

export const getAllItemsController = async (req: Request, res: Response) => {
  try {
    const items = await getAllItems();
    return res.status(200).json(items);
  } catch (error) {
    console.error('Erro ao obter todos os itens:', error);
    return res.status(500).json({ message: 'Erro ao obter todos os itens' });
  }
};

export const getItemByIdController = async (req: Request, res: Response) => {
  try {
    const itemId = parseInt(req.params.id, 10);

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
      WHERE items.id = $1
    `;

    const result = await pool.query(query, [itemId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Item não encontrado' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao buscar o item:', error);
    return res.status(500).json({ message: 'Erro ao buscar o item' });
  }
};