import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_PERSONAL_ONE } from '../../services/PersonalService'
import Formulario from './FormularioPersonal';
import { withRouter } from 'react-router'
import { Loader, Notification } from 'rsuite';

const EditarCliente = (props) => {

    const {id} = props.match.params;
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_PERSONAL_ONE, { variables: { id: id }, pollInterval: 1000 });

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
            description: "Error al obtener la informacion del colaborador"
        })
    }

    return (
        <>
            <Formulario  props={props} personal={data.obtenerPersonalOne} refetch={refetch}/>
        </>
    );
}

export default withRouter(EditarCliente);