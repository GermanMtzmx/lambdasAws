const getdb = require('./database');

const { response, hashPassword, comparePassword, createJWT, } = require('./utils');

const signup = async (event) => {
    
    const body = JSON.parse(event.body);
    const { db, models: { Users } } = await getdb();
    
    if (db === null) {
        return response(500, { message:  'Unable to connect with the db'});
    }

    const existUser = await Users.findOne({email:  body.email}).then(res => res).catch(err => null);

    if(existUser !== null) {
        return response(400, { message: 'Email already in use'});
    }

    return Users.create({ ...body, password: hashPassword(body.password) }).then(
        success => {
            db.close();
            return response(201, { message: 'User saved' });
        }).catch(
        error => {
            db.close();
            return response(400, { message: `Unable to save errors at ${Object.keys(error.errors)}` });
        });
};

const signin  = async (event) =>  {
    const body = JSON.parse(event.body);
    const { db, models: { Users } } = await getdb();
    
    if (db === null) {
        return response(500, { message: 'Unable to connect with the db' });
    }

    const dbUser =  await Users.findOne({ email: body.email }).then(res => res).catch(err => err);
    
    if (dbUser === null) {
        return response(404, { message: `User not found in our db`});
    }

    const validPassword = comparePassword(body.password, dbUser.password);

    if (!validPassword) {
        return response(401, { message: 'Invalid credentials'});
    }

    db.close();
    return response(200, { token: createJWT(dbUser._id) });

};

module.exports = {
    signin,
    signup,
}