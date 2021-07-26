import React, { Component } from 'react';
import $ from 'jquery';
import Boton from "../shared/Boton";

class NavMenu extends Component {
    state = {
        nameIcon: 'page-top'
    }


    SideHidden = () => {
        const { nameIcon } = this.state;
        if (nameIcon === 'page-top') {
            this.setState({
                nameIcon: "page-end"
            })
        } else {
            this.setState({
                nameIcon: "page-top"
            })
        }
        $(document).ready(function () {
            $('#sidebar').toggleClass('active');
        });

    }


    render() {
        const { nameIcon } = this.state;

        return (
            <nav className="navbar navbar-expand-lg navbar-light text-center shadow">
                <div className="container-fluid">
                    {(!this.props.session) ?
                        <h3 className="text-right">Sistema Pro Cápsulas</h3> : ''
                    }
                    {(this.props.session) ?
                        <Boton icon={nameIcon} tooltip="Desplazar" onClick={this.SideHidden} color="blue" /> : ''
                    }
                    <img alt="Logo Pro Cápsula" className="" src="https://i1.wp.com/procapsulas.com/wp-content/uploads/2021/02/Recurso-1.png?fit=800%2C149&ssl=1" width="200" height="50"></img>
                </div>

            </nav>
        );
    }
}

export default NavMenu;
