import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }, { password: 0 }); // Exclude password for security
    res.status(200).json(users); // Return JSON instead of rendering a view
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated", updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
}

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User soft deleted", user });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



export const createUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User created successfully', user: newUser });
  } catch (error) {
    next(error);
  }
};
