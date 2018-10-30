const getdb = require('./database');

const { response, hashPassword, } = require('./utils');

exports.handler = async (event) => {

    const body = JSON.parse(event.body);

    const { db, models: { Users } } = await getdb();

    if (db === null) response(500, { message:  'Unable to connect with the db'});

    const existUser = await Users.findOne({email:  body.email}).then(res => res).catch(err => null);

    if(existUser !== null) {
      db.close();
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
