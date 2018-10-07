const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const hashPassword =  pswd => bcrypt.hashSync(pswd, 8);

const comparePassword = (reqPassword, dbPassword) => bcrypt.compareSync(reqPassword, dbPassword);

const createJWT = ({ _id }) => jwt.sign({id: _id}, process.env.SECRET_JWT, {expiresIn: 86400 });


const response = (statusCode, body) => {
    return {
        "statusCode": statusCode,
        "headers": {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        "body": JSON.stringify(body),
        "isBase64Encoded": false
    };
};

module.exports = {
    hashPassword,
    comparePassword,
    createJWT,
    response,
}
