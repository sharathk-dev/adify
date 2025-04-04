import { signin, login } from '../controllers/auth.controller.js'; // adjust path
import Member from '../models/Member.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock Express response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnThis();
  res.json = jest.fn();
  return res;
};

jest.mock('../models/Member.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('Auth Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('signin', () => {
    it('should create a new member and return session token', async () => {
      const req = {
        body: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '+1000000000',
          password: 'password123'
        }
      };
      const res = mockResponse();

      Member.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue('hashedpassword');
      Member.mockImplementation(() => ({
        save: jest.fn().mockResolvedValue(true),
        id: 'new-member-id'
      }));
      jwt.sign.mockReturnValue('fake-jwt-token');

      await signin(req, res);

      expect(Member.findOne).toHaveBeenCalledWith({ contact: req.body.contact });
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'new-member-id' }, process.env.JWT_SECRET, { expiresIn: '1h' });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Member created successfully',
        data: {
          sessionToken: 'fake-jwt-token',
          newMember: expect.any(Object)
        }
      });
    });

    it('should return 500 if member already exists', async () => {
      const req = {
        body: {
          name: 'Test',
          email: 'test@example.com',
          contact: '+1000000000',
          password: 'password'
        }
      };
      const res = mockResponse();

      Member.findOne.mockResolvedValue({ contact: '+1000000000' });

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error signing in',
        error: 'Member already exists'
      });
    });
  });

  describe('login', () => {
    it('should login member and return token', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          password: 'password123'
        }
      };
      const res = mockResponse();

      const mockMember = {
        id: 'existing-id',
        password: 'hashedpassword'
      };

      Member.findOne.mockResolvedValue(mockMember);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await login(req, res);

      expect(Member.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 'existing-id' }, process.env.JWT_SECRET, { expiresIn: '1h' });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Logged in successfully',
        data: {
          sessionToken: 'fake-jwt-token',
          member: mockMember
        }
      });
    });

    it('should return 500 if member not found', async () => {
      const req = { body: { email: 'notfound@example.com', password: '1234' } };
      const res = mockResponse();

      Member.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error loggin in, ',
        error: 'Member not found'
      });
    });

    it('should return 500 if password is invalid', async () => {
      const req = { body: { email: 'test@example.com', password: 'wrongpass' } };
      const res = mockResponse();

      Member.findOne.mockResolvedValue({ password: 'hashedpass' });
      bcrypt.compare.mockResolvedValue(false);

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error loggin in, ',
        error: 'Invalid password'
      });
    });
  });
});
