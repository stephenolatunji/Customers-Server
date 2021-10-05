const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');


app.use(express.json());
app.use(cors());
app.use(helmet(
    {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self"],
                scriptSrc: ["'self"]
            }
        },
        referrerPolicy: { policy: 'same-origin'}
    }
));
const REGISTER = require('./Routes/register_customer');
const CUSTOMER = require('./Routes/customer');

app.get('/', (req, res) => {
    res.send('Welcome to DMS!')
});
app.use('/register', REGISTER);
app.use('/customer', CUSTOMER);

const port = process.env.PORT || 80;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});