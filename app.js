const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 8080;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));


const url = 'mongodb://uvrqiwahjpcsextetpun:uWqPP5rOJWNeFuAPaq07@n1-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017,n2-c2-mongodb-clevercloud-customers.services.clever-cloud.com:27017/b4x4mcqkjdboq4o?replicaSet=rs0';
const dbName = 'b4x4mcqkjdboq4o';

app.get('/', (req, res) => {
    res.render('index'); // Render the index.ejs file
});


app.get('/register', (req, res) => {
    res.render('registration'); // Render the index.ejs file
});
// Routes for signup and signin
app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
 
    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Connect to MongoDB
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Check if the username already exists
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists.' });
        }

        // Insert the new user
        const result = await usersCollection.insertOne({ username, password });

        res.render('index');
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    } finally {
        await client.close();
    }
});

app.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Connect to MongoDB
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Check if the user exists
        const user = await usersCollection.findOne({ username, password });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password.' });
        }

        //return res.status(200).json({ message: 'Login successful.', userId: user._id });
        res.render('start');
    } catch (error) {
        console.error('Error during signin:', error);
        return res.status(500).json({ message: 'Internal Server Error.' });
    } finally {
        await client.close();
    }
});
app.listen(port, '0.0.0.0', () => {
  // ...
});


