import express from 'express';
const router = express.Router();
import { createUser, getAllUsers, updateUser } from '../controllers/admin.controller.js';
import { deleteUser } from '../controllers/admin.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

router.get('/getAllUsers',verifyToken,getAllUsers);
router.put('/updateUser/:id',verifyToken,updateUser);
router.delete('/deleteUser/:id',verifyToken,deleteUser);
router.post('/createUser',verifyToken,createUser);


export default router;