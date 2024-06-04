const jwt = require('jsonwebtoken')

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization
    if(token){
        try {
            const tokenData = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET)
            req.tokenData = tokenData
            next()
        } catch(e){
            res.json({errors : e})
        }
    } else {
        res.json({notice: 'token is required'})
    }
}

module.exports = {
    authenticateUser
}