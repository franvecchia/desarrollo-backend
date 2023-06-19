export const testLogin = (req, res, next) => {
    try {
        if(!req.user) {
            return res.status(401).send({status: "error", error: "Usuario invalido"});
        }

        req.session.user = {
            email: req.user.email,
            first_name: req.user.first_name
        }

        res.status(200).send({status: "Success", payload: req.user});
    } catch (error) {
        res.status(500).send({status: "Error", message: error.message});
    }
}

export const getSession = (req, res, next) => {
    if (req.session.login) {
        res.status(200).json({ message: "Session activa" })
    } else {
        res.status(401).json({ message: "Session no activa" })
    }
}

export const destroySession = (req, res, next) => {
    if (req.session.login) {
        req.session.destroy(() => {
            res.status(200).json({ message: "Sesion destruida" });
        });
    }
}