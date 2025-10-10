import { Router } from "express";
import { requiereLogin } from "../middleware/auth.middleware.js";

const router = new Router();

router.get('/', requiereLogin, (req, res) =>{
    const { first_name, last_name, email, age } = req.session.user;
    const bienvenida = `Bienvenido ${first_name} ${last_name}.!`
    res.status(200).json({ user: {first_name, last_name, email, age }})
})


export default router;