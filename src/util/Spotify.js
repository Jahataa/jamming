const CLIENT_ID  = '43e0874784ce4176b49925a233baf98c';
const REDIRECT_URI = 'http%3A%2F%2Flocalhost%3A3000%2F';
// const REDIRECT_URI = encodeURIComponent('http://jahatajammming.surge.sh');
const scope = 'playlist-modify-public';
let accessToken = null;

let Spotify = {
    getAccessToken: function () {
        console.log(window.location.hash);

        if (accessToken) {
            return accessToken;
        } else if (window.location.hash) {
            let queryParams = {};
            let query = window.location.hash;
            query = query.substr(1);
            let  rawQueryParams = query.split('&');

            rawQueryParams.forEach(element => {
                let keyValue = element.split('=');
                queryParams[keyValue[0]] = keyValue[1];
            });
            accessToken = queryParams.access_token;

            setTimeout(function () {
                accessToken = null;
            }, queryParams.expires_in * 1000);
            window.history.pushState('Access Token', null, '/');
            console.log(queryParams.expires_in);
            return accessToken;
        } else {
            let urlToken = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${scope}`;
            window.location.href = urlToken;
        }
    },


    search:TERM => {
        let transformTrack = SpotifyTrack => {
            let track = {
                id:SpotifyTrack.id,
                name:SpotifyTrack.name,
                artist: SpotifyTrack.artists[0].name,
                album : SpotifyTrack.album.name,
                uri : SpotifyTrack.uri
            };
            console.log(track);
            return track;
        };
        const accessToken = Spotify.getAccessToken();
        let option =  { headers:{ Authorization: `Bearer ${accessToken}` } };
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${TERM}`, option).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)).then(json => {
            console.log(json);
            if (!json.tracks.items || json.tracks.items.lenght === 0) {
                return [];
            }

            return json.tracks.items.map(transformTrack);
        });
    },
    savePlaylist: (trackURIs, playlistName) => {
        if (!trackURIs || trackURIs.lenght == 0  || !playlistName) {
            console.log('kur');
            return;
        }
        let userId = '';
        const accessToken = Spotify.getAccessToken();
        let headers =  { Authorization: `Bearer ${accessToken}` };
        return fetch(`https://api.spotify.com/v1/me`, { headers:headers }).then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)).then(user => user)
            .then(user => {
                userId = user.id;
                return fetch(
                    `https://api.spotify.com/v1/users/${user.id}/playlists`,
                    {
                        headers:headers,
                        method:'POST',
                        body:JSON.stringify({ name:playlistName })
                    }
                )
                ;
            }).then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)).then(playlist =>
                fetch(
                    `https://api.spotify.com/v1/users/${userId}/playlists/${playlist.id}/tracks`,
                    {
                        headers:headers,
                        method:'POST',
                        body:JSON.stringify({ uris:trackURIs })
                    }
                )).then(response => {
                if (response.ok) {
                    return response.json();
                }
            }).then(json => {
                console.log(json);
            });
    }
};


export default Spotify;
