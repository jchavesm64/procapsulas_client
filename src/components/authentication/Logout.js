import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { withRouter, Link } from 'react-router-dom';
import { Icon } from 'rsuite';

const cerrarSesionUsuario = (cliente, history) => {
    try {
        localStorage.removeItem('token', '');
        localStorage.removeItem('rol', '');
        cliente.resetStore();
        history.push('/login');
    } catch (error) {
        console.log("Error logout: ",error);
    }

}

const CerrarSesion = ({ history, name }) => (
    <ApolloConsumer>
        {cliente => {
            return (
                <Link to="" onClick={() => cerrarSesionUsuario(cliente, history)}><Icon icon="sign-out" />{name}</Link>
            );
        }}
    </ApolloConsumer>
)

export default withRouter(CerrarSesion);