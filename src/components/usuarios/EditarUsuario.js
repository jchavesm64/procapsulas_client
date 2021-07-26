import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_USUARIO } from '../../services/UsuarioService'
import Formulario from './FormularioUsuario';
import { withRouter } from 'react-router'
import { Loader, Notification } from 'rsuite';

const EditarUsuario = (props) => {

    const {id} = props.match.params;
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_USUARIO, { variables: { id: id }, pollInterval: 1000 });

    useEffect( () => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    if(loading){
        return (<Loader backdrop content="Cargando..." vertical size="lg"/>);
    }
    if(error){
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion de la comision"
        })
    }

    return (
        <>
            <Formulario  props={props} usuario={data.obtenerUsuario} refetch={refetch} perfil={false}/>
        </>
    );
}

export default withRouter(EditarUsuario);