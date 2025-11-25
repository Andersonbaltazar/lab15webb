const app = require('./app');
const sequelize = require('./config/database');
require('dotenv').config();

require('./models')

const PORT = process.env.PORT || 3001;

const startServer = async () => {
    try {
        if (process.env.NODE_ENV !== 'production') {
            await sequelize.authenticate()
            console.log("Conexion a bae de de datos establecida")

            await sequelize.sync({ alter:true })
            console.log("Modelos sincronizados")

            app.listen(PORT, () => {
                console.log(`Servido corriendo en http://localhost:${PORT}`);
            })
        }
    } catch(error) {
        console.error("Error al iniciar el servidor: ", error)
        if (process.env.NODE_ENV !== 'production') {
            process.exit(1)
        }
    }
};

startServer()

module.exports = app;