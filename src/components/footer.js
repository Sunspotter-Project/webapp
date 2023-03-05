import React from 'react';
class Footer extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return <div class="footer">
            <div class="footer-left">
                <div className="btn btn-to-select"><i className="fa fa-search-plus"></i></div>
                <div className="btn btn-to-select"><i className="fa fa-search-minus"></i></div>
            </div>
            <div class="footer-center">
                <span>102 sun spots</span>
            </div>
            <div class="footer-right">
                <div className="btn btn-to-select"><i className="fa fa-list-ul"></i></div>
                <div className="btn btn-selected"><i className="fa fa-map"></i></div>
            </div>
        </div>
    }
}



export default Footer;
