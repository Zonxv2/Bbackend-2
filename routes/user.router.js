import { Router } from "express";
import { User } from "../config/models/user.model.js";


const router = new Router();

router.post('/register', async (req, res) => {
    try{
        const {first_name, last_name, email, age, password} = req.body;
        if(!first_name || !last_name || !email, age || !password){
            return res.status(400).json({error : "Todos los datos son requeridos"});

        };

        const exist = await User.findOne({ email });
        if(exist) return res.status(400).json({ error: "El email ingresado ya existe"});

        const user = new User({first_name, last_name, email, age, password});
        await user.save();

        res.status(201).json({message : "Usuario registrado con éxito", user: user});

    }catch(error){
        res.status(500).json({error: error.message });
    }
})

router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if(user) return res.status(404).json({ error: "El usuario ingresado no existe"});

        res.status(200).json({message: "Login exitoso", user: user});

    }catch(error) {
        res.status(500).json({ error: error.message});
    }
})

export default router;