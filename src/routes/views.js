import { Router } from 'express'
import productsModel from '../models/products.model.js'
import cartModel from '../models/cart.model.js'

const router = Router();

//Auth
router.get('/', async(req, res) => {

    //verificar si existe una sesion
    if(req.session?.user){
        return res.redirect('/products')
    }

    return res.render('auth/login', {
        layout: false
    });
})

router.get('/register', async(req, res) => {
    res.render('auth/register', {
        layout: false
    });
})

router.get('/profile', async(req, res) => {

    const user = req.session.user

    res.render('auth/profile', {
        helpers: {
            name() { return user.name; },
            email() { return user.email; },
            admin() { return user.admin ? true : false; }
        }
    });
})

router.get('/products', async(req, res) => {

    const page = parseInt(req.query?.page || 1);
    const limit = parseInt(req.query?.limit || 10);
    const query = req.query.query;
    const sort = req.query?.sort || '';

    let filtro = {}

    if(query != null){
        filtro = { $or:[{"category": query}, {"status": query}]}
    }

    //Buscar Class BD
    const products = await productsModel.paginate(filtro , {
        page: page,
        limit: limit,
        lean: true,
        sort: {
            price: sort
        }
    })

    products.prevLink = products.hasPrevPage ? `/products?page=${products.prevPage}&limit=${limit}` : ''     
    products.nextLink = products.hasNextPage ? `/products?page=${products.nextPage}&limit=${limit}` : ''

    res.render('products', products)
})

router.get('/product/:idProduct', async(req, res) => {

    const { idProduct } = req.params;

    const product = await productsModel.findById(idProduct);
    
    res.render('product', {
        helpers:{
            title() {return product.title},
            description() {return product.description},
            stock() {return product.stock},
            status() {return product.status},
        }
    })
})

router.get('/cart', async (req, res) => {

    const cart = await cartModel.findOne()
    res.render('cart', cart)
})

router.get('/chat', (req, res) => {
    res.render('chat', {})
})

router.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', {})
})

export default router