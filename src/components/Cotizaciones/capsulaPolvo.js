import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_COTIZACION } from '../../services/CotizacionService'
import { Notification, Table, Input } from 'rsuite';
import Boton from '../shared/Boton';
const { Column, HeaderCell, Cell } = Table;

const CapsulaPolvo = ({ ...props }) => {
    const [insertar] = useMutation(SAVE_COTIZACION)
    const [cotizacion, setCotizacion] = useState(null)
    const [venta, setVenta] = useState(0)
    const { formula, cliente, producto, peso, capsulas, costoCapsulas, envases, costoEnvases, etiquetas, costoEtiquetas } = props

    if (formula !== null && cotizacion === null) {
        const datos = []
        for (let i = 0; i < formula.elementos.length; i++) {
            datos.push({
                materia_prima: formula.elementos[i].materia_prima,
                porcentaje: formula.porcentajes[i],
                precio_kilo: 0
            })
        }
        setCotizacion(datos)
    }

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
                cotizacion.map(item => {
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
        if (peso > 0 && capsulas > 0 && envases > 0) {
            return parseFloat(getKilos(data.porcentaje) * data.precio_kilo).toFixed(2)
        }
        return 0
    }

    const getTotal = () => {
        if (capsulas !== 0 && costoCapsulas !== 0 && envases !== 0 && costoEnvases !== 0 && etiquetas !== 0 && costoEtiquetas !== 0) {
            var total = 0;
            cotizacion.map(item => {
                total += parseFloat(getTotalFila(item))
            })
            total += parseFloat(costoCapsulas * capsulas)
            total += parseFloat(costoEnvases * envases)
            total += parseFloat(costoEtiquetas * etiquetas)
            return parseFloat(total).toFixed(2)
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
            formula: formula.id,
            tipoProducto: producto.id,
            cliente: cliente.id,
            pesoCapsula: peso,
            cantidad: capsulas,
            costoCapsula: costoCapsulas,
            envases: envases,
            costoEnvase: costoEnvases,
            etiqueta: etiquetas,
            costoEtiqueta: costoEtiquetas,
            venta: venta,
            elementos: ele,
            porcentajes: por,
            precio_kilo: precio,
            estado: 'REGISTRADA',
            status: 'ACTIVO'
        }
        console.log(input)
        try{
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
        }catch(error){
            console.log(error)
            Notification['error']({
                title: 'Guardar Cotización',
                duration: 5000,
                description: "Hubo un error inesperado al guardar la cotización"
            })
        }
    }

    const validarFormulario = () => {
        return !formula || !cliente || !producto || !peso || capsulas === 0 || costoCapsulas === 0 || envases === 0 || costoEnvases === 0 || etiquetas === 0 || costoEtiquetas === 0 || venta === 0 || getTotalTabla() === 0
    }

    const getCostoEnvace = () => {
        if (envases > 0) {
            return parseFloat(getTotal() / envases).toFixed(2)
        }
        return 0
    }

    return (
        <>
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
        </>
    )
}
/*
const Cotizador = ({ ...props }) => {
    const [cantidad, setCantidad] = useState(0)
    const [costoCapsula, setCostoCapsula] = useState(0)
    const [envases, setEnvases] = useState(0)
    const [costoEnvase, setCostoEnvase] = useState(0)
    const [etiquetas, setEtiquetas] = useState(0)
    const [costoEtiquetas, setCostoEtiqueta] = useState(0)
    const [venta, setVenta] = useState(0)
    const [cotizacion, setCotizacion] = useState(null)
    const { loading: load_formulas, error: error_formulas, data: data_formulas } = useQuery(OBTENER_FORMULAS_MOVIMIENTOS, { pollInterval: 1000 })
    const [insertar] = useMutation(SAVE_COTIZACION)
    const { session } = props

    if (load_formulas) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_formulas) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de fórmulas, verificar tu conexión a internet'
        })
    }

    const getDataPicker = () => {
        if (data_formulas !== null) {
            if (data_formulas.obtenerFormulasConMovimiento != null) {
                const data = data_formulas.obtenerFormulasConMovimiento;
                var datos = [];
                data.map(item => {
                    console.log(item)
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

    const crearCotizacion = (formula) => {
        if (formula !== null) {
            var data = []
            var index = 0;
            formula.elementos.map(item => {
                data.push({
                    materia_prima: item.materia_prima,
                    movimientos: item.movimientos,
                    porcentaje: formula.porcentajes[index],
                    miligramos: 0,
                    precio_kilo: 0
                })
                index++;
            })
            setCotizacion({ formula: formula.id, data: data })
        } else {
            setCotizacion(null)
        }
    }

    const actualizarMiligramos = (data, miligramos) => {
        if (miligramos !== "") {
            if (parseInt(miligramos) > 0) {
                var newDatos = []
                cotizacion.data.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            movimientos: item.movimientos,
                            miligramos: parseInt(miligramos),
                            porcentaje: item.porcentaje,
                            precio_kilo: item.precio_kilo
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ formula: cotizacion.formula, data: newDatos })
            }
        }
    }

    const actualizarPrecio = (data, precio) => {
        if (precio !== "") {
            if (parseFloat(precio) > 1) {
                var newDatos = []
                cotizacion.data.map(item => {
                    if (item.materia_prima.id === data.materia_prima.id) {
                        newDatos.push({
                            materia_prima: item.materia_prima,
                            movimientos: item.movimientos,
                            miligramos: item.miligramos,
                            porcentaje: item.porcentaje,
                            precio_kilo: parseFloat(precio)
                        })
                    } else {
                        newDatos.push(item)
                    }
                })
                setCotizacion({ formula: cotizacion.formula, data: newDatos })
            }
        }
    }

    const getGramosEnvase = (miligramos) => {
        if (cantidad > 0) {
            return (miligramos / 1000) * cantidad
        }
        return 0
    }

    const getGramosTotal = (miligramos) => {
        if (cantidad > 0 && envases > 0) {
            return getGramosEnvase(miligramos) * envases
        }
        return 0
    }

    const getKilos = (miligramos) => {
        if (cantidad > 0 && envases > 0) {
            return getGramosTotal(miligramos) / 1000;
        }
        return 0
    }

    const getTotalFila = (data) => {
        if (cantidad > 0 && envases > 0 && data.precio_kilo > 0) {
            return parseFloat(getKilos(data.miligramos) * data.precio_kilo).toFixed(2);
        }
        return 0;
    }

    const getTotal = () => {
        if (cantidad > 0 && envases > 0 && etiquetas) {
            var total = 0;
            cotizacion.data.map(item => {
                total += item.precio_kilo * getKilos(item.miligramos)
            })
            if(cantidad > 0 && costoCapsula > 0){
                total += cantidad * costoCapsula
            }
            if(envases > 0 && costoEnvase > 0){
                total += envases * costoEnvase
            }
            if(etiquetas > 0 && costoEtiquetas > 0){
                total += etiquetas * costoEtiquetas
            }
            return total;
        } else {
            return 0;
        }
    }

    const verificarExistencias = (mov, cantidad) => {
        var existencias = 0
        mov.map(item => {
            if (item.tipo === 'ENTRADA') {
                existencias += item.cantidad
            } else {
                existencias -= item.cantidad
            }
        })
        return existencias >= cantidad;
    }

    const onSaveCotizacion = async () => {
        if (cantidad > 0 && envases > 0 && venta > 0) {
            var input = {}, obj_cotizacion = {}, band = false;
            var ele = [], por = [], miligramos = [], precio = [], mat = [];
            cotizacion.data.map(item => {
                if (verificarExistencias(item.movimientos, getKilos(item.miligramos))) {
                    ele.push(item.materia_prima.id)
                    por.push(item.porcentaje)
                    miligramos.push(item.miligramos)
                    precio.push(item.precio_kilo)
                    mat.push({
                        id: item.materia_prima.id,
                        total: getKilos(item.miligramos)
                    })
                } else {
                    band = true
                }
            })
            if (band === false) {
                obj_cotizacion = {
                    formula: cotizacion.formula,
                    cantidad: cantidad,
                    costoCapsula: costoCapsula,
                    envases: envases,
                    costoEnvase: costoEnvase,
                    etiqueta: etiquetas,
                    costoEtiqueta: costoEtiquetas,
                    venta: venta,
                    elementos: ele,
                    porcentajes: por,
                    miligramos: miligramos,
                    precio_kilo: precio
                }
                input = {
                    objeto: obj_cotizacion,
                    materias: mat,
                    usuario: session.id
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
        }
    }

    const validarFormulario = () => {
        return !cantidad || !envases || !etiquetas || !venta || !costoCapsula || !costoEnvase || !costoEtiquetas || cantidad <= 0 || envases <= 0 || etiquetas <= 0 || venta <= 0 || costoCapsula <= 0 || costoEnvase <= 0 || costoEtiquetas <= 0
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/cotizaciones`)} icon="arrow-left-line" tooltip="Ir a Cotizaciones" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Cotizador</h3>
            <div className="my-2 w-75 mx-auto">
                <h6>Seleccione Formula</h6>
                <InputPicker className="h-100 rounded-0 w-100" size="md" placeholder="Fórmula" data={getDataPicker()} searchable={true} onChange={(e) => crearCotizacion(e)} />
            </div>
            {(cotizacion !== null) &&
                <>
                    <div className="row my-2">
                        <div className="col-md-5">
                            <h6>Cápsulas por envases</h6>
                            <Input type="number" min={1} value={cantidad} onChange={(e) => setCantidad(e)} />
                            <h6>Total de envases</h6>
                            <Input type="number" min={1} value={envases} onChange={(e) => setEnvases(e)} />
                            <h6>Total de etiquetas</h6>
                            <Input type="number" min={1} value={etiquetas} onChange={(e) => setEtiquetas(e)} />
                        </div>
                        <div className="col-md-5">
                            <h6>Costo por Cápsula</h6>
                            <Input type="number" min={1} value={costoCapsula} onChange={(e) => setCostoCapsula(e)} />
                            <h6>Costo por envase</h6>
                            <Input type="number" min={1} value={costoEnvase} onChange={(e) => setCostoEnvase(e)} />
                            <h6>Costo por etiqueta</h6>
                            <Input type="number" min={1} value={costoEtiquetas} onChange={(e) => setCostoEtiqueta(e)} />
                        </div>
                        <div className="col-md-2">
                            <h6>Total Cápsulas</h6>
                            <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 35 }}>{(cantidad > 0 && costoCapsula > 0) ? parseFloat(cantidad * costoCapsula).toFixed(2) : 0}</label></strong>
                            <h6>Total Envases</h6>
                            <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 35 }}>{(envases > 0 && costoEnvase > 0) ? parseFloat(envases * costoEnvase).toFixed(2) : 0}</label></strong>
                            <h6>Total Etiquetas</h6>
                            <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 35 }}>{(etiquetas > 0 && costoEtiquetas > 0) ? parseFloat(etiquetas * costoEtiquetas).toFixed(2) : 0}</label></strong>
                        </div>
                    </div>
                    <div>
                        <Table className="shadow" autoHeight data={cotizacion.data}>
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
                                            return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.miligramos} onChange={(e) => actualizarMiligramos(rowData, e)} disabled={rowData.lote === null} />)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>GR / Cápsula</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{rowData.miligramos / 1000}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>GR / Envase</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getGramosEnvase(rowData.miligramos)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>GR / Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getGramosTotal(rowData.miligramos)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>KG / Total</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<label>{getKilos(rowData.miligramos)}</label>)
                                        }
                                    }
                                </Cell>
                            </Column>
                            <Column flexGrow={1}>
                                <HeaderCell>Precio / KG</HeaderCell>
                                <Cell>
                                    {
                                        rowData => {
                                            return (<Input type="number" style={{ padding: 0, minHeight: 40, marginTop: -10 }} className="form-control text-center" defaultValue={rowData.precio_kilo} onChange={(e) => actualizarPrecio(rowData, e)} disabled={rowData.lote === null} />)
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
                        <h6>Total: {parseFloat(getTotal()).toFixed(2)}</h6>
                    </div>
                    <div className="row my-2">
                        <h6>Coste de Fabricación por Envase</h6>
                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{envases > 0 ? parseFloat(getTotal() / envases).toFixed(2) : 0}</label></strong>
                        <h6>Venta al Cliente por envace</h6>
                        <Input type="number" min={1} value={venta} onChange={(e) => setVenta(e)} />
                        <h6>Ganancia</h6>
                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{(venta === 0 || envases === 0) ? 0 : (venta < (getTotal() / envases)) ? '0' : parseFloat(venta - (getTotal() / envases)).toFixed(2)}</label></strong>
                    </div>
                    <div className="d-flex justify-content-end my-2">
                        <Boton name="Guardar Cotización" icon="plus" color="green" tooltip="Guardar Cotización" onClick={() => onSaveCotizacion()} disabled={validarFormulario()} />
                    </div>
                </>
            }
        </>
    )
}
*/
export default withRouter(CapsulaPolvo)