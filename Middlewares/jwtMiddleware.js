const jwt = require('jsonwebtoken')

const jwtMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(401).json("Authentication failed ..please login")
    }

    const parts = authHeader.split(" ")
    const token = parts.length === 2 ? parts[1] : parts[0]

    if (!token) {
        return res.status(404).json("Token missing..")
    }

    try {
        const jwtresponse = jwt.verify(token, process.env.JWTPASSWORD)
        req.userId = jwtresponse.userId
        next()
    } catch (err) {
        return res.status(401).json("Authentication failed ..please login")
    }
}

module.exports = jwtMiddleware
