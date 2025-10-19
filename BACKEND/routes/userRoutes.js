const express = require('express');
const router = express.Router();
const {
  register,
  login,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changePassword
} = require('../controllers/userController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.post('/create_user', protect, isAdmin, createUser);
router.get('/get_all_users', protect, isAdmin, getAllUsers);
router.get('/:id', protect, isAdmin, getUserById);
router.put('/update_user/:id', protect, isAdmin, updateUser);
router.delete('/delete_user/:id', protect, isAdmin, deleteUser);
router.put('/change_password', protect, changePassword);

module.exports = router;
