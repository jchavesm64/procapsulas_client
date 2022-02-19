/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_FORMULAS } from '../../services/FormulaService'
import { OBTENER_CLIENTES } from '../../services/ClienteService'
import { OBTENER_TIPO_PRODUCTOS } from '../../services/TipoProductoService'
import { Loader, Notification, InputPicker } from 'rsuite';
import Boton from '../shared/Boton';
import EditarDura from './EditarDura'
import EditarBlanda from './EditarBlanda'
import EditarPolvo from './EditarPolvo'
import EditarStick from './EditarStick'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CotizacionPDF from './pdf/CotizacionPDF'

const EditarCotizacion = ({ props, cotizacion }) => {
    const [formula, setFomula] = useState(cotizacion.formula.id)
    const [cliente, setCliente] = useState(cotizacion.cliente.id)
    const [producto, setProducto] = useState(cotizacion.presentacion.id)
    const { loading: load_formulas, error: error_formulas, data: data_formulas } = useQuery(OBTENER_FORMULAS, { pollInterval: 1000 })
    const { loading: load_clientes, error: error_clientes, data: data_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
    const { loading: load_productos, error: error_productos, data: data_productos } = useQuery(OBTENER_TIPO_PRODUCTOS, { pollInterval: 1000 })
    const date = new Date();
    const fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());

    useEffect(() => {
        setFomula(cotizacion.formula.id)
        setCliente(cotizacion.cliente.id)
        setProducto(cotizacion.presentacion.id)
    }, [cotizacion])

    const getFormulas = () => {
        if (data_formulas !== null) {
            if (data_formulas.obtenerFormulas != null) {
                const data = data_formulas.obtenerFormulas;
                var datos = [];
                data.map(item => {
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

    const getClientes = () => {
        if (data_clientes !== null) {
            if (data_clientes.obtenerClientes != null) {
                const data = data_clientes.obtenerClientes;
                var datos = [];
                data.map(item => {
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

    const getProducto = () => {
        if (data_productos !== null) {
            if (data_productos.obtenerTipoProductos != null) {
                const data = data_productos.obtenerTipoProductos;
                var datos = [];
                data.map(item => {
                    datos.push({
                        label: item.tipo,
                        value: item.id
                    })
                })
                return datos
            }
        }
        return []
    }

    if (load_formulas || load_clientes || load_productos) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
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
    if (error_productos) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de productos, verificar tu conexión a internet'
        })
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/cotizaciones`)} icon="arrow-left-line" tooltip="Ir a Cotizaciones" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Editar Cotización</h3>
            <div className="bg-white p-2 shadow rounded">
                <h5>Parámetros generales de la cotización</h5>
                <div className="row my-2">
                    <div className="col-md-6">
                        <h6>Seleccione la Formula</h6>
                        <InputPicker cleanable={false} value={formula} className="rounded-0 w-100" size="md" placeholder="Fórmula" data={getFormulas()} searchable={true} onChange={(e) => setFomula(e)} />
                    </div>
                    <div className="col-md-6">
                        <h6>Seleccione la presentación</h6>
                        <InputPicker cleanable={false} value={producto} className="rounded-0 w-100" size="md" placeholder="Presentación" data={getProducto()} searchable={true} onChange={(e) => setProducto(e)} />
                    </div>
                </div>
                <div className="w-75 mx-auto">
                    <h6>Seleccione el Cliente</h6>
                    <InputPicker cleanable={false} value={cliente} className="rounded-0 w-100" size="md" placeholder="Cliente" data={getClientes()} searchable={true} onChange={(e) => setCliente(e)} />
                </div>
            </div>

            <div className="bg-white p-2 shadow rounded my-2">
                {cotizacion.presentacion.tipo === 'Cápsula dura' &&
                    <EditarDura
                        formula={formula}
                        cliente={cliente}
                        producto={producto}
                        objeto={cotizacion}
                    />
                }
                {cotizacion.presentacion.tipo === 'Cápsula blanda' &&
                    <EditarBlanda
                        formula={formula}
                        cliente={cliente}
                        producto={producto}
                        objeto={cotizacion}
                    />
                }
                {cotizacion.presentacion.tipo === 'Polvo' &&
                    <EditarPolvo
                        formula={formula}
                        cliente={cliente}
                        producto={producto}
                        objeto={cotizacion}
                    />
                }
                {cotizacion.presentacion.tipo === 'Sticks' &&
                    <EditarStick
                        formula={formula}
                        cliente={cliente}
                        producto={producto}
                        objeto={cotizacion}
                    />
                }
            </div>
            <div className="my-2 d-flex justify-content-start">
                <PDFDownloadLink
                    document={<CotizacionPDF formula={cotizacion.formula} cliente={cotizacion.cliente} producto={cotizacion.presentacion} objeto={cotizacion} />}
                    fileName={`INFORME_COTIZACION_${cotizacion.cliente.nombre}_${cotizacion.presentacion.tipo}_${cotizacion.formula.nombre}_${fecha}.pdf`}
                >
                    {({ blob, url, loading: loadingDocument, error: error_loading }) =>
                        loadingDocument ?
                            <Boton name="Cargando documento..." icon="download" size="md" color="green" tooltip="Cargando informe" position='end' />
                            :
                            <Boton name="Descargar Pdf" icon="download" size="md" color="green" tooltip="Descargar Informe" position='end' />
                    }
                </PDFDownloadLink>
            </div>
        </>
    )

}

export default withRouter(EditarCotizacion)