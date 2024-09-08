import express from 'express'
import handlebars from 'express-handlebars'
import session from 'express-session'
import connectDB from './config/index.js' // Importa la funcion para conectar a la base de datos
import appRouter from './router/index.js'

// Importa modulos para trabajar con URLs y rutas de archivos
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Convierte la URL del módulo actual en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
// Obtiene el nombre del directorio actual a partir de la ruta de archivo
const __dirname = dirname(__filename);

const app = express()
const PORT = 8080

// Configuracion de la sesion
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    }
}))

// Middleware para procesar cuerpos de las solicitudes en formato JSON y URL-encoded
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Configuracion de  archivops estaticos (archivos de la carpeta 'public')
app.use(express.static(join(__dirname, 'public')))

// Configuracion de la vista con Handlebars
app.engine('handlebars', handlebars.engine())
app.set('views', join(__dirname, '/views'))
app.set('view engine', 'handlebars')

// Configuracion de las rutas
app.use(appRouter)

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
}).on('error', err => {
    console.error('Error al iniciar el servidor:', err);
});

// Conecta a la base de datos y menaja errores
connectDB().then(() => {
    console.log('Conectado a la base de datos');
}).catch(err => {
    console.error('Error al conectar a la base de datos:', err);
});