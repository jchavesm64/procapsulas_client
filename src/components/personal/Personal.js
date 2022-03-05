import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { OBTENER_PERSONAL, DELETE_PERSONAL } from '../../services/PersonalService';
import { Link } from "react-router-dom";
import DataGrid from '../shared/DataGrid';

const Personal = ({ ...props }) => {
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_clientes, error: error_clientes, data: data_personal } = useQuery(OBTENER_PERSONAL, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_PERSONAL);

    const onDeleteUsuario = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarPersonal;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Colaborador',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Colaborador',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeleteUsuario}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            const val = key.cedula.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else {
            const val = key.pais.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if(data_personal){
            if(data_personal.obtenerPersonal){
                return data_personal.obtenerPersonal.filter((value, index) => {
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


    if (load_clientes) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_clientes) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información del personal, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Personal</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-4">
                    <select id="select_modo" className="rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Nombre del colaborador</option>
                        <option value="2"> Codigo del colaborador</option>
                        <option value="3"> País del colaborador</option>
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
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="personal" displayLength={9} {...props} />
            </div>
            <div className="d-flex justify-content-start my-2">
                <Link to={`/personal/nuevo`}><Boton tooltip="Nuevo Colaborador" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Personal)