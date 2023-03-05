import React from 'react';
class Header extends React.Component {

    constructor(props) {
        super(props);
    }
    render() {
        return <div class="header">
            <div class="header-left"><img class="header-logo" src={this.props.logo} /></div>
            <div class="header-center">
                <div class="header-search">
                    <input type="search" placeholder={this.props.placeholder}/>
                    <div class="btn btn-selected"><i className="fa fa-search"></i></div>
                </div>
            </div>
            <div class="header-right">
                <div className="btn btn-selected"><i className="fa fa-cloud"></i></div>
                <div className="btn btn-selected"><i className="fa fa-sun-o"></i></div>
            </div>
        </div>
    }
}

export default Header;
