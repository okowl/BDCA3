/**
 * @author Olga Kiseleva 2017136
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const address = process.env.IP || "0.0.0.0";
const soap = require('soap');

var path = require('path');

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: err });
}
app.use(express.static('dist'));
app.use(express.json());
app.use(jsonErrorHandler);

let postAutoincrement = 0;
const posts = [
];


const localPath = path.join(__dirname, '..', 'soap', 'posts.wsdl');
const soapURL = localPath;
let soapClient = null;
soap.createClient(soapURL, function(err, client) {
    soapClient = client;
    if (err) {
    console.log('Error while booting the application', err);
    return;
    }
    console.log("Loaded soap client successfully", soapClient);
    app.listen(port, address, function() {
        console.log("Server listening at", address + ":" + port);
    });
});

/**
 * CREATE OR UPDATE
 */
app.post('/api/anonimize', (req, res) => {
    const {
        content,
        published_at,
        title
    } = req.body;
    
     const args = {content};
     soapClient.getAnonymousPost(args, function(err, result) {
         if (err) {
            console.error(err);
            return;
        }
        postAutoincrement += 1;
        const newPost = {
            id: postAutoincrement,
            content: result.content,
            published_at,
            title,
        };
        posts.push(newPost);
        res.send({newPost});
    
      });
});

/**
 * READ
 */
app.get('/api/posts', (_, res) => {
    res.send(posts);
});


