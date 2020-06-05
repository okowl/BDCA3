import React from 'react';


import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

 /**
  * Method that will update front-end after new entry was done on the client side
  * without reloading the page
  * */ 
const addEntry = (newData, refetch) => {
  return fetch("/api/anonimize", {
        method: 'post',
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify({...newData, published_at: new Date()})
    }).then(
        (res) => { //if result set returns anything except code '200' - some error occured 
        //and application will return an error
            refetch();
        }
    );
}


export default function PlaylistTable({refetch, fetchResult}) {
  const [post, setPost] = React.useState({});
  const classes = useStyles();
    

  return (
    <div style={{ maxWidth: "100%", display: 'flex', flexDirection: 'column' }}>
        <TextField
            id="title"
            label="Title"
            value={post.title}
            onChange={event => setPost({...post, title: event.target.value})}
        />
        <TextareaAutosize rowsMin={20} placeholder="Blog post with names go here"  value={post.content}
            onChange={event => setPost({...post, content: event.target.value})}/>
        <Button onClick={() => addEntry(post, refetch)}>Anonymize post</Button>
        
        {fetchResult && fetchResult.data && fetchResult.data.map((p) => {
            return (
                <Card className={classes.root}>
                    <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        {p.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {p.content}
                    </Typography>
                </CardContent>  
                </Card>
            )})
        }
    </div>
  );
}
