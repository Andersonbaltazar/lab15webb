const { Sequelize } = require("sequelize");
require("dotenv").config();

let sequelize;

// En producción (Vercel), usar un mock para evitar errores de conexión
if (process.env.NODE_ENV === 'production') {
  sequelize = {
    authenticate: async () => { console.log('Mock DB auth'); return true; },
    sync: async () => { console.log('Mock DB sync'); return true; },
    define: () => {},
  };
} else if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

module.exports = sequelize;
