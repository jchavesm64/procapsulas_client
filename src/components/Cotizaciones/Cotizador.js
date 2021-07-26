import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_FORMULAS_MOVIMIENTOS } from '../../services/FormulaService'
import { OBTENER_CLIENTES } from '../../services/ClienteService'
import { OBTENER_TIPO_PRODUCTOS } from '../../services/TipoProductoService'
import { Loader, Notification, InputPicker, Input } from 'rsuite';
import CapsulaPolvo from './capsulaPolvo'
import CapsulaBlanda from './capsulaBlanda'
import Boton from '../shared/Boton';

const Cotizador = ({ ...props }) => {
    const [formula, setFomula] = useState('')
    const [cliente, setCliente] = useState('')
    const [producto, setProducto] = useState('')
    const [peso, setPeso] = useState('')
    const [cantidad, setCantidad] = useState(0)
    const [envases, setEnvases] = useState(0)
    const [etiquetas, setEtiquetas] = useState(0)
    const [costoCapsula, setCostoCapsula] = useState(0)
    const [costoEnvase, setCostoEnvase] = useState(0)
    const [costoEtiquetas, setCostoEtiquetas] = useState(0)
    const { loading: load_formulas, error: error_formulas, data: data_formulas } = useQuery(OBTENER_FORMULAS_MOVIMIENTOS, { pollInterval: 1000 })
    const { loading: load_clientes, error: error_clientes, data: data_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
    const { loading: load_productos, error: error_productos, data: data_productos } = useQuery(OBTENER_TIPO_PRODUCTOS, { pollInterval: 1000 })
    const { session } = props

    const getFormulas = () => {
        if (data_formulas !== null) {
            if (data_formulas.obtenerFormulasConMovimiento != null) {
                const data = data_formulas.obtenerFormulasConMovimiento;
                var datos = [];
                data.map(item => {
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
        if (data_clientes !== null) {
            if (data_clientes.obtenerClientes != null) {
                const data = data_clientes.obtenerClientes;
                var datos = [];
                data.map(item => {
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

    const getProducto = () => {
        if (data_productos !== null) {
            if (data_productos.obtenerTipoProductos != null) {
                const data = data_productos.obtenerTipoProductos;
                var datos = [];
                data.map(item => {
                    datos.push({
                        label: item.tipo,
                        value: item
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
            <h3 className="text-center">Cotizador</h3>
            <div className="bg-white p-2 shadow rounded">
                <h5>Parametros de la cotización</h5>
                <div className="row my-2">
                    <div className="col-md-6">
                        <h6>Seleccione la Formula</h6>
                        <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Fórmula" data={getFormulas()} searchable={true} onChange={(e) => setFomula(e)} />
                        <h6>Seleccione el Producto</h6>
                        <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Producto" data={getProducto()} searchable={true} onChange={(e) => setProducto(e)} />
                    </div>
                    <div className="col-md-6">
                        <h6>Seleccione el Cliente</h6>
                        <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Cliente" data={getClientes()} searchable={true} onChange={(e) => setCliente(e)} />
                        <h6>Seleccione el Peso de la Cápsula</h6>
                        <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Peso" data={[{ label: '250 mg', value: '250' }, { label: '500 mg', value: '500' }, { label: '1000 mg', value: '1000' }]} searchable={true} onChange={(e) => setPeso(e)} />
                    </div>
                </div>
            </div>
            <div className="bg-white p-2 shadow rounded my-2">
                <h5>Parametros de la cotización</h5>
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
                        {formula.tipo === 'POLVO' ?
                            (
                                <>
                                    <h6> Costo por Cápsula</h6>
                                    <Input type="number" min={1} value={costoCapsula} onChange={(e) => setCostoCapsula(e)} />
                                </>
                            ) : (
                                <div style={{ height: 60 }}></div>
                            )
                        }
                        <h6>Costo por envase</h6>
                        <Input type="number" min={1} value={costoEnvase} onChange={(e) => setCostoEnvase(e)} />
                        <h6>Costo por etiqueta</h6>
                        <Input type="number" min={1} value={costoEtiquetas} onChange={(e) => setCostoEtiquetas(e)} />
                    </div>
                    <div className="col-md-2">
                        {formula.tipo === 'POLVO' ?
                            (
                                <>
                                    <h6>Total Cápsulas</h6>
                                    <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 35 }}>{(cantidad > 0 && costoCapsula > 0) ? parseFloat(cantidad * costoCapsula).toFixed(2) : 0}</label></strong>
                                </>
                            ) : (
                                <div style={{ height: 60 }}></div>
                            )
                        }
                        <h6>Total Envases</h6>
                        <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 35 }}>{(envases > 0 && costoEnvase > 0) ? parseFloat(envases * costoEnvase).toFixed(2) : 0}</label></strong>
                        <h6>Total Etiquetas</h6>
                        <strong className="d-block text-center bg-white rounded border"><label className="pt-2" style={{ fontSize: 16, height: 35 }}>{(etiquetas > 0 && costoEtiquetas > 0) ? parseFloat(etiquetas * costoEtiquetas).toFixed(2) : 0}</label></strong>
                    </div>
                </div>
            </div>
            <div className="bg-white p-2 shadow rounded my-2">
                {formula.tipo === 'POLVO' &&
                    <CapsulaPolvo formula={formula} cliente={cliente} producto={producto} peso={peso} capsulas={cantidad} costoCapsulas={costoCapsula} envases={envases} costoEnvases={costoEnvase} etiquetas={etiquetas} costoEtiquetas={costoEtiquetas} />
                }
                {formula.tipo === 'BLANDA' &&
                    <CapsulaBlanda formula={formula} cliente={cliente} producto={producto} peso={peso} capsulas={cantidad} envases={envases} costoEnvases={costoEnvase} etiquetas={etiquetas} costoEtiquetas={costoEtiquetas} />
                }
            </div>
        </>
    )
}

export default withRouter(Cotizador)