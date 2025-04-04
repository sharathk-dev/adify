import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Member from '../models/Member.js';
import dotenv from 'dotenv';

dotenv.config();

const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

/**
 * @swagger
 * /signin:
 *   post:
 *     summary: Register a new member
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - contact
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Member"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "new@example.com"
 *               contact:
 *                 type: string
 *                 example: "+10000000000"
 *               password:
 *                 type: string
 *                 example: "adify123"
 *     responses:
 *       200:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Member created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     sessionToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     newMember:
 *                       $ref: '#/components/schemas/Member'
 *       500:
 *         description: Error creating member
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const signin = async (req, res) => {
    try {
        const { name, email, contact, password } = req.body;

        const memberExists = await Member.findOne({ contact });

        if (memberExists) {
            throw new Error('Member already exists');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const newMember = new Member({
            name,
            email,
            contact,
            password: encryptedPassword
        });

        await newMember.save();

        const sessionToken = createJWT(newMember.id);

        res.status(200).json({
            message: 'Member created successfully',
            data: { sessionToken, newMember }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error signing in', error: error.message });
    }
}

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a member
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       500:
 *         description: Error logging in
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const member = await Member.findOne({ where: { email } });
        
        if (!member) {
            throw new Error('Member not found');
        }

        const isPasswordValid = await bcrypt.compare(password, member.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }
        
        const sessionToken = createJWT(member.id)

        res.status(200).json({
            message: 'Logged in successfully',
            data : {
                sessionToken,
                member
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error loggin in, ', error: error.message });
    }
}