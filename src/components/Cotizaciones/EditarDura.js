/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_COTIZACION } from '../../services/CotizacionService'
import { Notification, Table, Input, InputPicker, InputGroup, Icon } from 'rsuite';
import Boton from '../shared/Boton';
const { Column, HeaderCell, Cell } = Table;

const EditarDura = ({ ...props }) => {
    const [actualizar] = useMutation(UPDATE_COTIZACION)
    const [cotizacion, setCotizacion] = useState(null)
    const { formula, cliente, producto, objeto } = props
    const [venta, setVenta] = useState(objeto.venta)
    const [peso, setPeso] = useState(objeto.peso)
    const [cantidad, setCantidad] = useState(objeto.cant_cap)
    const [envases, setEnvases] = useState(objeto.cant_env)
    const [etiquetas, setEtiquetas] = useState(objeto.cant_eti)
    const [costoCapsula, setCostoCapsula] = useState(objeto.cost_cap)
    const [costoEnvase, setCostoEnvase] = useState(objeto.cost_env)
    const [costoEtiquetas, setCostoEtiquetas] = useState(objeto.cost_eti)
    const [utilidad, setUtilidad] = useState({ utilidad: 0, validada: false });

    useEffect(() => {
        setUtilidad({ utilidad: 0, validada: false })
        setVenta(objeto.venta)
        setPeso(objeto.peso)
        setCantidad(objeto.cant_cap)
        setEnvases(objeto.cant_env)
        setEtiquetas(objeto.cant_eti)
        setCostoCapsula(objeto.cost_cap)
        setCostoEnvase(objeto.cost_env)
        setCostoEtiquetas(objeto.cost_eti)
    }, [objeto])

    if (cotizacion === null) {
        const datos = []
        for (let i = 0; i < objeto.elementos.length; i++) {
            datos.push({
                materia_prima: objeto.elementos[i],
                porcentaje: objeto.porcentajes[i],
                precio_kilo: objeto.precios[i]
            })
        }
        setCotizacion(datos)
    }

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

    const getTotalFila = (data) => {
        if (peso > 0 && cantidad > 0 && envases > 0) {
            return parseFloat(getKilos(data.porcentaje) * data.precio_kilo).toFixed(4)
        }
        return 0
    }

    const getTotal = () => {
        if (cantidad !== 0 && costoCapsula !== 0 && envases !== 0 && costoEnvase >= 0 && etiquetas !== 0 && costoEtiquetas >= 0) {
            var total = 0;
            cotizacion.map(item => {
                total += parseFloat(getTotalFila(item))
            })
            total += parseFloat((envases * cantidad) * costoCapsula)
            total += parseFloat(costoEnvase * envases)
            total += parseFloat(costoEtiquetas * etiquetas)
            return parseFloat(total).toFixed(4)
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

    const onSaveCotizacion = async () => {
        var input = {}
        var ele = [], por = [], precio = []
        cotizacion.map(item => {
            ele.push(item.materia_prima.id)
            por.push(item.porcentaje)
            precio.push(item.precio_kilo)
        })
        input = {
            formula: formula,
            presentacion: producto,
            cliente: cliente,
            peso: peso,
            elementos: ele,
            porcentajes: por,
            precios: precio,
            cant_cap: cantidad,
            cost_cap: costoCapsula,
            cant_env: envases,
            cost_env: parseFloat(costoEnvase),
            cant_eti: etiquetas,
            cost_eti: costoEtiquetas,
            venta: ((getTotal() / envases) + (((getTotal() / envases) * utilidad.utilidad) / 100)),
            estado: 'REGISTRADA',
            status: 'ACTIVO'
        }
        console.log(input)
        try {
            const { data } = await actualizar({ variables: { id: objeto.id, input }, errorPolicy: 'all' })
            const { estado, message } = data.actualizarCotizacion;
            if (estado) {
                Notification['success']({
                    title: 'Guardar Cotizaci??n',
                    duration: 5000,
                    description: message
                })
                props.history.push('/cotizaciones')
            } else {
                Notification['error']({
                    title: 'Guardar Cotizaci??n',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Guardar Cotizaci??n',
                duration: 5000,
                description: "Hubo un error inesperado al actualizar la cotizaci??n"
            })
        }
    }

    const validarFormulario = () => {
        if (objeto.estado === 'ENVIADA') {
            return true
        }
        return !formula || !cliente || !producto || !peso || cantidad === 0 || costoCapsula === 0 || envases === 0 || costoEnvase < 0 || etiquetas === 0 || costoEtiquetas < 0 || utilidad === 0 || getTotalTabla() === 0
    }

    const getCostoEnvace = () => {
        if (envases > 0) {
            return parseFloat(getTotal() / envases).toFixed(4)
        }
        return 0
    }

    if (cotizacion === null) {
        setUtilidad({ utilidad: 0, validada: false });
    } else if (utilidad.validada === false) {
        var v = venta, uti = 0;
        v -= (getTotal() / envases);
        uti = (v * 100) / (getTotal() / envases);
        setUtilidad({ utilidad: uti.toFixed(4), validada: true })
    }

    return (
        <>
            <h5>Par??metros espec??ficos de la cotizaci??n</h5>
            <div className="row my-2">
                <div className="col-md-6">
                    <h6>C??psulas por envases</h6>
                    <Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e)} />
                    <h6>Total de envases</h6>
                    <Input type="number" min={1} value={envases} onChange={(e) => setEnvases(e)} />
                    <h6>Total de etiquetas</h6>
                    <Input type="number" min={1} value={etiquetas} onChange={(e) => setEtiquetas(e)} />
                    <h6>C??psulas a producir</h6>
                    <label className="w-100 bg-white rounded border pt-2 px-2" style={{ fontSize: 14, height: 36 }}>{cantidad * envases}</label>
                </div>
                <div className="col-md-6">
                    <h6> Costo por C??psula Vac??a</h6>
                    <InputGroup size="md" className="w-90 mx-auto">
                        <InputGroup.Addon size="md">
                            <Icon icon="fas fa-dollar-sign" />
                        </InputGroup.Addon>
                        <Input type="number" min={1} value={costoCapsula} onChange={(e) => setCostoCapsula(e)} />
                    </InputGroup>
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
                    <h6>Peso de la C??psula</h6>
                    <InputPicker cleanable={false} value={peso} className="rounded-0 w-100" size="md" placeholder="Peso" data={[{ 'label': '250mg', 'value': '250' }, { 'label': '500mg', 'value': '500' }, { 'label': '1000mg', 'value': '1000' }]} searchable={true} onChange={(e) => setPeso(e)} />
                </div>
            </div>
            <h5>Elementos de la formula</h5>
            {cotizacion &&
                <>
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
                            <Column flexGrow={0}>
                                <HeaderCell>Porcentaje</HeaderCell>
                                <Cell dataKey="porcentaje" />
                            </Column>
                            <Column flexGrow={0}>
                                <HeaderCell>MG / C??psula</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getMiligramosCapsula(rowData.porcentaje)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={0}>
                                <HeaderCell>GR / C??psula</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getGramosCapsula(rowData.porcentaje)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={0}>
                                <HeaderCell>GR / Envase</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getGramosEnvase(rowData.porcentaje)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={0}>
                                <HeaderCell>GR / Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getGramosTotal(rowData.porcentaje)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={0}>
                                <HeaderCell>KG / Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getKilos(rowData.porcentaje)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={2}>
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
                            <Column flexGrow={2}>
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
                        <h6>Total: <Icon icon="fas fa-dollar-sign" /> {getTotal()}</h6>
                    </div>
                    <div className="row my-2 p-2">
                        <h6>Coste de Fabricaci??n por Envase</h6>
                        <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{getCostoEnvace()}</label></strong>
                        <h6>Porcentaje de Ganancia por Envase</h6>
                        <Input type="number" value={utilidad.utilidad} onChange={(e) => setUtilidad({ utilidad: e, validada: utilidad.validada })} />
                        <h6>Precio Final</h6>
                        <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat(((getTotal() / envases) * utilidad.utilidad) / 100).toFixed(4)}</label></strong>
                        <h6>Ganancia</h6>
                        <strong className="bg-white rounded border"><Icon icon="fas fa-dollar-sign" /> <label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(utilidad === 0 || envases === 0) ? 0 : parseFloat((((getTotal() / envases) * utilidad.utilidad) / 100) - (getTotal() / envases)).toFixed(4)}</label></strong>
                    </div>
                    {objeto.estado === 'REGISTRADA' &&
                        <div className="d-flex justify-content-end my-2">
                            <Boton name="Guardar Cotizaci??n" icon="plus" color="green" tooltip="Guardar Cotizaci??n" onClick={() => onSaveCotizacion()} disabled={validarFormulario()} />
                        </div>
                    }
                </>
            }
        </>
    )
}

export default withRouter(EditarDura)