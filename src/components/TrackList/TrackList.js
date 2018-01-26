import React from 'react';
import './TrackList.css';
import Track from '../Track/Track';

class TrackList extends React.Component {
    render() {
        // console.log(this.props);
        return (
            <div className="TrackList">
                {this.props.tracks.map(track => <Track track={track} key={track.id} onRemove={this.props.onRemove} isRemoval={this.props.isRemoval} onAdd={this.props.onAdd} />)}
            </div>
        );
    }
}

export default TrackList;
