import express from 'express'
import handlebars from 'express-handlebars'
/* import __dirname from './utils/__dirname.js' */
import connectDB from './config/index.js'
import appRouter from './router/index.js'

// Importa el módulo 'url' para trabajar con URLs en módulos ES
import { fileURLToPath } from 'url';
// Importa el módulo 'path' para trabajar con rutas de archivos y directorios
import { dirname, join } from 'path';

// Convierte la URL del módulo actual en una ruta de archivo
const __filename = fileURLToPath(import.meta.url);
// Obtiene el nombre del directorio actual a partir de la ruta de archivo
const __dirname = dirname(__filename);

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(join(__dirname, 'public')))



app.engine('handlebars', handlebars.engine())
app.set('views', join(__dirname, '/views'))
app.set('view engine', 'handlebars')

app.use(appRouter)

app.listen(PORT, err => {
    if (err) console.log(err)
    console.log(`Servidor escuchando en el puertoo ${PORT}`)
})

connectDB()