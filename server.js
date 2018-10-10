require('dotenv').config();
const morgan = require('morgan')
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const lambdas = require('./index');

const app = express();

const PORT = 9001;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(morgan('combined'));

const server = app.listen(PORT, function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`Running on localhost:${port}`);
});

app.use(cors());

app.get('/', (req, res) => res.status(200).send({message: 'aws lambda dev api'}));


app.post('/api/v1/signup', async (req, res) => {
    const lambdaSignup = await lambdas.signup({ body: JSON.stringify(req.body) });
    res.status(lambdaSignup.statusCode).send(JSON.parse(lambdaSignup.body));
});

app.post('/api/v1/signin', async (req, res) => {
    const lambdaSignin = await lambdas.signin({ body: JSON.stringify(req.body) });
    res.status(lambdaSignin.statusCode).send(JSON.parse(lambdaSignin.body));
});

app.get('/api/v1/me', async(req, res) => {
    const lambdaProfile = await lambdas.getProfile({body: JSON.stringify(req.body), headers: req.headers});
    res.status(lambdaProfile.statusCode).send(JSON.parse(lambdaProfile.body));
});