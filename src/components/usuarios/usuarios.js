import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { OBTENER_USUARIOS_ACTIVOS, DELETE_USER } from '../../services/UsuarioService';
import { Link } from "react-router-dom";
import DataGrid from '../shared/DataGrid';

const Usuarios = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_usuarios, error: error_usuarios, data: data_usuarios } = useQuery(OBTENER_USUARIOS_ACTIVOS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_USER);

    const onDeleteUsuario = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarUsuario;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Usuario',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Usuario',
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
        } else {
            const val = key.cedula.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if (data_usuarios) {
            if (data_usuarios.obtenerUsuariosActivos) {
                return data_usuarios.obtenerUsuariosActivos.filter((value, index) => {
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

    if (load_usuarios) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_usuarios) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de usuarios, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Usuarios</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-3">
                    <select id="select_modo" className="h-100 rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Nombre del usuario</option>
                        <option value="2"> Cédula del usuario</option>
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
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="usuarios" displayLength={9} {...props} />
            </div>

            <div className="d-flex justify-content-start my-2">
                <Link to={`/usuarios/nuevo`}><Boton tooltip="Nueva comisión" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Usuarios)