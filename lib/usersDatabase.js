const bcrypt = require('bcrypt');

const usersDatabase = [
  {
    id: 'hxtg7r',
    username: 'Max',
    email: 'maxhalleran@gmail.com',
    password: bcrypt.hashSync('google', 10),
    collection: ['b2xVn2', '9sm5xk'],
  },
];

module.exports = usersDatabase;
