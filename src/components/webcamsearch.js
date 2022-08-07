import React from 'react';

class WebcamSearch extends React.Component {
    render() {
        return (
            <input
                    id="search"
                    value={this.props.text}
                    placeholder={this.props.placeholder}
                />
        );
    }
}

export default WebcamSearch;