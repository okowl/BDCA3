/**
 * @author Olga Kiseleva 2017136
 */

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const address = process.env.IP || "0.0.0.0";
const EasySoap = require('easysoap');

const jsonErrorHandler = async (err, req, res, next) => {
  res.status(500).send({ error: err });
}
app.use(express.static('dist'));
app.use(express.json());
app.use(jsonErrorHandler);

let postAutoincrement = 0;
const posts = [
    {
        content: 'Hello world',
        published_at: new Date(),
        title: "HELLO WORLD"
    }
];


// define soap params
const params = {
    host: 'bdca3-owlet.duckdns.org',
    path: '/ws',
    wsdl: '/ws/posts.wsdl'
};

/*
    * create the client
    */
var soapClient = EasySoap(params);
/**
 * CREATE OR UPDATE
 */
app.post('/api/anonimize', (req, res) => {
    const {
        content,
        published_at,
        title
    } = req.body;
    
    
    /*
    * call soap method`
    */
    soapClient.call({
        method    : 'getAnonymousPost',
        attributes: {
            xmlns: 'http://okowl.github.io/soap/words'
        },
        params: {
            content:"hello",
        }
    })
    .then((callResponse) => {
        console.log(callResponse.data);	// response data as json
        console.log(callResponse.body);	// response body
        console.log(callResponse.header);  //response header
        postAutoincrement += 1;
        const newPost = {
            content: callResponse.data,
            published_at,
            title,
        };
        posts[postAutoincrement] = newPost;
        res.send({newPost});
    })
    .catch((err) => { throw new Error(err); });
});

/**
 * READ
 */
app.get('/api/posts', (_, res) => {
    res.send(posts);
});

app.listen(port, address, function() {
    console.log("Server listening at", address + ":" + port);
});
