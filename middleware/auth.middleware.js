export function requiereLogin(req, res, next) {
    if(!req.session.user){
        return res.status(401).json({error: "No autorizado"});
    }
}

export function alreadyLogin(req, res, next) {
    if(req.session.user){
        return res.status(403).json({error: "Ya estas logueado"});
    }
}