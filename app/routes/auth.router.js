import { Router } from "express";
import { User } from "../config/models/user.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { requireJwtCookie } from "../middleware/auth.middleware.js";
import environment from '../env.config.js';

const router = new Router () 

/** REgistro local usando Bcrypt */
router.post('/register', async (req, res) => {

    const {first_name, last_name, email, age, password} = req.body;
    if(!first_name || !last_name || !email, age || !password){
        return res.status(400).json({error : "Todos los datos son requeridos"});
    }        
    const exist = await User.findOne({ email });
    if(exist) return res.status(400).json({ error: "El email ingresado ya existe"});

    const hash = await bcrypt.hash(password, 10);
    await User.create({ first_name, last_name, email, age, password: hash });

    res.status(201).json({message : "Usuario registrado con éxito"});
});

/* Autenticacion con JWT */
router.post('/jwt/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: " Faltan Credenciales" });
    const u = await User.findOne({ email });
    if (!u) return res. status(400). json({ error: "Credenciales Invalidas" });
    const ok = await bcrypt. compare (password, u. password);
    if (!ok) return res. status(400). json({ error: "Password invalido" });

    const payload = { sub: String(u._id), email: u.email, role: u.role} ;
    const token = jwt.sign(payload, environment.JWT_SECRET, { expiresIn: "1h"});

    // Cookie HttpOnly
    res. cookie('access_token', token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        maxAge: 60 * 60 * 1000,
        path: '/'
    })



    res. json({message: "Login Ok (JWT en Cookie)", token: token});
})

router. get('/jwt/me', requireJwtCookie, async (req, res) => {
    const user = await User. findById(req.user._id) .lean();
    if (!user) return res. status(404). json({ error: "Usuario no encontrado" });
    const { first_name, last_name, email, age, role } = user;
res. json({ user: { first_name, last_name, email, age, role } })
})

router.post('/jwt/logout', (req, res) => {
    res. clearCookie('access_token', {path: '/'});
    res. json({message: 'Logout Ok - Cookie de JWT Borrada'})
})

export default router