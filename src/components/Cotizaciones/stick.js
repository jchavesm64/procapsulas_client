/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_COTIZACION } from '../../services/CotizacionService'
import { Notification, Table, Input, InputGroup, Icon } from 'rsuite';
import Boton from '../shared/Boton';
const { Column, HeaderCell, Cell } = Table;

const Stick = ({ ...props }) => {
    const [insertar] = useMutation(SAVE_COTIZACION)
    const [cotizacion, setCotizacion] = useState(null)
    const [venta, setVenta] = useState(0)
    const [envases, setEnvases] = useState(0)
    const [etiquetas, setEtiquetas] = useState(0)
    const [costoEtiquetas, setCostoEtiquetas] = useState(0)
    const [peso, setPeso] = useState(0)
    const [utilidad, setUtilidad] = useState(0);
    const { formula, cliente, producto } = props

    if (formula !== null && cotizacion === null) {
        const datos = []
        for (let i = 0; i < formula.elementos.length; i++) {
            datos.push({
                materia_prima: formula.elementos[i].materia_prima,
                porcentaje: formula.porcentajes[i],
                precio_kilo: formula.elementos[i].movimientos[0].precio_unidad
            })
        }
        setCotizacion(datos)
    }

    const getGramosScoop = (porcentaje) => {
        if (peso > 0) {
            return parseFloat((porcentaje * peso) / 100).toFixed(4)
        }
        return 0
    }

    const getGramosEnvase = (porcentaje) => {
        if (peso > 0 && envases > 0) {
            return parseFloat(getGramosScoop(porcentaje) * envases).toFixed(4)
        }
        return 0
    }

    const getKilosTotal = (porcentaje) => {
        if (peso > 0 && envases > 0) {
            return parseFloat(getGramosEnvase(porcentaje) / 1000).toFixed(4)
        }
        return 0
    }

    const getTotalFila = (porcentaje, precio) => {
        if (peso > 0 && envases > 0) {
            return parseFloat(getKilosTotal(porcentaje) * precio).toFixed(4)
        }
        return 0
    }

    const getTotalTabla = () => {
        var total = 0;
        cotizacion.map(item => {
            total += parseFloat(getTotalFila(item))
        })
        return total
    }

    const getTotal = () => {
        if (cotizacion) {
            var total = 0, item = null
            for (let i = 0; i < cotizacion.length; i++) {
                item = cotizacion[i]
                if (item.precio_kilo !== 0) {
                    total += parseFloat(getTotalFila(item.porcentaje, item.precio_kilo))
                }
            }
            total += parseFloat(etiquetas * costoEtiquetas)
            return parseFloat(total).toFixed(4)
        }
    }

    const getCostoEnvace = () => {
        if (envases > 0) {
            return parseFloat(getTotal() / envases).toFixed(4)
        }
        return 0
    }

    //Revisar
    const onSaveCotizacion = async () => {
        var input = {}
        var ele = [], por = [], precio = []
        cotizacion.map(item => {
            ele.push(item.materia_prima.id)
            por.push(item.porcentaje)
            precio.push(item.precio_kilo)
        })
        input = {
            formula: formula.id,
            presentacion: producto.id,
            cliente: cliente.id,
            peso: peso,
            elementos: ele,
            porcentajes: por,
            precios: precio,
            cant_env: envases,
            cant_eti: etiquetas,
            cost_eti: costoEtiquetas,
            venta: ((getTotal() / envases) + (((getTotal() / envases) * utilidad) / 100)),
            estado: 'REGISTRADA',
            status: 'ACTIVO'
        }
        console.log(input)
        try {
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' })
            const { estado, message } = data.insertarCotizacion;
            if (estado) {
                Notification['success']({
                    title: 'Guardar Cotización',
                    duration: 5000,
                    description: message
                })
                props.history.push('/cotizaciones')
            } else {
                Notification['error']({
                    title: 'Guardar Cotización',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Guardar Cotización',
                duration: 5000,
                description: "Hubo un error inesperado al guardar la cotización"
            })
        }
    }

    const validarFormulario = () => {
        return !formula || !cliente || !producto || !peso || envases === 0 || etiquetas === 0 || costoEtiquetas < 0 || utilidad === 0 || getTotal() === 0
    }

    const actualizarPrecio = (data, precio) => {
        var newDatos = []
        if (precio !== "") {
            if (parseFloat(precio) >= 1) {
                cotizacion.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            porcentaje: item.porcentaje,
                            precio_kilo: parseFloat(precio).toFixed(4)
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion(newDatos)
            } else {
                cotizacion.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            porcentaje: item.porcentaje,
                            precio_kilo: 0
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion(newDatos)
            }
        } else {
            cotizacion.map(item => {
                if (item.materia_prima.id === data.materia_prima.id) {
                    newDatos.push({
                        materia_prima: item.materia_prima,
                        porcentaje: item.porcentaje,
                        precio_kilo: 0
                    })
                } else {
                    newDatos.push(item)
                }
            })
            setCotizacion(newDatos)
        }
    }

    return (
        <>
            <h5>Parámetros específicos de la cotización</h5>
            <div className="row my-2">
                <div className="col-md-6">
                    <h6>Total de envases</h6>
                    <Input type="number" min={1} value={envases} onChange={(e) => setEnvases(e)} />
                    <h6>Total de Empaques</h6>
                    <Input type="number" min={1} value={etiquetas} onChange={(e) => setEtiquetas(e)} />
                </div>
                <div className="col-md-6">
                    <h6>Costo por Empaque</h6>
                    <InputGroup size="md" className="w-90 mx-auto">
                        <InputGroup.Addon size="md">
                            <Icon icon="fas fa-dollar-sign" />
                        </InputGroup.Addon>
                        <Input type="number" min={1} value={costoEtiquetas} onChange={(e) => setCostoEtiquetas(e)} />
                    </InputGroup>
                    <h6>Cantidad del producto</h6>
                    <Input type="number" searchable={true} onChange={(e) => setPeso(e)} />
                </div>
            </div>
            <h5>Elementos de la formula</h5>
            <div>
                <Table className="shadow my-2" autoHeight data={cotizacion}>
                    <Column flexGrow={2}>
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
                    <Column flexGrow={1}>
                        <HeaderCell>GR / Scoop</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getGramosScoop(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Cantidad GR</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getGramosEnvase(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Cantidad KG</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{getKilosTotal(rowData.porcentaje)}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Precio / KG</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (
                                        <InputGroup size="md" className="w-90 mx-auto" style={{ padding: 0, minHeight: 36, marginTop: -10 }}>
                                            <InputGroup.Addon size="md">
                                                <Icon icon="fas fa-dollar-sign" />
                                            </InputGroup.Addon>
                                            <Input type="number" className="form-control text-center" defaultValue={rowData.precio_kilo} onChange={(e) => actualizarPrecio(rowData, e)} />
                                        </InputGroup>
                                    )
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Total</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (
                                        <InputGroup size="md" className="w-90 mx-auto" style={{ padding: 0, minHeight: 36, marginTop: -10 }}>
                                            <InputGroup.Addon size="md">
                                                <Icon icon="fas fa-dollar-sign" />
                                            </InputGroup.Addon>
                                            <label className="mt-2">{getTotalFila(rowData.porcentaje, rowData.precio_kilo)}</label>
                                        </InputGroup>
                                    )
                                }
                            }
                        </Cell>
                    </Column>
                </Table>
                <div className="d-flex justify-content-end mb-3 mt-1">
                    <h6>Total: <Icon icon="fas fa-dollar-sign" /> {getTotal(cotizacion === null ? [] : cotizacion)}</h6>
                </div>
                <div className="row my-2 p-2">
                    <h6>Coste de Fabricación por Envase</h6>
                    <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{getCostoEnvace()}</label></strong>
                    <h6>Porcentaje de Ganancia por Envase</h6>
                    <Input type="number" min={1} value={utilidad} onChange={(e) => setUtilidad(e)} />
                    <h6>Ganancia</h6>
                    <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat(((getTotal() / envases) * utilidad) / 100).toFixed(4)}</label></strong>
                    <h6>Precio Final</h6>
                    <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat((getTotal() / envases) + (((getTotal() / envases) * utilidad) / 100)).toFixed(4)}</label></strong>
                </div>
                <div className="d-flex justify-content-end my-2">
                    <Boton name="Guardar Cotización" icon="plus" color="green" tooltip="Guardar Cotización" onClick={() => onSaveCotizacion()} disabled={validarFormulario()} />
                </div>
            </div>
        </>
    )

}

export default withRouter(Stick)