import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { OBTENER_MAQUINAS, DELETE_MAQUINA } from '../../services/MaquinaService'
import DataGrid from '../shared/DataGrid'

const Maquinaria = ({ ...props }) => {
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_maquinas, error: error_maquinas, data: data_maquinas } = useQuery(OBTENER_MAQUINAS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_MAQUINA);

    const onDeleteMaquina = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarMaquina;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Máquina',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Máquina',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeleteMaquina}
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
            const val = key.categoria.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if(data_maquinas){
            if(data_maquinas.obtenerMaquinas){
                return data_maquinas.obtenerMaquinas.filter((value, index) => {
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

    if (load_maquinas) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_maquinas) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de máquinas, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Maquinaria</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-3">
                    <select id="select_modo" className="h-100 rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Máquina</option>
                        <option value="2"> Categoría</option>
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
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="maquina" displayLength={9} {...props} />
            </div>
            <div className="d-flex justify-content-start my-2">
                <Link to={`/maquinaria/nuevo`}><Boton tooltip="Nueva Máquina" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Maquinaria)