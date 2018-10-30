const getdb = require('./database');

const { response, protectedLambdaWrapper } = require('./utils');


const getProfile = async (event) => {

    const body = JSON.parse(event.body);

    const { decoded: {_id} } = event;

    const { db, models: { Users } } = await getdb();

    if (db === null) response(500, { message: 'Unable to connect with the db' });

    const profile = await Users.findOne({_id}, {password: 0, __v: 0}).then(user => user).catch(err => null);

    if (profile === null) {
      db.close();
      return response(500, {message: 'Something went wrong with your data'});
    }
    db.close();
    return response(200, profile);
}

exports.handler = async (event) => await protectedLambdaWrapper({ event, lambda: getProfile });
