import path from 'path';
// Update with your config settings.

module.exports = {

  client: 'sqlite3',
  connection: {
    filename: path.resolve(__dirname, 'src', 'database', 'data.sqlite'),
  },
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  useNullAsDefault: true,
};
