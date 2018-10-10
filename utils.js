const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const hashPassword =  pswd => bcrypt.hashSync(pswd, 8);

const comparePassword = (reqPassword, dbPassword) => bcrypt.compareSync(reqPassword, dbPassword);

const createJWT = ({ _id }) => jwt.sign({_id: _id}, process.env.SECRET_JWT, {expiresIn: 86400 });

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

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.SECRET_JWT, (error, decoded) => {
         if (error) reject(error);
         resolve(decoded);
        })
    });
}

const protectedLambdaWrapper = ( { event, lambda } ) => {
    const { headers } = event;
    const token = ( headers instanceof Object && headers.hasOwnProperty('authorization') ) ? headers.authorization : null;
    return verifyToken(token).then(decoded => lambda({...event, decoded})).catch(error => response(401, { message: 'Unauthorized'}));
}

module.exports = {
    hashPassword,
    comparePassword,
    createJWT,
    response,
    protectedLambdaWrapper,
}
