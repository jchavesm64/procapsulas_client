import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_COTIZACION } from '../../services/CotizacionService'
import { Notification, Table, Input } from 'rsuite';
import Boton from '../shared/Boton';
const { Column, HeaderCell, Cell } = Table;

const CapsulaBlanda = ({ ...props }) => {
    const [costoCapsula, setCostoCapsula] = useState(0)
    const [insertar] = useMutation(SAVE_COTIZACION)
    const [cotizacion, setCotizacion] = useState(null)
    const [venta, setVenta] = useState(0)
    const { formula, cliente, producto, peso, capsulas, envases, costoEnvases, etiquetas, costoEtiquetas } = props

    if (formula !== null && cotizacion === null) {
        const datos = [], capsula = []
        for (let i = 0; i < formula.elementos.length; i++) {
            datos.push({
                materia_prima: formula.elementos[i].materia_prima,
                porcentaje: formula.porcentajes[i],
                precio_kilo: 0
            })
        }
        var base = formula.formulaBase.elementos
        for (let i = 0; i < base.length; i++) {
            capsula.push({
                materia_prima: base[i],
                cantidad_kilo: 0,
                precio_kilo: 0
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
            if (parseFloat(cantidad) > 1) {
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
            if (parseFloat(precio) > 1) {
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
        return parseFloat(data.cantidad_kilo * data.precio_kilo).toFixed(2)
    }

    const getTotalCapsula = () => {
        var total = 0
        cotizacion.capsula.map(item => {
            total += parseFloat(getTotalFilaCapsula(item))
        })
        return parseFloat(total).toFixed(2)
    }

    //--------------------------------------------
    const getMiligramosCapsula = (porcentaje) => {
        if (peso > 0) {
            return parseFloat((porcentaje * peso) / 100).toFixed(2)
        }
        return 0
    }

    const getGramosCapsula = (porcentaje) => {
        if (peso > 0) {
            return parseFloat(getMiligramosCapsula(porcentaje) / 1000).toFixed(2);
        }
        return 0
    }

    const getGramosEnvase = (porcentaje) => {
        if (peso > 0 && capsulas > 0) {
            return parseFloat((getMiligramosCapsula(porcentaje) / 1000) * capsulas).toFixed(2);
        }
        return 0
    }

    const getGramosTotal = (porcentaje) => {
        if (peso > 0 && capsulas > 0 && envases > 0) {
            return parseFloat(((getMiligramosCapsula(porcentaje) / 1000) * capsulas) * envases).toFixed(2);
        }
        return 0
    }

    const getKilos = (porcentaje) => {
        if (peso > 0 && capsulas > 0 && envases > 0) {
            return parseFloat((((getMiligramosCapsula(porcentaje) / 1000) * capsulas) * envases) / 1000).toFixed(2);
        }
        return 0
    }

    const actualizarPrecio = (data, precio) => {
        var newDatos = []
        if (precio !== "") {
            if (parseFloat(precio) > 1) {
                cotizacion.datos.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            porcentaje: item.porcentaje,
                            precio_kilo: parseFloat(precio).toFixed(2)
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({datos: newDatos, capsula: cotizacion.capsula})
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
                setCotizacion({datos: newDatos, capsula: cotizacion.capsula})
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
            setCotizacion({datos: newDatos, capsula: cotizacion.capsula})
        }
    }

    const getTotalFila = (data) => {
        if (peso > 0 && capsulas > 0 && envases > 0) {
            return parseFloat(getKilos(data.porcentaje) * data.precio_kilo).toFixed(2)
        }
        return 0
    }

    const getTotal = () => {
        if (capsulas !== 0 && parseFloat(getTotalCapsula()) !== 0 && envases !== 0 && costoEnvases !== 0 && etiquetas !== 0 && costoEtiquetas !== 0) {
            var total = 0;
            cotizacion.datos.map(item => {
                total += parseFloat(getTotalFila(item))
            })
            total += parseFloat(parseFloat(getTotalCapsula()) / capsulas)
            total += parseFloat(costoEnvases * envases)
            total += parseFloat(costoEtiquetas * etiquetas)
            return parseFloat(total).toFixed(2)
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
            if(item.materia_prima.nombre === 'Agua Purificada'){
                agua = item.cantidad_kilo
            }else{
                cap.push(item.materia_prima.id)
                cancap.push(item.cantidad_kilo)
                precap.push(item.precio_kilo)
            }
        })
        input = {
            formula: formula.id,
            tipoProducto: producto.id,
            cliente: cliente.id,
            pesoCapsula: peso,
            cantidad: capsulas,
            costoCapsula: parseFloat(getTotalCapsula()) / capsulas,
            envases: envases,
            costoEnvase: costoEnvases,
            etiqueta: etiquetas,
            costoEtiqueta: costoEtiquetas,
            venta: venta,
            elementos: ele,
            porcentajes: por,
            precio_kilo: precio,
            capsula: cap,
            cantidad_capsula: cancap,
            agua_purificada: agua,
            precios_capsula: precap,
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
        return !formula || !cliente || !producto || !peso || capsulas === 0 || parseFloat(getTotalCapsula()) === 0 || envases === 0 || costoEnvases === 0 || etiquetas === 0 || costoEtiquetas === 0 || venta === 0 || getTotalTabla() === 0
    }

    const getCostoEnvace = () => {
        if (envases > 0) {
            return parseFloat(getTotal() / envases).toFixed(2)
        }
        return 0
    }


    return (
        <>
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
                                            return (rowData.materia_prima.nombre === 'Agua Purificada' ? <h6 className="text-center">-</h6> : <Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.cantidad_kilo} onChange={(e) => actualizarPrecioCapsula(rowData, e)} />)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (rowData.materia_prima.nombre === 'Agua Purificada' ? <h6>-</h6> : <label>{getTotalFilaCapsula(rowData)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                        </Table>
                    </div>
                    <div className="d-flex justify-content-end">
                        <h6>Precio de la Cápsula: {getTotalCapsula()}</h6>
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
                                                return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.precio_kilo} onChange={(e) => actualizarPrecio(rowData, e)} />)
                                            }
                                        }
                                    </Cell>
                                </Column>
                                <Column flexGrow={1}>
                                    <HeaderCell>Total</HeaderCell>
                                    <Cell>
                                        {
                                            rowData => {
                                                return (<label>{getTotalFila(rowData)}</label>)
                                            }
                                        }
                                    </Cell>
                                </Column>
                            </Table>
                        </div>
                        <div className="d-flex justify-content-end mb-3 mt-1">
                            <h6>Total: {getTotal()}</h6>
                        </div>
                        <div className="row my-2 p-2">
                            <h6>Coste de Fabricación por Envase</h6>
                            <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{getCostoEnvace()}</label></strong>
                            <h6>Venta al Cliente por envace</h6>
                            <Input type="number" min={1} value={venta} onChange={(e) => setVenta(e)} />
                            <h6>Ganancia</h6>
                            <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(venta === 0 || envases === 0) ? 0 : (venta < (getTotal() / envases)) ? '0' : parseFloat(venta - (getTotal() / envases)).toFixed(2)}</label></strong>
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