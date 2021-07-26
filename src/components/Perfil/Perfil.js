import { withRouter } from "react-router";
import NavPerfil from './NavPerfil';
import Info from './Informacion';
import Clave from './CambiarClave';
import Editar from '../usuarios/FormularioUsuario'
import { useQuery } from '@apollo/react-hooks';
import { OBTENER_USUARIO_AUTENTICADO } from '../../services/UsuarioService';
import { Loader, Notification, Icon } from 'rsuite';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';

const Perfil = ({ ...props }) => {
    const [active, setActive] = useState('info');
    const { loading, error, data: usuario } = useQuery(OBTENER_USUARIO_AUTENTICADO, { pollInterval: 500 });

    if (loading) return <Loader backdrop content="Cargando..." vertical size="lg" />
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 5000,
            description: 'Servido no responde, por favor contactar con los administradores'
        })
    }

    const { estado, data } = usuario.obtenerUsuarioAutenticado;
    return (
        <>
            {(estado) ?
                (
                    <div className="w-90 mx-auto">
                        <div className="text-center mb-5">
                            <span style={{ color: '#0CA3AE', fontSize: 80 }}>
                                <Icon icon="user-circle-o" size="lg" />
                            </span>
                            <h3 className="mt-3">{data.nombre}</h3>
                            <span className="help-block">Permisos de {localStorage.getItem('rol')}</span>
                        </div>
                        <div className="form-group col-md-12">
                            <div>
                                <NavPerfil active={active} setActive={setActive} />
                            </div>
                        </div>
                        {(active === 'info') ? <Info usuario={data} /> : ''}
                        {(active === 'editar') ? <Editar props={props} usuario={data} perfil={true} /> : ''}
                        {(active === 'password') ? <Clave usuario={data} /> : ''}
                    </div>
                ) : (
                    <Redirect to='/login' />
                )
            }

        </>
    );
}

export default withRouter(Perfil);