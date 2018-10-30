const getdb = require('./database');
const { response, comparePassword, createJWT } = require('./utils');


exports.handler  = async (event) =>  {

    const body = JSON.parse(event.body);

    const { db, models: { Users } } = await getdb();

    if (db === null) response(500, { message: 'Unable to connect with the db' });

    const dbUser =  await Users.findOne({ email: body.email }).then(res => res).catch(err => err);

    if (dbUser === null) {
      db.close();
      return response(404, { message: `User not found in our db`});
    }

    const validPassword = comparePassword(body.password, dbUser.password);

    if (!validPassword) {
      db.close();
      return response(401, { message: 'Invalid credentials'});
    }

    db.close();
    return response(200, { token: createJWT(dbUser._id) });

};
