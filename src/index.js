import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import 'typeface-roboto';
import PlaylistTable from './client/PlaylistTable.react';

/**
 * Method to retrive all information from DB and display it
 */
const getAllEntries = (setFetchResult) => {
    fetch("/api/posts").then(
        (res) => {
            if (res.status !== 200) {
                setFetchResult({ err: `Looks like there was a problem. Status Code: ${res.status}` });
                return;
            }

            res.clone().json().then(function (data) {
                setFetchResult({ data });
            });
        }
    );
}

//Method that initializes app
const App = () => {
    const [fetchResult, setFetchResult] = React.useState(null);
    const refetch = () => getAllEntries(setFetchResult);
    React.useEffect(() => {
        refetch();
    }, []);

    return (
        <PlaylistTable refetch={refetch} fetchResult={fetchResult} />
    );
}

ReactDOM.render(<App />, document.querySelector('#app'));