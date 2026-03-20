require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🏛️  Municipal Property Management API running on port ${PORT}`);
});
