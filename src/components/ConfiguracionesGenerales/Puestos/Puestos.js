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
    OBTENER_PUESTOS,
    SAVE_PUESTO,
    UPDATE_PUESTO,
    DELETE_PUESTO
} from '../../../services/PuestoService';
import {Redirect} from 'react-router-dom';
const { Column, HeaderCell, Cell, Pagination } = Table;

const Puesto = ({...props}) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [confimation, setConfirmation] = useState(false);
    const [filter, setFilter] = useState('');
    const [nuevo, setNuevo] = useState(false);
    const [editar, setEditar] = useState({ dato: null, estado: false });
    const [nombre, setNombre] = useState('');
    const [salario, setSalario] = useState(0);
    const { loading, error, data: tipos } = useQuery(OBTENER_PUESTOS, { pollInterval: 1000 });
    const [insertar] = useMutation(SAVE_PUESTO);
    const [actualizar] = useMutation(UPDATE_PUESTO);
    const [desactivar] = useMutation(DELETE_PUESTO);

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const onDeletObjeto = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        if (data.desactivarPuesto.estado) {
            Notification['success']({
                title: 'Eliminar Puesto',
                duration: 5000,
                description: data.desactivarPuesto.message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Puesto',
                duration: 5000,
                description: data.desactivarPuesto.message
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
        return tipos.obtenerPuestos.filter((value, index) => {
            if (filter !== "") {
                return getFilteredByKey(value, filter);
            }
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return index >= start && index < end;
        });
    }

    function getFilteredByKey(value, key) {
        const val = value.nombre.toLowerCase();
        const val2 = key.toLowerCase();
        if (val.includes(val2)) {
            return key
        }
    }

    const guardar = async () => {
        try {
            const input = {
                nombre: nombre,
                salario: salario,
                estado: "ACTIVO"
            }
            if (editar.dato !== null) {
                const { data } = await actualizar({ variables: { id: editar.dato.id, input } });
                if (data.actualizarPuesto.estado) {
                    Notification['success']({
                        title: 'Guardar Puesto',
                        duration: 5000,
                        description: "Puesto, editado correctamente"
                    })
                } else {
                    Notification['error']({
                        title: 'Guardar Puesto',
                        duration: 5000,
                        description: data.actualizarPuesto.message
                    })
                }
                setEditar({ dato: null, estado: false });
            } else {
                const { data } = await insertar({ variables: { input } });
                if (data.insertarPuesto.estado) {
                    Notification['success']({
                        title: 'Guardar Puesto',
                        duration: 5000,
                        description: "Puesto, agregado correctamente"
                    })
                } else {
                    Notification['error']({
                        title: 'Guardar Puesto',
                        duration: 5000,
                        description: data.insertarPuesto.message
                    })
                }
            }
        } catch (error) {
            Notification['error']({
                title: 'Guardar Puesto',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el Puesto"
            })
            console.log(error);
        }
        setNombre('');
        setSalario(0)
        setNuevo(false);
    }

    const editarDato = (edit) => {
        setNuevo(false)
        setEditar(edit);
        setNombre(edit.dato.nombre)
        setSalario(edit.dato.salario)
    }

    const cancelar = () => {
        setNuevo(false);
        setEditar({ dato: null, estado: false });
        setNombre('');
        setSalario(0)
    }

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de puestos, verificar tu conexión a internet'
        })
    }

    const dataPuestos = getData();

    return (
        <>
            {props.session && props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && rol.tipo === "ADMINISTRADOR" && (rol.permisos.some(permiso => permiso.descripcion === "CONFIGURACIONES GENERALES"))) ? '' : <Redirect to="/login" />}
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config`)} icon="arrow-left-line" tooltip="Ir a Configuraciones Generales" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Gestión de Puestos</h3>
            <div className="input-group mt-3 mb-3">
                <input id="filter" type="text" placeholder="Busqueda por nombre" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
            </div>
            <div className="mt-3">
                <div>
                    <Table height={500} data={dataPuestos}>
                        <Column width={250} flexGrow={1}>
                            <HeaderCell>Nombre</HeaderCell>
                            <Cell dataKey='nombre' />
                        </Column>
                        <Column width={250} flexGrow={1}>
                            <HeaderCell>Valor Hora</HeaderCell>
                            <Cell dataKey='salario' />
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
                    total={tipos.obtenerPuestos.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            </div>
            {!nuevo && !editar.estado &&
                <div className="d-flex justify-content-start">
                    <Boton name="Nuevo" tooltip="Nuevo Tipo de Producto" color="green" icon="plus" size="sm" position="end" onClick={() => setNuevo(true)} />
                </div>
            }
            { (nuevo || editar.estado) &&
                <>
                    <hr className="border border-dark" />
                    <h4 >{(nuevo) ? ("Agregar Tipo de Producto") : ("Editar Tipo de Producto")}</h4>
                    <div className="row">
                        <h6 className="my-2">Nombre del Puesto</h6>
                        <input id="nombre_puesto" type="text" placeholder="Nombre del puesto" className="rounded-0 form-control m-2" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        <h6 className="my-2">Pago por hora</h6>
                        <input id="salario_precio" type="number" placeholder="Pago por hora" className="rounded-0 form-control m-2" value={salario} onChange={(e) => setSalario(e.target.value)} />
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

export default withRouter(Puesto)