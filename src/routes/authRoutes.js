import Router from 'express'

//Models
import userModel from '../models/user.model.js'

//Sessions
import session from "express-session";

//Mongo
import MongoStore from 'connect-mongo'

const router = Router();

router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if(!email || !password){
        return res.redirect('/')
    }

    const user = await userModel.findOne({ email, password })

    if(!user){
        return res.redirect('/')
    }

    req.session.user = user;

    return res.redirect('/products');
})

router.post('/register', async (req, res) => {

    const { name, email, password } = req.body;

    if(!email || !password){
        return res.redirect('/register')
    }
    const user = await userModel.create({ 
        "name": name,
        "email": email,
        "password": password
     })

     req.session.user = user;

    return res.redirect('/products') 
})

router.post('/logout', async (req, res) => {

    req.session.user = '';

    return res.redirect('/') 
})

export default router;