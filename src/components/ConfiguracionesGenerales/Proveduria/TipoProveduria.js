import React, { useState } from 'react';
import { withRouter } from 'react-router';
import Boton from '../../shared/Boton';
import Action from '../../shared/Action';
import {
    Table,
    Loader,
    Notification,
} from 'rsuite';
import Confirmation from '../../shared/Confirmation';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
    OBTENER_TIPO_PROVEDURIA,
    SAVE_TIPO_PROVEDURIA,
    UPDATE_TIPO_PROVEDURIA,
    DELETE_TIPO_PROVEDURIA
} from '../../../services/TipoProveduriaService';
import {Redirect} from 'react-router-dom';
const { Column, HeaderCell, Cell, Pagination } = Table;

const TipoProveduria = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [confimation, setConfirmation] = useState(false);
    const [filter, setFilter] = useState('');
    const [nuevo, setNuevo] = useState(false);
    const [editar, setEditar] = useState({ dato: null, estado: false });
    const [tipo, setTipo] = useState('');
    const { loading, error, data: tipos } = useQuery(OBTENER_TIPO_PROVEDURIA, { pollInterval: 1000 });
    const [insertar] = useMutation(SAVE_TIPO_PROVEDURIA);
    const [actualizar] = useMutation(UPDATE_TIPO_PROVEDURIA);
    const [desactivar] = useMutation(DELETE_TIPO_PROVEDURIA);

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const onDeletObjeto = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        if (data.desactivarTipoProveduria.estado) {
            Notification['success']({
                title: 'Eliminar Tipo de Proveduría',
                duration: 5000,
                description: data.desactivarTipoProveduria.message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Tipo de Proveduría',
                duration: 5000,
                description: data.desactivarTipoProveduria.message
            })
        }
    }
    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeletObjeto}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    const getData = () => {
        return tipos.obtenerTipoProveduria.filter((value, index) => {
            if (filter !== "") {
                return getFilteredByKey(value, filter);
            }
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return index >= start && index < end;
        });
    }

    function getFilteredByKey(value, key) {
        const val = value.tipo.toLowerCase();
        const val2 = key.toLowerCase();
        if (val.includes(val2)) {
            return key
        }
    }

    const guardar = async () => {
        try {
            const input = {
                tipo: tipo,
                estado: "ACTIVO"
            }
            if (editar.dato !== null) {
                const { data } = await actualizar({ variables: { id: editar.dato.id, input } });
                if (data.actualizarTipoProveduria.estado) {
                    Notification['success']({
                        title: 'Guardar Tipo de Proveduría',
                        duration: 5000,
                        description: data.actualizarTipoProveduria.message
                    })
                } else {
                    Notification['error']({
                        title: 'Guardar Tipo de Proveduría',
                        duration: 5000,
                        description: data.actualizarTipoProveduria.message
                    })
                }
                setEditar({ dato: null, estado: false });
            } else {
                const { data } = await insertar({ variables: { input } });
                if (data.insertarTipoProveduria.estado) {
                    Notification['success']({
                        title: 'Guardar Tipo de Proveduría',
                        duration: 5000,
                        description: data.insertarTipoProveduria.message
                    })
                } else {
                    Notification['error']({
                        title: 'Guardar Tipo de Proveduría',
                        duration: 5000,
                        description: data.insertarTipoProveduria.message
                    })
                }
            }
        } catch (error) {
            Notification['error']({
                title: 'Guardar Tipo de Proveduría',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el tipo de proveduría"
            })
            console.log(error);
        }
        setTipo('');
        setNuevo(false);
    }

    const editarDato = (edit) => {
        setEditar(edit);
        setTipo(edit.dato.tipo)
    }

    const cancelar = () => {
        setNuevo(false);
        setEditar({ dato: null, estado: false });
        setTipo('');
    }

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de tipos de proveduría, verificar tu conexión a internet'
        })
    }

    const dataTipo = getData();

    return (
        <>
            {props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && rol.tipo === "ADMINISTRADOR" && (rol.permisos.some(permiso => permiso.descripcion === "CONFIGURACIONES GENERALES"))) ? '' : <Redirect to="/login" />}
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config`)} icon="arrow-left-line" tooltip="Ir a Configuraciones Generales" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Gestion de Tipos de Proveduría</h3>
            <div className="input-group mt-3 mb-3">
                <input id="filter" type="text" placeholder="Busqueda por nombre" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
            </div>
            <div className="mt-3">
                <div>
                    <Table height={500} data={dataTipo}>
                        <Column width={500} flexGrow={1}>
                            <HeaderCell>Tipo de Producto</HeaderCell>
                            <Cell dataKey='tipo' />
                        </Column>
                        <Column width={150} fixed="right">
                            <HeaderCell>Acciones</HeaderCell>
                            <Cell>
                                {
                                    rowData => {
                                        return (
                                            <>
                                                <div className="d-inline-block mx-2">
                                                    <Action tooltip="Editar" icon="edit" color="orange" onClick={() => editarDato({ dato: rowData, estado: true })} size="xs" />
                                                </div>
                                                <div className="d-inline-block">
                                                    <Action tooltip="Eliminar" icon="trash" color="red" onClick={() => setConfirmation({ bool: true, id: rowData.id })} size="xs" />
                                                </div>
                                            </>
                                        );
                                    }
                                }
                            </Cell>
                        </Column>
                    </Table>
                </div>
                <Pagination
                    first={false}
                    last={false}
                    next={false}
                    prev={false}
                    showInfo={false}
                    showLengthMenu={false}
                    activePage={page}
                    displayLength={displayLength}
                    total={tipos.obtenerTipoProveduria.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            </div>
            {!nuevo && !editar.estado &&
                <div className="d-flex justify-content-start">
                    <Boton name="Nuevo" tooltip="Nuevo Tipo de Proveduría" color="green" icon="plus" size="sm" position="end" onClick={() => setNuevo(true)} />
                </div>
            }
            { (nuevo || editar.estado) &&
                <>
                    <hr className="border border-dark" />
                    <h4>{(nuevo) ? ("Agregar Tipo de Proveduría") : ("Editar Tipo de Proveduría")}</h4>
                    <div className="input-group mt-3 mb-3">
                        <input id="nombre_tipo" type="text" placeholder="Nombre del tipo de proveduría" className="rounded-0 form-control" value={tipo} onChange={(e) => setTipo(e.target.value)} />
                    </div>
                    <div className="row">
                        <div className="col-md-6 float-left">
                            <Boton name="Cancelar" icon="close" color="red" onClick={() => cancelar()} tooltip="Cancelar" />
                        </div>
                        <div className="d-flex justify-content-end col-md-6 float-right">
                            <Boton name="Guardar" icon="save" color="green" onClick={() => guardar()} tooltip="Guardar" />
                        </div>
                    </div>
                </>
            }
            {isConfirmation}
        </>
    );
}

export default withRouter(TipoProveduria)