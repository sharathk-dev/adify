import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Member from '../models/Member.js';
import dotenv from 'dotenv';

dotenv.config();

const createJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

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

export const verifyToken = (req, res, next) => {
    
    let authHeader = req.headers['authorization'];
    let receivedToken = req.headers.authorization?.split(" ")[1];  
    let token = receivedToken.replace(/['"]+/g, '').trim();

    if (!token) {
        return res.status(401).json({ message: "Unauthorized, token missing" });
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;  // Attach user ID to request
        next();  // Proceed to next middleware
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};