import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults:[
                // {
                //     name: '3 sindjira robi',
                //     artist: 'bobi turboto',
                //     album: 'nqma album',
                //     id: 1,
                //     uri: 'aasdasd'
                // },
                // {
                //     name: 'nqma chakai',
                //     artist: 'F.O',
                //     album: 'nqma album',
                //     id: 3,
                //     uri: 'aassd'
                // },
                // {
                //     name: '422',
                //     artist: 'Dim4ou',
                //     album: 'nqma album',
                //     id: 4,
                //     uri: 'aasd'
                // }
            ],
            playlistName: 'Name your playlist',
            playlistTracks:[],
            term: ''
        };
        Spotify.getAccessToken();
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.setSearchTerm = this.setSearchTerm.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        let playlistTrack = this.state.playlistTracks.find(t => t.id === track.id);
        if (!playlistTrack) {
            this.setState(oldState => ({ playlistTracks: oldState.playlistTracks.concat([track]) }));
        }
    }

    removeTrack(track) {
        let playlistTrack = this.state.playlistTracks.find(t => t.id === track.id);
        if (playlistTrack) {
            this.setState(oldState => ({ playlistTracks: oldState.playlistTracks.filter(t => t.id !== track.id) }));
        }
    }

    updatePlaylistName(name) {
        // console.log(name);
        this.setState(oldState => ({ playlistName: name }));
    }

    savePlaylist() {
        let trackURIs = this.state.playlistTracks.map(track => track.uri);
        try {
            Spotify.savePlaylist(trackURIs, this.state.playlistName);
            this.setState(() => (
                { playlistTracks:[] }));
            this.setState(() => (
                { playlistName:'  ' }));
        } catch (err) {
            console.error(err);
        }
    }

    setSearchTerm(term) {
        this.setState(() => ({ term : term }));
    }
    search() {
        Spotify.search(this.state.term).then(result => {
            console.log(result);
            this.setState({ searchResults:result });
        });
    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar onSearch={this.search}  setTerm={this.setSearchTerm}/>
                    <div className="App-playlist">
                        <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
                        <Playlist onSave={this.savePlaylist} playlistName={this.state.playlistName} onNameChange={this.updatePlaylistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
