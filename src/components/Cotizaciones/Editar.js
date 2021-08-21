import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_COTIZACION } from '../../services/CotizacionService'
import { withRouter } from 'react-router'
import { Loader, Notification } from 'rsuite';
import EditarCotizacion from './EditarCotizacion'

const Editar = ({...props}) => {
    const { id } = props.match.params;
    const { loading, error, data, startPolling, stopPolling } = useQuery(OBTENER_COTIZACION, { variables: { id: id }, pollInterval: 1000 });

    useEffect(() => {
        startPolling(1000)
        return () => {
            stopPolling()
        }
    }, [startPolling, stopPolling])

    if (loading) {
        return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    }
    if (error) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion de la comision"
        })
    }

    return (
        <EditarCotizacion props={props} cotizacion={data.obtenerCotizacion}/>
    )
}

export default withRouter(Editar)