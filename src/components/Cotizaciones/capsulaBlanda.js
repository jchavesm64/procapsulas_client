/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_COTIZACION } from '../../services/CotizacionService'
import { Notification, Table, Input, InputPicker, Icon, InputGroup } from 'rsuite';
import Boton from '../shared/Boton';
const { Column, HeaderCell, Cell } = Table;

const CapsulaBlanda = ({ ...props }) => {
    const [insertar] = useMutation(SAVE_COTIZACION)
    const [cotizacion, setCotizacion] = useState(null)
    const [venta, setVenta] = useState(0)
    const [cantidad, setCantidad] = useState(0)
    const [envases, setEnvases] = useState(0)
    const [etiquetas, setEtiquetas] = useState(0)
    const [costoEnvase, setCostoEnvase] = useState(0)
    const [costoEtiquetas, setCostoEtiquetas] = useState(0)
    const [peso, setPeso] = useState(0)
    const [utilidad, setUtilidad] = useState(0);
    const { formula, cliente, producto } = props

    if (formula !== null && cotizacion === null) {
        const datos = [], capsula = []
        for (let i = 0; i < formula.elementos.length; i++) {
            datos.push({
                materia_prima: formula.elementos[i].materia_prima,
                porcentaje: formula.porcentajes[i],
                precio_kilo: formula.elementos[i].movimientos[0].precio_unidad
            })
        }
        var base = formula.formulaBase.elementos
        for (let i = 0; i < base.length; i++) {
            capsula.push({
                materia_prima: base[i].materia_prima,
                cantidad_kilo: 0,
                precio_kilo: base[i].movimientos[0].precio_unidad
            })
        }
        capsula.push({
            materia_prima: { id: 'nulo', nombre: 'Agua Purificada' },
            cantidad_kilo: 0,
            precio_kilo: 0
        })
        setCotizacion({ datos: datos, capsula: capsula })
    }

    const actualizarCantidadCapsula = (data, cantidad) => {
        var newDatos = []
        if (cantidad !== "") {
            if (parseFloat(cantidad) > 0) {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: parseFloat(cantidad),
                            precio_kilo: item.precio_kilo
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            } else {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: 0,
                            precio_kilo: item.precio_kilo
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            }
        } else {
            cotizacion.capsula.map(item => {
                if (item.materia_prima.id === data.materia_prima.id) {
                    newDatos.push({
                        materia_prima: item.materia_prima,
                        cantidad_kilo: 0,
                        precio_kilo: item.precio_kilo
                    })
                } else {
                    newDatos.push(item)
                }
            })
            setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
        }
    }

    const actualizarPrecioCapsula = (data, precio) => {
        var newDatos = []
        if (precio !== "") {
            if (parseFloat(precio) > 0) {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: item.cantidad_kilo,
                            precio_kilo: parseFloat(precio)
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            } else {
                cotizacion.capsula.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            cantidad_kilo: item.cantidad_kilo,
                            precio_kilo: 0
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
            }
        } else {
            cotizacion.capsula.map(item => {
                if (item.materia_prima.id === data.materia_prima.id) {
                    newDatos.push({
                        materia_prima: item.materia_prima,
                        cantidad_kilo: item.cantidad_kilo,
                        precio_kilo: 0
                    })
                } else {
                    newDatos.push(item)
                }
            })
            setCotizacion({ datos: cotizacion.datos, capsula: newDatos })
        }
    }

    const getTotalFilaCapsula = (data) => {
        return parseFloat(data.cantidad_kilo * data.precio_kilo).toFixed(4)
    }

    const getTotalCapsula = () => {
        var total = 0
        cotizacion.capsula.map(item => {
            total += parseFloat(getTotalFilaCapsula(item))
        })
        return parseFloat(total).toFixed(4)
    }

    //--------------------------------------------
    const getMiligramosCapsula = (porcentaje) => {
        if (peso > 0) {
            return parseFloat((porcentaje * peso) / 100).toFixed(4)
        }
        return 0
    }

    const getGramosCapsula = (porcentaje) => {
        if (peso > 0) {
            return parseFloat(getMiligramosCapsula(porcentaje) / 1000).toFixed(4);
        }
        return 0
    }

    const getGramosEnvase = (porcentaje) => {
        if (peso > 0 && cantidad > 0) {
            return parseFloat((getMiligramosCapsula(porcentaje) / 1000) * cantidad).toFixed(4);
        }
        return 0
    }

    const getGramosTotal = (porcentaje) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat(((getMiligramosCapsula(porcentaje) / 1000) * cantidad) * envases).toFixed(4);
        }
        return 0
    }

    const getKilos = (porcentaje) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat((((getMiligramosCapsula(porcentaje) / 1000) * cantidad) * envases) / 1000).toFixed(4);
        }
        return 0
    }

    const actualizarPrecio = (data, precio) => {
        var newDatos = []
        if (precio !== "") {
            if (parseFloat(precio) > 0) {
                cotizacion.datos.map(item => {
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
                setCotizacion({ datos: newDatos, capsula: cotizacion.capsula })
            } else {
                cotizacion.datos.map(item => {
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
                setCotizacion({ datos: newDatos, capsula: cotizacion.capsula })
            }
        } else {
            cotizacion.datos.map(item => {
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
            setCotizacion({ datos: newDatos, capsula: cotizacion.capsula })
        }
    }

    const getTotalFila = (data) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat(getKilos(data.porcentaje) * data.precio_kilo).toFixed(4)
        }
        return 0
    }

    const getTotal = () => {
        if (cantidad !== 0 && parseFloat(getTotalCapsula()) !== 0 && envases !== 0 && costoEnvase >= 0 && etiquetas !== 0 && costoEtiquetas >= 0) {
            var total = 0;
            cotizacion.datos.map(item => {
                total += parseFloat(getTotalFila(item))
            })
            total += parseFloat(parseFloat(getTotalCapsula()))
            total += parseFloat(costoEnvase * envases)
            total += parseFloat(costoEtiquetas * etiquetas)
            return parseFloat(total).toFixed(4)
        }
        return 0
    }

    const getTotalTabla = () => {
        var total = 0;
        cotizacion.datos.map(item => {
            total += parseFloat(getTotalFila(item))
        })
        return total
    }

    const onSaveCotizacion = async () => {
        var input = {}
        var ele = [], por = [], precio = [], cap = [], cancap = [], precap = [], agua = 0
        cotizacion.datos.map(item => {
            ele.push(item.materia_prima.id)
            por.push(item.porcentaje)
            precio.push(item.precio_kilo)
        })
        cotizacion.capsula.map(item => {
            if (item.materia_prima.nombre === 'Agua Purificada') {
                agua = item.cantidad_kilo
            } else {
                cap.push(item.materia_prima.id)
                cancap.push(item.cantidad_kilo)
                precap.push(item.precio_kilo)
            }
        })
        input = {
            formula: formula.id,
            presentacion: producto.id,
            cliente: cliente.id,
            peso: peso,
            elementos: ele,
            porcentajes: por,
            precios: precio,
            cant_cap: cantidad,
            cost_cap: parseFloat(getTotalCapsula()) / cantidad,
            cant_env: envases,
            cost_env: costoEnvase,
            cant_eti: etiquetas,
            cost_eti: costoEtiquetas,
            venta: ((getTotal() / envases) + (((getTotal() / envases) * utilidad) / 100)),
            agua: agua,
            elementos_c: cap,
            cantidad_c: cancap,
            precios_c: precap,
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
        return !formula || !cliente || !producto || !peso || cantidad === 0 || parseFloat(getTotalCapsula()) === 0 || envases === 0 || costoEnvase < 0 || etiquetas === 0 || costoEtiquetas < 0 || utilidad === 0 || getTotalTabla() === 0
    }

    const getCostoEnvace = () => {
        if (envases > 0) {
            return parseFloat(getTotal() / envases).toFixed(4)
        }
        return 0
    }


    return (
        <>
            <h5>Parámetros específicos de la cotización</h5>
            <div className="row my-2">
                <div className="col-md-6">
                    <h6>Cápsulas por envases</h6>
                    <Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e)} />
                    <h6>Total de envases</h6>
                    <Input type="number" min={1} value={envases} onChange={(e) => setEnvases(e)} />
                    <h6>Total de etiquetas</h6>
                    <Input type="number" min={1} value={etiquetas} onChange={(e) => setEtiquetas(e)} />
                    <h6>Cápsulas a producir</h6>
                    <label className="w-100 bg-white rounded border pt-2 px-2" style={{ fontSize: 14, height: 36 }}>{cantidad*envases}</label>
                </div>
                <div className="col-md-6">
                    <div style={{ height: 60 }}></div>
                    <h6>Costo por envase</h6>
                    <InputGroup size="md" className="w-90 mx-auto">
                        <InputGroup.Addon size="md">
                            <Icon icon="fas fa-dollar-sign" />
                        </InputGroup.Addon>
                        <Input type="number" min={1} value={costoEnvase} onChange={(e) => setCostoEnvase(e)} />
                    </InputGroup>
                    <h6>Costo por etiqueta</h6>
                    <InputGroup size="md" className="w-90 mx-auto">
                        <InputGroup.Addon size="md">
                            <Icon icon="fas fa-dollar-sign" />
                        </InputGroup.Addon>
                        <Input type="number" min={1} value={costoEtiquetas} onChange={(e) => setCostoEtiquetas(e)} />
                    </InputGroup>
                    <h6>Peso de la Cápsula</h6>
                    <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Peso" data={[{ 'label': '250mg', 'value': '250' }, { 'label': '500mg', 'value': '500' }, { 'label': '1000mg', 'value': '1000' }]} searchable={true} onChange={(e) => setPeso(e)} />
                </div>
            </div>
            <h5>Costo de la Cápsula</h5>
            {cotizacion &&
                <div>
                    <div>
                        <Table autoHeight data={cotizacion.capsula} className="shadow my-2">
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
                            <Column flexGrow={2}>
                                <HeaderCell>Cantidad KG</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.cantidad_kilo} onChange={(e) => actualizarCantidadCapsula(rowData, e)} />)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={2}>
                                <HeaderCell>Precio KG</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (rowData.materia_prima.nombre === 'Agua Purificada' ?
                                                <h6 className="text-center">-</h6>
                                                :
                                                <InputGroup size="md" className="w-90 mx-auto" style={{ padding: 0, minHeight: 36, marginTop: -10 }}>
                                                    <InputGroup.Addon size="md">
                                                        <Icon icon="fas fa-dollar-sign" />
                                                    </InputGroup.Addon>
                                                    <Input type="number" className="form-control text-center" defaultValue={rowData.precio_kilo} onChange={(e) => actualizarPrecioCapsula(rowData, e)} />
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
                                            return (rowData.materia_prima.nombre === 'Agua Purificada' ? <h6>-</h6> :
                                                <InputGroup size="md" className="w-90 mx-auto" style={{ padding: 0, minHeight: 36, marginTop: -10 }}>
                                                    <InputGroup.Addon size="md">
                                                        <Icon icon="fas fa-dollar-sign" />
                                                    </InputGroup.Addon>
                                                    <label className="mt-2">{getTotalFilaCapsula(rowData)}</label>
                                                </InputGroup>)
                                        }
                                    }
                                </Cell>
                            </Column>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-end">
                        <h6>Precio de la Cápsula: <Icon icon="fas fa-dollar-sign" size="md" /> {getTotalCapsula()}</h6>
                    </div>
                    <div className="my-2">
                        <h5>Elementos de la formula</h5>
                        <div>
                            <Table className="shadow my-2" autoHeight data={cotizacion.datos}>
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
                                    <HeaderCell>MG / Cápsula</HeaderCell>
                                    <Cell>
                                        {
                                            rowData => {
                                                return (<label>{getMiligramosCapsula(rowData.porcentaje)}</label>)
                                            }
                                        }
                                    </Cell>
                                </Column>
                                <Column flexGrow={1}>
                                    <HeaderCell>GR / Cápsula</HeaderCell>
                                    <Cell>
                                        {
                                            rowData => {
                                                return (<label>{getGramosCapsula(rowData.porcentaje)}</label>)
                                            }
                                        }
                                    </Cell>
                                </Column>
                                <Column flexGrow={1}>
                                    <HeaderCell>GR / Envase</HeaderCell>
                                    <Cell>
                                        {
                                            rowData => {
                                                return (<label>{getGramosEnvase(rowData.porcentaje)}</label>)
                                            }
                                        }
                                    </Cell>
                                </Column>
                                <Column flexGrow={1}>
                                    <HeaderCell>GR / Total</HeaderCell>
                                    <Cell>
                                        {
                                            rowData => {
                                                return (<label>{getGramosTotal(rowData.porcentaje)}</label>)
                                            }
                                        }
                                    </Cell>
                                </Column>
                                <Column flexGrow={1}>
                                    <HeaderCell>KG / Total</HeaderCell>
                                    <Cell>
                                        {
                                            rowData => {
                                                return (<label>{getKilos(rowData.porcentaje)}</label>)
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
                                                        <label className="mt-2">{getTotalFila(rowData)}</label>
                                                    </InputGroup>
                                                )
                                            }
                                        }
                                    </Cell>
                                </Column>
                            </Table>
                        </div>
                        <div className="d-flex justify-content-end mb-3 mt-1">
                            <h6>Total: <Icon icon="fas fa-dollar-sign" size="md" /> {getTotal()}</h6>
                        </div>
                        <div className="row my-2 p-2">
                            <h6>Coste de Fabricación por Envase</h6>
                            <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" size="lg" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{getCostoEnvace()}</label></strong>
                            <h6>Porcentaje de Ganancia por Envase</h6>
                            <Input type="number" min={1} value={utilidad} onChange={(e) => setUtilidad(e)} />
                            <h6>Ganancia</h6>
                            <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" size="lg" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat(((getTotal() / envases) * utilidad) / 100).toFixed(4)}</label></strong>
                            <h6>Precio Final</h6>
                            <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" size="lg" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat((getTotal() / envases) + (((getTotal() / envases) * utilidad) / 100)).toFixed(4)}</label></strong>
                        </div>
                        <div className="d-flex justify-content-end my-2">
                            <Boton name="Guardar Cotización" icon="plus" color="green" tooltip="Guardar Cotización" onClick={() => onSaveCotizacion()} disabled={validarFormulario()} />
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default withRouter(CapsulaBlanda)