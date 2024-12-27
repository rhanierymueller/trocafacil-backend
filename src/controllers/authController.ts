import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// Função para registrar usuário
export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, cep, street, number, neighborhood, city, state } = req.body;

    // Verifica se o email já está registrado
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco de dados
    const newUser = await createUser({
      name,
      email,
      password: hashedPassword,
      location: {
        cep,
        street,
        number,
        neighborhood,
        city,
        state,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

// Função para login de usuário
export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo email
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Erro ao autenticar usuário:', error);
    return res.status(500).json({ message: 'Erro ao autenticar usuário' });
  }
};
