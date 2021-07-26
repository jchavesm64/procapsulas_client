import React from 'react';
import { Icon, Nav } from 'rsuite';

const NavPerfil = ({active, setActive, props}) => {

    const onSelect = (value) => {
        setActive(value);
    }

    return (
        <Nav activeKey={active} style={{marginBottom: 50}}>
            <Nav.Item eventKey="info" onSelect={() => {onSelect('info')}} icon={<Icon icon="user"/>}>Perfil</Nav.Item>
            <Nav.Item eventKey="editar" onSelect={() => {onSelect('editar')}} icon={<Icon icon="edit"/>}>Editar información</Nav.Item>
            <Nav.Item eventKey="password" onSelect={() => {onSelect('password')}} icon={<Icon icon="key"/>}>Cambiar contraseña</Nav.Item>
        </Nav>
    )
}

export default NavPerfil;