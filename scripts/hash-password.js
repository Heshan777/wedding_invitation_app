const bcrypt = require('bcryptjs');
bcrypt.hash(process.argv[2], 10).then(h =>console.log(h));