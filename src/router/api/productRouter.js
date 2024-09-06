import express from 'express'
import ProductDaosMongo from '../../daos/mongo/productDaosMongo.js'

const router = express.Router()
const productService = new ProductDaosMongo()

router.get('/', async (req, res) => {
    try {
        // Obtener parámetros de consulta
        const { limit = 10, page = 1, sort = '', query = '' } = req.query;

        // Convertir 'query' de cadena a objeto solo si no es vacío
        const queryObj = query ? JSON.parse(query) : {};

        // Configurar el ordenamiento
        const [sortField, sortOrder] = sort ? sort.split(':') : [];
        const sortObj = sortField ? { [sortField]: parseInt(sortOrder, 10) || 1} : {price: 1};

        // Configurar el número de límite y página
        const limitNumber = parseInt(limit, 10);
        const pageNumber = parseInt(page, 10);

        // Configurar el objeto de búsqueda (query)
        const searchQuery = Object.keys(queryObj).length > 0 ? queryObj : {};

        // Obtener productos desde el servicio
        const listadoProducts = await productService.getProducts({
            limit: limitNumber,
            page: pageNumber,
            sort: sortObj,
            query: searchQuery
        });

        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        const queryParams = new URLSearchParams(req.query);

        // Quitar el parámetro de página actual para construir prevLink y nextLink
        queryParams.delete('page');

        const prevLink = listadoProducts.hasPrevPage ? `${baseUrl}?${queryParams.toString()}&page=${listadoProducts.prevPage}` : null;
        const nextLink = listadoProducts.hasNextPage ? `${baseUrl}?${queryParams.toString()}&page=${listadoProducts.nextPage}` : null;

        // Enviar respuesta
        res.send({ 
            status: 'success', 
            payload: listadoProducts.docs,
            totalPages: listadoProducts.totalPages,
            prevPage: listadoProducts.prevPage,
            nextPage: listadoProducts.nextPage,
            page: listadoProducts.page,
            hasPrevPage: listadoProducts.hasPrevPage,
            hasNextPage: listadoProducts.hasNextPage,
            prevLink,
            nextLink
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: 'error', message: 'Error fetching products' });
    }
});


export default router