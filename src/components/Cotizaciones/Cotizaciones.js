import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';
import { OBTENER_COTIZACIONES, DELETE_COTIZACION } from '../../services/CotizacionService'
import { VERIFICAR, PRODUCCION } from '../../services/MovimientosService'
import { Loader, Notification, Table } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import Confirmation from '../shared/Confirmation';
import Boton from '../shared/Boton';
import Action from '../shared/Action';
import { PDFDownloadLink } from '@react-pdf/renderer'
import CotizacionPDF from './pdf/CotizacionPDF'
const { Column, HeaderCell, Cell, Pagination } = Table;

const Cotizaciones = ({ ...props }) => {
    const [confimation, setConfirmation] = useState(false);
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(10);
    const { loading, error, data } = useQuery(OBTENER_COTIZACIONES, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_COTIZACION);
    const [verificar] = useMutation(VERIFICAR);
    const [produccion] = useMutation(PRODUCCION)
    const date = new Date();
    const fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
    const { session } = props

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const onDeleteCotizacion = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarCotizacion;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Cotización',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Cotización',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeleteCotizacion}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.formula.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            const val = key.tipoProducto.tipo.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else {
            const val = key.cliente.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if (data) {
            if (data.obtenerCotizaciones) {
                return data.obtenerCotizaciones.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
                    }
                    const start = displayLength * (page - 1);
                    const end = start + displayLength;
                    return index >= start && index < end;
                });
            }
        }
        return []
    }

    const mostrarMsj = () => {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'No tienes el rol necesario para realizar esta acción.'
        })
    }

    function crearItems(datos) {
        var cant = 0;
        var items = []
        for (let i = 0; i < datos.elementos.length; i++) {
            if (datos.presentacion.tipo === 'Cápsula dura' || datos.presentacion.tipo === 'Cápsula blanda') {
                cant = ((((((parseFloat(datos.peso) * datos.porcentajes[i]) / 100) / 1000) * parseFloat(datos.cant_cap)) * parseFloat(datos.cant_env)) / 1000)
            } else if (datos.presentacion.tipo === 'Polvo') {
                cant = (((((parseFloat(datos.dosis) * datos.porcentajes[i]) / 100) / 1000) * parseFloat(datos.serving)) * parseFloat(datos.cant_env))
            } else {
                cant = (((parseFloat(datos.peso) * datos.porcentajes[i]) / 100) / 1000) * datos.cant_env
            }
            items.push({
                id: datos.elementos[i].id,
                nombre: datos.elementos[i].nombre,
                cantidad: parseFloat(cant.toFixed(4))
            })
        }
        for (let i = 0; i < datos.elementos_c.length; i++) {
            items.push({
                id: datos.elementos_c[i].id,
                nombre: datos.elementos_c[i].nombre,
                cantidad: datos.cantidad_c[i]
            })
        }
        console.log(items)
        return items
    }

    const verificarExistencias = async (datos, show) => {
        var items = crearItems(datos);
        const input = {
            items
        }
        const { data } = await verificar({ variables: { input }, errorPolicy: 'all' })
        const { estado, message } = data.verificarExistencias
        if (estado === 1) {
            if (show) {
                Notification['info']({
                    title: 'Verificar Cotizaciones',
                    duration: 20000,
                    description: message
                })
            }
            return true
        } else if (estado === 2) {
            Notification['warning']({
                title: 'Verificar Cotizaciones',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Verificar Cotizaciones',
                duration: 20000,
                description: message
            })
        }
        return false
    }

    const enviarProduccion = async (datos) => {
        var cant = 0;
        if (datos.estado !== 'ENVIADA') {
            if (verificarExistencias(datos, false)) {
                var items = []
                for (let i = 0; i < datos.elementos.length; i++) {
                    if (datos.presentacion.tipo === 'Cápsula dura' || datos.presentacion.tipo === 'Cápsula blanda') {
                        cant = ((((((parseFloat(datos.peso) * datos.porcentajes[i]) / 100) / 1000) * parseFloat(datos.cant_cap)) * parseFloat(datos.cant_env)) / 1000)
                    } else if (datos.presentacion.tipo === 'Polvo') {
                        cant = (((((parseFloat(datos.dosis) * datos.porcentajes[i]) / 100) / 1000) * parseFloat(datos.serving)) * parseFloat(datos.cant_env))
                    } else {
                        cant = (((parseFloat(datos.peso) * datos.porcentajes[i]) / 100) / 1000) * datos.cant_env
                    }
                    items.push({
                        id: datos.elementos[i].id,
                        cantidad: cant
                    })
                }
                for (let i = 0; i < datos.elementos_c.length; i++) {
                    items.push({
                        id: datos.elementos_c[i].id,
                        cantidad: datos.cantidad_c[i]
                    })
                }
                const input = {
                    usuario: session.id,
                    cotizacion: datos.id,
                    elementos: items
                }
                const { data } = await produccion({ variables: { input }, errorPolicy: 'all' })
                const { estado, message } = data.enviarProduccion
                if (estado) {
                    Notification['success']({
                        title: 'Enviar a Producción la Cotización',
                        duration: 20000,
                        description: message
                    })
                } else {
                    Notification['error']({
                        title: 'Enviar a Producción la Cotización',
                        duration: 20000,
                        description: message
                    })
                }
            }
        } else {
            Notification['info']({
                title: 'Enviar a Producción la Cotización',
                duration: 20000,
                description: "La cotización ya fue enviada a producción"
            })
        }
    }

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de cotizaciones, verificar tu conexión a internet'
        })
    }

    const datos = getData()
    console.log(datos)

    return (
        <>
            <h3 className="text-center">Gestión de Cotizaciones</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-3">
                    <select id="select_modo" className="h-100 rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Fórmula</option>
                        <option value="2"> Producto</option>
                        <option value="3"> Cliente</option>
                    </select>
                </div>
                <div style={{ padding: 0 }} className="col-md-9 h-100">
                    <div className="input-group">
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                </div>
            </div>
            <div className="my-2">
                <Table className="shadow my-3" height={500} data={datos}>
                    <Column flexGrow={2}>
                        <HeaderCell>Formula</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{rowData.formula.nombre}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={1}>
                        <HeaderCell>Presentación</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{rowData.presentacion.tipo}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column flexGrow={2}>
                        <HeaderCell>Cliente</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (<label>{rowData.cliente.nombre}</label>)
                                }
                            }
                        </Cell>
                    </Column>
                    <Column width={180}>
                        <HeaderCell>Acciones</HeaderCell>
                        <Cell>
                            {
                                rowData => {
                                    return (
                                        <div className="d-flex justify-content-end mx-1 my-1">
                                            <div className="mx-1"><Action tooltip="Verificar Existencias" color="blue" icon="info" size="xs" onClick={() => verificarExistencias(rowData, true)} /></div>
                                            <div className="mx-1"><Link to={`cotizaciones/editar/${rowData.id}`}><Action tooltip="Editar Cotización" color="orange" icon="edit" size="xs" /></Link></div>
                                            <div className="mx-1"><Action tooltip="Enviar a Producción" color="green" icon="send" size="xs" onClick={() => enviarProduccion(rowData)} /></div>
                                            <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: rowData.id }) : mostrarMsj() }} tooltip="Eliminar Cotización" color="red" icon="trash" size="xs" /></div>
                                            <div className="mx-1">
                                                <PDFDownloadLink
                                                    document={<CotizacionPDF formula={rowData.formula} cliente={rowData.cliente} producto={rowData.presentacion} objeto={rowData} />}
                                                    fileName={`INFORME_COTIZACION_${rowData.cliente.nombre}_${rowData.presentacion.tipo}_${rowData.formula.nombre}_${fecha}.pdf`}
                                                >
                                                    {({ blob, url, loading: loadingDocument, error: error_loading }) =>
                                                        loadingDocument ?
                                                            ''
                                                            :
                                                            <Action icon="download" size="xs" color="yellow" tooltip="Descargar Informe" position='end' />
                                                    }
                                                </PDFDownloadLink>
                                            </div>
                                        </div>
                                    )
                                }
                            }
                        </Cell>
                    </Column>
                </Table>
            </div>
            <div className="d-flex justify-content-end">
                <Pagination
                    first={false}
                    last={false}
                    next={false}
                    prev={false}
                    showInfo={false}
                    showLengthMenu={false}
                    activePage={page}
                    displayLength={displayLength}
                    total={data.obtenerCotizaciones.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            </div>
            <div className="d-flex justify-content-start my-2">
                <Link to={`/cotizar`}><Boton tooltip="Nueva Cotización" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Cotizaciones)

