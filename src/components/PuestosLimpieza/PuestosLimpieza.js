import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { OBTENER_PUESTO_LIMPIEZAS, DELETE_PUESTO_LIMPIEZA } from '../../services/PuestoLimpiezaService'
import DataGrid from '../shared/DataGrid'

const Maquinaria = ({ ...props }) => {
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_puesto_limpieza, error: error_puesto_limpieza, data: data_puesto_limpieza } = useQuery(OBTENER_PUESTO_LIMPIEZAS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_PUESTO_LIMPIEZA);

    const { session } = props
    const uso = session.roles[0].tipo === 'PUESTO_LIMPIEZA'

    const onDeletePuestoLimpieza = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarPuestoLimpieza;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Puesto de Limpieza',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Puesto de Limpieza',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeletePuestoLimpieza}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            const val = key.codigo.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if (data_puesto_limpieza) {
            if (data_puesto_limpieza.obtenerPuestoLimpiezas) {
                return data_puesto_limpieza.obtenerPuestoLimpiezas.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
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

    if (load_puesto_limpieza) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_puesto_limpieza) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de máquinas, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Puesto de Limpieza</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-3">
                    <select id="select_modo" className="h-100 rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Puesto de Limpieza</option>
                        <option value="2"> Código de Puesto</option>
                    </select>
                </div>
                <div style={{ padding: 0 }} className="col-md-9 h-100">
                    <div className="input-group">
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="puesto" displayLength={9} {...props} />
            </div>
            {
                !uso &&
                <div className="d-flex justify-content-start my-2">
                    <Link to={`/puestos_limpieza/nuevo`}><Boton tooltip="Nueva Puesto de Limpieza" name="Nuevo" icon="plus" color="green" /></Link>
                </div>
            }
            {isConfirmation}
        </>
    )
}

export default withRouter(Maquinaria)