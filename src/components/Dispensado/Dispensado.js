/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { OBTENER_DISPENSADO_MOVIMIENTOS, DELETE_DISPENSADO } from '../../services/DispensadoService'
import DataGrid from '../shared/DataGrid'

const Dispensado = ({ ...props }) => {
    const [filter, setFilter] = useState('')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_seleccion, error: error_seleccion, data: data_seleccion } = useQuery(OBTENER_DISPENSADO_MOVIMIENTOS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_DISPENSADO);

    const onDeleteDispensado = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarDispensado;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Dispensado',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Dispensado',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeleteDispensado}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    function getFilteredByKey(key, value) {
        const val = key.dispensado.producto.nombre.toLowerCase();
        const val2 = value.toLowerCase();
        if (val.includes(val2)) {
            return key
        }
        return null;
    }

    

    const getData = () => {
        if (data_seleccion) {
            if (data_seleccion.obtenerDispensadoConMovimientos) {
                return data_seleccion.obtenerDispensadoConMovimientos.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    const mostrarMsj = () => {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'No tienes el rol necesario para realizar esta acción.'
        })
    }

    if (load_seleccion) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_seleccion) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de dispensado, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Dispensado</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-12 h-100">
                    <div className="input-group">
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="dispensado" displayLength={9} {...props} />
            </div>
            <div className="d-flex justify-content-start my-2">
                <Link to={`/dispensado/nuevo`}><Boton tooltip="Nuevo Dispensado" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Dispensado)