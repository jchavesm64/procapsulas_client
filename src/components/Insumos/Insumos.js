/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { OBTENER_INSUMO_MOVIMIENTOS, DELETE_INSUMO } from '../../services/InsumosService'
import DataGrid from '../shared/DataGrid'

const Insumo = ({ ...props }) => {
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState(1)
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_insumo, error: error_insumo, data: data_insumo } = useQuery(OBTENER_INSUMO_MOVIMIENTOS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_INSUMO);

    const onDeleteInsumo = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarInsumo;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Insumo',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Insumo',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeleteInsumo}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    function getFilteredByKey(key, value) {
        if (modo === '1') {
            const val = key.insumo.codigo.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        } else {
            const val = key.insumo.area.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }



    const getData = () => {
        if (data_insumo) {
            if (data_insumo.obtenerInsumosConMovimientos) {
                return data_insumo.obtenerInsumosConMovimientos.filter((value, index) => {
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

    if (load_insumo) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_insumo) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de insumo, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Insumo</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-4">
                    <select id="select_modo" className="rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Código del insumo</option>
                        <option value="2"> Area donde se utiliza</option>
                    </select>
                </div>
                <div style={{ padding: 0 }} className="col-md-8 h-100">
                    <div className="input-group">
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="insumo" displayLength={9} {...props} />
            </div>
            <div className="d-flex justify-content-start my-2">
                <Link to={`/insumos/nuevo`}><Boton tooltip="Nuevo Insumo" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Insumo)