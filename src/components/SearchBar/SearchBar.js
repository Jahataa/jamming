import React from 'react';
import './SearchBar.css';
class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.search = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
        this.handleTermOnKey = this.handleTermOnKey.bind(this);
    }

    handleTermChange(event) {
        this.props.setTerm(event.target.value);
        console.log(event);
    }

    handleTermOnKey(event) {
        if (event.key === 'Enter') {
            this.props.onSearch();
        }
    }
    search() {
        this.props.onSearch();
    }

    render() {
        return (
            <div className="SearchBar">
                <input onChange={this.handleTermChange}  onKeyPress={this.handleTermOnKey} placeholder="Enter A Song, Album, or Artist" />
                <a onClick={this.search}  >SEARCH</a>
            </div>
        );
    }
}


export default SearchBar;
