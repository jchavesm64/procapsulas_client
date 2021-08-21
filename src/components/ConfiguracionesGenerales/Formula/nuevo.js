/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import Boton from '../../shared/Boton';
import Action from '../../shared/Action';
import {
    Table,
    Loader,
    Notification,
    InputPicker,
    Checkbox
} from 'rsuite';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { SAVE_FORMULA } from '../../../services/FormulaService'
import { OBTENER_MATERIAS_PRIMAS } from '../../../services/MateriaPrimaService'
import { OBTENER_FORMULAS_BASE } from '../../../services/FormulaBaseService'
import { OBTENER_CLIENTES } from '../../../services/ClienteService'
import { Input } from 'rsuite';
const { Column, HeaderCell, Cell, Pagination } = Table;

const NuevaFormula = ({ ...props }) => {
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const { loading, error, data: materias_primas } = useQuery(OBTENER_MATERIAS_PRIMAS, { pollInterval: 1000 });
    const { loading: load_formulas, error: error_formulas, data: formulas } = useQuery(OBTENER_FORMULAS_BASE, { pollInterval: 1000 });
    const { loading: load_clientes, error: error_clientes, data: clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 });
    const [formula, setFormula] = useState([])
    const [filter, setFilter] = useState('')
    const [nombre, setNombre] = useState("")
    const [base, setBase] = useState('')
    const [mostrar, setMostrar] = useState(false)
    const [cliente, setCliente] = useState('')
    const [insertar] = useMutation(SAVE_FORMULA)

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const getData = () => {
        return materias_primas.obtenerMateriasPrimas.filter((value, index) => {
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

    const onSaveFormula = async () => {
        if (getTotal(formula) === 100) {
            try {
                var elementos = [], porcentajes = []
                formula.map(item => {
                    elementos.push(item.materia_prima.id)
                    porcentajes.push(item.porcentaje)
                })
                var input = {}
                if (!base) {
                    input = {
                        nombre,
                        elementos,
                        porcentajes,
                        estado: 'ACTIVO'
                    }
                } else {
                    input = {
                        nombre,
                        elementos,
                        porcentajes,
                        formulaBase: base.id,
                        estado: 'ACTIVO'
                    }
                }
                const { data } = await insertar({ variables: { input } })
                const { estado, message } = data.insertarFormula;
                console.log(estado, message)
                if (estado) {
                    Notification['success']({
                        title: 'Guardar Fórmula',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/config/formulas`);
                } else {
                    Notification['error']({
                        title: 'Guardar Fórmula',
                        duration: 5000,
                        description: message
                    })
                }
            } catch (error) {
                console.log(error)
                Notification['error']({
                    title: 'Guardar Fórmula',
                    duration: 5000,
                    description: "Hubo un error inesperado al guardar la fórmula"
                })
            }
        } else {
            Notification['warning']({
                title: 'Agregar Elemento',
                duration: 5000,
                description: "Los porcentajes no son correcto"
            })
        }
    }

    function validarPorcentajes(datos, value) {
        if (datos.length === 0) {
            return true
        } else {
            var porcentaje = 0;
            datos.map(item => {
                porcentaje += item.porcentaje;
            })
            return porcentaje + value <= 100;
        }
    }

    function validarAgregado(datos, dato) {
        if (datos.length === 0) {
            return true
        } else {
            var aux = null;
            datos.map(item => {
                if (item.materia_prima.id === dato.id) {
                    aux = item;
                }
            })
            return aux === null;
        }
    }

    function getTotal(datos) {
        var porcentaje = 0;
        datos.map(item => {
            porcentaje += item.porcentaje;
        })
        return porcentaje;
    }

    const agregarElemento = async (materia) => {
        const porcentaje = document.getElementById('txt_porcentaje_' + materia.id).value;
        if (validarAgregado(formula, materia)) {
            if (validarPorcentajes(formula, parseFloat(porcentaje))) {
                var newData = []
                formula.map(item => {
                    newData.push(item);
                })
                newData.push({
                    materia_prima: materia,
                    porcentaje: parseFloat(porcentaje)
                })
                setFormula(newData)
            } else {
                Notification['warning']({
                    title: 'Agregar Elemento',
                    duration: 5000,
                    description: "Los porcentajes no son correcto"
                })
            }
        } else {
            Notification['warning']({
                title: 'Agregar Elemento',
                duration: 5000,
                description: "Materia prima ya agregada"
            })
        }
    }

    const removerDato = async (dato) => {
        console.log(dato)
        var index = 0, newDatos = [];
        formula.map(item => {
            newDatos.push(item)
        })
        for (var i = 0; i < newDatos.length; i++) {
            if (newDatos[i].materia_prima.id === dato.materia_prima.id) {
                index = i;
            }
        }
        newDatos.splice(index, 1);
        setFormula(newDatos)
    }

    const validarFormula = () => {
        if (mostrar === true) {
            return formula.length === 0 || !nombre || !base;
        }
        return formula.length === 0 || !nombre;
    }

    const getFormulasBase = () => {
        if (formulas !== null) {
            if (formulas.obtenerFormulasBase) {
                var datos = []
                formulas.obtenerFormulasBase.map(item => {
                    datos.push({
                        label: item.nombre,
                        value: item
                    })
                })
                return datos
            }
        }
        return []
    }

    const getClientes = () => {
        if (clientes !== null) {
            if (clientes.obtenerClientes) {
                var datos = []
                clientes.obtenerClientes.map(item => {
                    datos.push({
                        label: item.nombre,
                        value: item.id
                    })
                })
                return datos
            }
        }
        return []
    }

    if (loading || load_formulas || load_clientes) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de materias primas, verificar tu conexión a internet'
        })
    }
    if (error_formulas) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de fórmulas, verificar tu conexión a internet'
        })
    }
    if (error_clientes) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de clientes, verificar tu conexión a internet'
        })
    }

    const data = getData()

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config/formulas`)} icon="arrow-left-line" tooltip="Ir a Fórmulas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Gestión de formulas</h3>
            <hr />
            <div className="row">
                <div className="col-md-5">
                    <h6 className="my-1">Cliente</h6>
                    <InputPicker className="w-100" data={getClientes()} placeholder="Cliente" value={cliente} onChange={(e) => setCliente(e)} />
                </div>
                <div className="col-md-7">
                    <h5>Nombre de la fórmula</h5>
                    <Input className="my-1" type="text" placeholder="Nombre de la fórmula" value={nombre} onChange={(e) => setNombre(e)} />
                </div>
            </div>
            <Checkbox onChange={() => setMostrar(!mostrar)}>Marcar si la fórmula requiere de una fórmula base</Checkbox>
            {mostrar === true &&
                <div className="row my-1 p-2">
                    <h6>Fórmula Base</h6>
                    <InputPicker data={getFormulasBase()} placeholder="Fórmula Base" value={base} onChange={(e) => setBase(e)} />
                </div>
            }
            <h5 className="my-2">Elementos de la fórmula</h5>
            <Table className="shadow-lg" height={420} autoHeight data={formula}>
                <Column flexGrow={1}>
                    <HeaderCell>Materia Prima</HeaderCell>
                    <Cell>
                        {
                            rowData => {
                                return (<label>{rowData.materia_prima.nombre}</label>)
                            }
                        }
                    </Cell>
                </Column>
                <Column flexGrow={1}>
                    <HeaderCell>Porcentaje</HeaderCell>
                    <Cell dataKey="porcentaje" />
                </Column>
                <Column width={150} fixed="right">
                    <HeaderCell>Acciones</HeaderCell>
                    <Cell>
                        {
                            rowData => {
                                return (
                                    <div className="d-inline-block mx-2">
                                        <Action tooltip="Remover Materia Prima" icon="trash" color="orange" onClick={() => removerDato(rowData)} size="xs" />
                                    </div>
                                )
                            }
                        }
                    </Cell>
                </Column>
            </Table>
            <h5 className="my-2">Porcentaje total: <strong>{getTotal(formula)}</strong></h5>
            <hr />
            <div className="d-flex justify-content-end">
                <Boton name="Guardar" icon="save" color="green" tooltip="Guarda la fórmula" disabled={validarFormula()} onClick={() => onSaveFormula()} />
            </div>
            <h5 className="my-1">Materias Primas</h5>
            <div className="input-group mt-3 mb-3">
                <input id="filter" type="text" placeholder="Busqueda por nombre" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
            </div>
            <div>
                <Table className="shadow-lg" height={500} data={data}>
                    <Column flexGrow={1}>
                        <HeaderCell>Materia Prima</HeaderCell>
                        <Cell dataKey="nombre" />
                    </Column>
                    <Column flexGrow={1} style={{ padding: 0, margin: 0 }}>
                        <HeaderCell>Porcentaje</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (
                                        <Input id={"txt_porcentaje_" + rowData.id} style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" type="number" defaultValue={1} max={100} min={1} />
                                    )
                                }
                            }
                        </Cell>
                    </Column>
                    <Column width={150} fixed="right">
                        <HeaderCell>Acciones</HeaderCell>
                        <Cell style={{ padding: 0 }}>
                            {
                                rowData => {
                                    return (
                                        <div className="d-inline-block mx-2">
                                            <Action tooltip="Agregar Materia Prima" icon="plus" color="green" onClick={() => agregarElemento(rowData)} size="xs" />
                                        </div>
                                    )
                                }
                            }
                        </Cell>
                    </Column>
                </Table>
                <Pagination
                    first={false}
                    last={false}
                    next={false}
                    prev={false}
                    showInfo={false}
                    showLengthMenu={false}
                    activePage={page}
                    displayLength={displayLength}
                    total={materias_primas.obtenerMateriasPrimas.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            </div>

        </div>
    )
}

export default withRouter(NuevaFormula);