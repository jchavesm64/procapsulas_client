import React, { useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_MATERIA_PRIMA } from '../../services/MateriaPrimaService'
import Formulario from './Formulario';
import { withRouter } from 'react-router'
import { Loader, Notification } from 'rsuite';

const EditarMateriaPrima = (props) => {

    const { id } = props.match.params;
    const { loading, error, data, refetch, startPolling, stopPolling } = useQuery(OBTENER_MATERIA_PRIMA, { variables: { id: id }, pollInterval: 1000 });

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
        <>
            <Formulario  props={props} materia={data.obtenerMateriaPrima} refetch={refetch}/>
        </>
    );
}

export default withRouter(EditarMateriaPrima);