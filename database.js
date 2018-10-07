const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


const getDB = async () => {
    const db = await mongoose.createConnection(process.env.MONGO_DB, { useNewUrlParser: true }).then(connection => connection).catch(err => null);
    if (db === null) {
        return {
            db,
            models: {}
        }
    } else {
        return {
            db,
            models: {
                Users: db.model('Users', UserSchema),
            }
        }
    }
}

module.exports = getDB;