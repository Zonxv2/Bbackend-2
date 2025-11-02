export const policies = (...roles) => {
  return (req, res, next) => {
    try {
      // Ejemplo simple: verifica si el usuario tiene un rol válido
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: "No autorizado" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Acceso denegado" });
      }

      next();
    } catch (err) {
      console.error("Error en policies middleware:", err);
      res.status(500).json({ error: "Error interno" });
    }
  };
};
