import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_INCIDENTE } from '../../../services/IncidenteService'
import Formulario from './Formulario';
import { withRouter } from 'react-router'
import { Loader, Notification } from 'rsuite';

const EditarIncidente = (props) => {

    const {id} = props.match.params;
    const {loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_INCIDENTE, { variables: { id: id }, pollInterval: 1000 });

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
            description: "Error al obtener la informacion del incidente"
        })
    }

    return (
        <>
            <Formulario props={props} incidente={data.obtenerIncidente} refetch={refetch}/>
        </>
    );
}

export default withRouter(EditarIncidente);