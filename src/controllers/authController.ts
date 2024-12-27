import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, findUserById, updateUserById } from '../models/userModel'; // Adicione findUserByEmail

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, cep, street, number, neighborhood, city, state } = req.body;

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email já registrado' });
      }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      cep,
      street,
      number,
      neighborhood,
      city,
      state,
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Verifica se o usuário existe
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        phone: user.phone,
        location: {
          city: user.city,
          state: user.state,
          cep: user.cep,
          street: user.street,
          number: user.number,
          neighborhood: user.neighborhood,
        },
      },
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
};


export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id, name, email, phone, location, avatar } = req.body;

    const user = await findUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const updatedUser = await updateUserById(id, { name, email, phone, location, avatar });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
};

