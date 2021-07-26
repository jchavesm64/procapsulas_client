import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import Boton from '../../shared/Boton';
import Action from '../../shared/Action';
import {
    Table,
    Loader,
    Notification
} from 'rsuite';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { UPDATE_FORMULA_BASE } from '../../../services/FormulaBaseService'
import { OBTENER_MATERIAS_PRIMAS } from '../../../services/MateriaPrimaService'
import { Input } from 'rsuite';
const { Column, HeaderCell, Cell, Pagination } = Table;

const FormularioFormulaBase = ({ props, formula }) => {
    const [datos, setDatos] = useState(formula.elementos)
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const { loading, error, data: materias_primas } = useQuery(OBTENER_MATERIAS_PRIMAS, { pollInterval: 1000 });
    const [filter, setFilter] = useState('')
    const [nombre, setNombre] = useState("")
    const [actualizar] = useMutation(UPDATE_FORMULA_BASE)

    useEffect(() => {
        setDatos(formula.elementos)
        setNombre(formula.nombre)
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

    const onSaveFormula = async () => {
        try {
            var elementos = []
            datos.map(item => {
                elementos.push(item.materia_prima.id)
            })
            const input = {
                nombre,
                elementos,
                estado: 'ACTIVO'
            }
            const { data } = await actualizar({ variables: { input } })
            const { estado, message } = data.actualizarFormulaBase;
            console.log(estado, message)
            if (estado) {
                Notification['success']({
                    title: 'Guardar Fórmula Base',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/config/formulasbase`);
            } else {
                Notification['error']({
                    title: 'Guardar Fórmula Base',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Guardar Fórmula',
                duration: 5000,
                description: "Hubo un error inesperado al guardar la fórmula base"
            })
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

    const agregarElemento = async (materia) => {
        if (validarAgregado(datos, materia)) {
            var newData = []
            datos.map(item => {
                newData.push(item);
            })
            newData.push({
                materia_prima: materia,
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

    const removerDato = async (dato) => {
        var index = 0, newDatos = [];
        datos.map(item => {
            newDatos.push(item)
        })
        for (var i = 0; i < newDatos.length; i++) {
            if (newDatos[i].materia_prima.id === dato.materia_prima.id) {
                index = i;
            }
        }
        newDatos.splice(index, 1);
        setDatos(newDatos)
    }

    const validarFormula = () => {
        return formula.length === 0 || !nombre;
    }

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de fórmulas, verificar tu conexión a internet'
        })
    }

    const data = getData()

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config/formulasbase`)} icon="arrow-left-line" tooltip="Ir a Fórmulas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Gestión de formulas</h3>
            <hr />
            <div class="row my-1">
                <h5>Nombre de la fórmula</h5>
                <Input className="my-1" type="text" placeholder="Nombre de la fórmula" value={nombre} onChange={(e) => setNombre(e)} />
            </div>
            <h5 className="my-2">Elementos de la fórmula</h5>
            <Table className="shadow-lg" height={200} autoHeight data={datos}>
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

export default withRouter(FormularioFormulaBase);