/*
    const { loading, error, data } = useQuery(OBTENER_COTIZACIONES, { pollInterval: 1000 })

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de cotizaciones, verificar tu conexión a internet'
        })
    }

    const getDatos = (item) => {
        var data = [], obj = {}
        for (let i = 0; i < item.elementos.length; i++) {
            data.push({
                materia_prima: item.elementos[i].nombre,
                porcentaje: item.porcentajes[i],
                miligramos: item.miligramos[i],
                gramos_cap: (item.miligramos[i] / 1000),
                gramos_env: ((item.miligramos[i] / 1000) * item.cantidad),
                gramos_tot: (((item.miligramos[i] / 1000) * item.cantidad) * item.envases),
                kilos: (((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000,
                precio_kilo: item.precio_kilo[i],
                total: parseFloat(item.precio_kilo[i] * ((((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000)).toFixed(2)
            })
        }
        return data
    }

    const getPrecioEnvase = (item) => {
        var pe = 0
        for (let i = 0; i < item.miligramos.length; i++) {
            pe += item.precio_kilo[i] * ((((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000)
        }
        pe += item.cantidad * item.costoCapsula
        pe += item.costoEnvase * item.envases
        pe += item.etiqueta * item.costoEtiqueta
        return parseFloat(pe / item.envases).toFixed(2)
    }

    const getTotal = (item) => {
        var pe = 0
        for (let i = 0; i < item.miligramos.length; i++) {
            pe += item.precio_kilo[i] * ((((item.miligramos[i] / 1000) * item.cantidad) * item.envases) / 1000)
        }
        pe += item.cantidad * item.costoCapsula
        pe += item.costoEnvase * item.envases
        pe += item.etiqueta * item.costoEtiqueta
        return parseFloat(pe).toFixed(2)
    }

    console.log(data)

    return (
        <>
            <h3 className="text-center">Cotizaciones</h3>
            {!data || !data.obtenerCotizaciones ?
                (
                    <h6>No hay cotizaciones registradas</h6>
                ) : (
                    <>
                        {
                            data.obtenerCotizaciones.map(item => {
                                return (
                                    <div className="bg-white p-2 m-2 shadow row">
                                        <h6>Fórmula</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.formula.nombre}</label></strong>
                                        <div className="row my-2">
                                            <div className="col-md-5">
                                                <h6>Cantidad de Cápsulas por Envase</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.cantidad}</label></strong>
                                                <h6>Cantidad de Envases</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.envases}</label></strong>
                                                <h6>Cantidad de Etiquetas</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.etiqueta}</label></strong>
                                            </div>
                                            <div className="col-md-5">
                                                <h6>Costo por Cápsula</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.costoCapsula}</label></strong>
                                                <h6>Costo de Envase</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.costoEnvase}</label></strong>
                                                <h6>Costo de Etiqueta</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.costoEtiqueta}</label></strong>
                                            </div>
                                            <div className="col-md-2">
                                                <h6>Total por Cápsula</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.cantidad * item.costoCapsula).toFixed(2)}</label></strong>
                                                <h6>Total de Envase</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.costoEnvase * item.envases).toFixed(2)}</label></strong>
                                                <h6>Total de Etiqueta</h6>
                                                <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.etiqueta * item.costoEtiqueta).toFixed(2)}</label></strong>
                                            </div>
                                        </div>

                                        <div>
                                            <Table className="shadow my-3" autoHeight data={getDatos(item)}>
                                                <Column flexGrow={2}>
                                                    <HeaderCell>Materia Prima</HeaderCell>
                                                    <Cell dataKey="materia_prima" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Porcentaje</HeaderCell>
                                                    <Cell dataKey="porcentaje" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Miligramos</HeaderCell>
                                                    <Cell dataKey="miligramos" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>GR / Cápsula</HeaderCell>
                                                    <Cell dataKey="gramos_cap" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>GR/ Envase</HeaderCell>
                                                    <Cell dataKey="gramos_env" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>GR / Total</HeaderCell>
                                                    <Cell dataKey="gramos_tot" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Kilos</HeaderCell>
                                                    <Cell dataKey="kilos" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Precio Kilo</HeaderCell>
                                                    <Cell dataKey="precio_kilo" />
                                                </Column>
                                                <Column flexGrow={1}>
                                                    <HeaderCell>Total</HeaderCell>
                                                    <Cell dataKey="total" />
                                                </Column>
                                            </Table>
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <h6>Total: {getTotal(item)}</h6>
                                        </div>
                                        <h6>Precio por Envase</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{getPrecioEnvase(item)}</label></strong>
                                        <h6>Precio de Venta por Envase</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{item.venta}</label></strong>
                                        <h6>Ganancia por Envase</h6>
                                        <strong className="bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 40 }}>{parseFloat(item.venta - getPrecioEnvase(item)).toFixed(2)}</label></strong>
                                    </div>
                                )
                            })
                        }
                    </>
                )

            }
        </>
    )
    */