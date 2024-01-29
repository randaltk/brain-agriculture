module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'randaltk98',
  database: 'brain-agriculture',
  synchronize: true,
  entities: ['dist/**/*.entity.js'],
};
