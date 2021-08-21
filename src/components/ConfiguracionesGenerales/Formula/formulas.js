import React, { useState } from 'react'
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
    OBTENER_FORMULAS,
    DELETE_FORMULA
} from '../../../services/FormulaService'
import { Redirect, Link } from 'react-router-dom';
const { Column, HeaderCell, Cell, Pagination } = Table;

const Formulas = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [confimation, setConfirmation] = useState(false);
    const [filter, setFilter] = useState('');
    const { loading, error, data: formulas } = useQuery(OBTENER_FORMULAS, { pollInterval: 1000 });
    const [desactivar] = useMutation(DELETE_FORMULA);

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const onDeletObjeto = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarFormula
        if (estado) {
            Notification['success']({
                title: 'Eliminar Fórmula',
                duration: 5000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Fórmula',
                duration: 5000,
                description: message
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
        return formulas.obtenerFormulas.filter((value, index) => {
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

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de las fórmulas, verificar tu conexión a internet'
        })
    }

    console.log(formulas)
    const dataFormulas = getData();

    return (
        <>
            {props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && rol.tipo === "ADMINISTRADOR" && (rol.permisos.some(permiso => permiso.descripcion === "FORMULAS"))) ? '' : <Redirect to="/login" />}
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config`)} icon="arrow-left-line" tooltip="Ir a Configuraciones Generales" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Gestión de Fórmulas</h3>
            <div className="input-group mt-3 mb-3">
                <input id="filter" type="text" placeholder="Busqueda por nombre" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
            </div>
            <div className="mt-3">
                <div>
                    <Table height={500} data={dataFormulas}>
                        <Column width={500} flexGrow={1}>
                            <HeaderCell>Fórmula</HeaderCell>
                            <Cell dataKey='nombre' />
                        </Column>
                        <Column width={500} flexGrow={1}>
                            <HeaderCell>Cliente</HeaderCell>
                            <Cell>
                                {
                                    rowData => {
                                        return(<label>{rowData.cliente ? rowData.cliente.nombre : "No se asigno un cliente"}</label>)
                                    }
                                }
                            </Cell>
                        </Column>
                        <Column width={150} fixed="right">
                            <HeaderCell>Acciones</HeaderCell>
                            <Cell>
                                {
                                    rowData => {
                                        return (
                                            <>
                                                <div className="d-inline-block mx-2">
                                                    <Link to={`/config/formulas/editar/` + rowData.id}><Action tooltip="Editar" icon="edit" color="orange" size="xs" /></Link>
                                                </div>
                                                <div className="d-inline-block mx-2">
                                                    <Action tooltip="Eliminar" icon="trash" color="red" onClick={() => setConfirmation({ bool: true, id: rowData.id })} size="xs" />
                                                </div>
                                                <div className="d-inline-block mx-2">
                                                    <Link to={`/config/formulas/detalles/` + rowData.id}><Action tooltip="Detalles" icon="info" color="blue" size="xs" /></Link>
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
                    total={formulas.obtenerFormulas.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            </div>
            <div className="d-flex justify-content-start">
                <Link to="/config/formulas/nuevo"><Boton name="Nueva Fórmula" tooltip="Nueva Fórmula" color="green" icon="plus" size="sm" position="end" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Formulas)