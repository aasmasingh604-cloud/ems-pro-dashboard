require('dotenv').config();
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(()=>{ console.log('✅ CONNECTED TO MONGODB!'); process.exit(0) })
  .catch(e=>{ console.log('❌ FAILED:', e.message); process.exit(1) })
