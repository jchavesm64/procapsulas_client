import React, { useState, useEffect } from 'react'
import { Notification, Loader, Table, InputPicker } from 'rsuite'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router-dom'
import Action from '../../shared/Action'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_FORMULA } from '../../../services/FormulaService'
import { OBTENER_MATERIAS_PRIMAS } from '../../../services/MateriaPrimaService'
import { OBTENER_FORMULAS_BASE } from '../../../services/FormulaBaseService'
import { Input } from 'rsuite';
const { Column, HeaderCell, Cell, Pagination } = Table;

const FormularioFormula = ({ props, formula }) => {
    const [datos, setDatos] = useState(formula.elementos)
    const [nombre, setNombre] = useState(formula.nombre)
    const [tipo, setTipo] = useState(formula.tipo)
    const [base, setBase] = useState(formula.base === undefined ? '' : formula.base.id)
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const [filter, setFilter] = useState('');
    const { loading, error, data: materias_primas } = useQuery(OBTENER_MATERIAS_PRIMAS, { pollInterval: 1000 });
    const { loading: load_formulas, error: error_formulas, data: formulas } = useQuery(OBTENER_FORMULAS_BASE, { pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_FORMULA)
    const [editar, setEditar] = useState({ dato: null, bool: false, porcentaje: 0 });

    useEffect(() => {
        setNombre(formula.nombre)
        setDatos(formula.elementos)
        setTipo(formula.tipo)
        setBase(formula.base === undefined ? '' : formula.base.id)
    }, [formula])

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

    const removerDato = async (dato) => {
        var index = 0, newDatos = [];
        datos.map(item => {
            newDatos.push(item)
        })
        for (var i = 0; i < newDatos.length; i++) {
            if (newDatos[i].materia_prima.id === dato.materia_prima.id) {
                console.log(newDatos[i], i)
                index = i;
            }
        }
        newDatos.splice(index, 1);
        console.log(newDatos)
        setDatos(newDatos)
    }

    function getTotal(datos) {
        var porcentaje = 0;
        datos.map(item => {
            porcentaje += item.porcentaje;
        })
        return porcentaje;
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

    const agregarElemento = async (materia) => {
        const porcentaje = document.getElementById('txt_porcentaje_' + materia.id).value;
        if (validarAgregado(datos, materia)) {
            var newData = []
            datos.map(item => {
                newData.push(item);
            })
            newData.push({
                materia_prima: materia,
                porcentaje: parseFloat(porcentaje)
            })
            setDatos(newData)
        } else {
            Notification['warning']({
                title: 'Agregar Elemento',
                duration: 5000,
                description: "Materia prima ya agregada"
            })
        }
    }

    const agregarModificado = () => {
        var newData = []
        datos.map(item => {
            newData.push(item);
        })
        newData.map(item => {
            if (editar.dato.materia_prima.id === item.materia_prima.id) {
                item.porcentaje = editar.porcentaje;
            }
        })
        setEditar(false)
        //setDatos()
    }

    const onSaveFormula = async () => {
        if (getTotal(datos) === 100) {
            try {
                var elementos = [], porcentajes = []
                datos.map(item => {
                    elementos.push(item.materia_prima.id)
                    porcentajes.push(item.porcentaje)
                })
                var input = {}
                if(!base){
                    input = {
                        nombre,
                        tipo,
                        elementos,
                        porcentajes,
                        estado: 'ACTIVO'
                    }
                }else{
                    input = {
                        nombre,
                        tipo,
                        elementos,
                        porcentajes,
                        formulaBase: base.id,
                        estado: 'ACTIVO'
                    }
                }
                const { data } = await actualizar({ variables: { id: formula.id, input } })
                const { estado, message } = data.actualizarFormula;
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

    const validarFormula = () => {
        return datos.length === 0 || !nombre;
    }

    const getFormulasBase = () => {
        if(formulas !== null){
            if(formulas.obtenerFormulasBase){
                var datos = []
                formulas.obtenerFormulasBase.map(item => {
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

    if (loading || load_formulas) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de fórmulas, verificar tu conexión a internet'
        })
    }
    if (error_formulas) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de fórmulas, verificar tu conexión a internet'
        })
    }

    const data = getData()
    console.log(base)

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config/formulas`)} icon="arrow-left-line" tooltip="Ir a fórmulas" size="xs" color="blue" />
            </div>
            <div class="row my-1">
                <div className="col-md-4">
                    <h6 className="my-1">Tipo de Cápsula</h6>
                    <InputPicker className="w-100" data={[{ label: 'Polvo', value: 'POLVO' }, { label: 'Blanda', value: 'BLANDA' }]} placeholder="Tipo de Cápsula" value={tipo} onChange={(e) => setTipo(e)} />
                </div>
                <div className="col-md-8">
                    <h5>Nombre de la fórmula</h5>
                    <Input className="my-1" type="text" placeholder="Nombre de la fórmula" value={nombre} onChange={(e) => setNombre(e)} />
                </div>
            </div>
            {tipo === 'BLANDA' &&
                <div className="row my-1 p-2">
                    <h6>Fórmula Base</h6>
                    <InputPicker data={getFormulasBase()} placeholder="Fórmula Base" value={base} onChange={(e) => setBase(e)} />
                </div>
            }
            <div className="my-2">
                <Table className="shadow-lg" height={300} autoHeight data={datos}>
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
                                        <>
                                            <div className="d-inline-block mx-2">
                                                <Action tooltip="Remover Materia Prima" icon="trash" color="orange" onClick={() => removerDato(rowData)} size="xs" />
                                            </div>
                                            <div className="d-inline-block mx-2">
                                                <Action tooltip="Editar Materia Prima" icon="edit" color="green" onClick={() => setEditar({ dato: rowData, bool: true, porcentaje: rowData.porcentaje })} size="xs" />
                                            </div>
                                        </>
                                    )
                                }
                            }
                        </Cell>
                    </Column>
                </Table>
            </div>
            <h5 className="my-2">Porcentaje total: <strong>{getTotal(datos)}</strong></h5>
            {getTotal(datos) > 100 &&
                <div className="alert alert-warning" role="alert">
                    Los porcentajes no son correctos
                </div>
            }
            {(!editar.bool) ?
                (
                    <>
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
                    </>
                ) : (
                    <div className="my-2 bg-white shadow rounded p-2">
                        <h5>Editar Elemento</h5>
                        <div className="row my-2">
                            <div className="col-md-3">
                                <h6>{editar.dato.materia_prima.nombre}</h6>
                            </div>
                            <div className="col-md-9">
                                <Input id="txt_porcentaje_editar" className="form-control text-center" type="number" value={editar.porcentaje} max={100} min={1} onChange={(e) => setEditar({ dato: editar.dato, bool: true, porcentaje: parseFloat(e) })} />
                            </div>
                        </div>
                        <div className="d-flex justify-content-end">
                            <Boton name="Guardar" icon="save" color="green" tooltip="Guardar Cambio" onClick={() => agregarModificado()} />
                        </div>
                    </div>
                )

            }

        </>
    )

}

export default withRouter(FormularioFormula);