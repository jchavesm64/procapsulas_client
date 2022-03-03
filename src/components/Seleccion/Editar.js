import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_SELECION } from '../../services/SeleccionService'
import Formulario from './Formulario';
import { withRouter } from 'react-router'
import { Loader, Notification } from 'rsuite';

const EditarSeleccion = (props) => {

    const { id } = props.match.params;
    const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_SELECION, { variables: { id: id }, pollInterval: 1000 });

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
            description: "Error al obtener la informacion de la selección"
        })
    }

    return (
        <>
            <Formulario  props={props} seleccion={data.obtenerSeleccion} refetch={refetch}/>
        </>
    );

}

export default withRouter(EditarSeleccion)