const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const authService = {
  async login(username, password) {
    const user = await userRepository.findByUsername(username);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return {
      user: { id: user.id, username: user.username, nationalId: user.national_id, role: user.role },
      token,
    };
  },

  async register({ username, nationalId, password, role }) {
    const existing = await userRepository.findByUsername(username);
    if (existing) throw new Error('Username already exists');
    const hashed = await bcrypt.hash(password, 10);
    return userRepository.create({ username, nationalId, password: hashed, role: role || 'CITIZEN' });
  },
};

module.exports = authService;
