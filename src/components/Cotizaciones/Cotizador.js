/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import { useQuery } from '@apollo/react-hooks'
import { OBTENER_FORMULAS_MOVIMIENTOS } from '../../services/FormulaService'
import { OBTENER_CLIENTES } from '../../services/ClienteService'
import { OBTENER_TIPO_PRODUCTOS } from '../../services/TipoProductoService'
import { Loader, Notification, InputPicker } from 'rsuite';
import CapsulaDura from './capsulaDura'
import CapsulaBlanda from './capsulaBlanda'
import CapsulaPolvo from './capsulaPolvo'
import Stick from './stick'
import Boton from '../shared/Boton';

const Cotizador = ({ ...props }) => {
    const [formula, setFomula] = useState('')
    const [cliente, setCliente] = useState('')
    const [producto, setProducto] = useState('')
    const { loading: load_formulas, error: error_formulas, data: data_formulas } = useQuery(OBTENER_FORMULAS_MOVIMIENTOS, { pollInterval: 1000 })
    const { loading: load_clientes, error: error_clientes, data: data_clientes } = useQuery(OBTENER_CLIENTES, { pollInterval: 1000 })
    const { loading: load_productos, error: error_productos, data: data_productos } = useQuery(OBTENER_TIPO_PRODUCTOS, { pollInterval: 1000 })

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

    const onChangeFormula = (formula) => {
        setFomula(formula)
        setProducto('')
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
                <h5>Parámetros generales de la cotización</h5>
                <div className="row my-2">
                    <div className="col-md-6">
                        <h6>Seleccione la Formula</h6>
                        <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Fórmula" data={getFormulas()} searchable={true} onChange={(e) => onChangeFormula(e)} />
                    </div>
                    <div className="col-md-6">
                        <h6>Seleccione la presentación</h6>
                        <InputPicker cleanable={false} value={producto} className="rounded-0 w-100" size="md" placeholder="Presentación" data={getProducto()} searchable={true} onChange={(e) => setProducto(e)} />
                    </div>
                </div>
                <div className="w-75 mx-auto">
                    <h6>Seleccione el Cliente</h6>
                    <InputPicker cleanable={false} className="rounded-0 w-100" size="md" placeholder="Cliente" data={getClientes()} searchable={true} onChange={(e) => setCliente(e)} />
                </div>
            </div>
            {formula &&
                <div className="bg-white p-2 shadow rounded my-2">
                    {producto.tipo === 'Cápsula dura' &&
                        <CapsulaDura formula={formula} cliente={cliente} producto={producto} />
                    }
                    {producto.tipo === 'Cápsula blanda' && formula.formulaBase &&
                        <CapsulaBlanda formula={formula} cliente={cliente} producto={producto} />
                    }
                    {producto.tipo === 'Polvo' &&
                        <CapsulaPolvo formula={formula} cliente={cliente} producto={producto} />
                    }
                    {producto.tipo === 'Sticks' &&
                        <Stick formula={formula} cliente={cliente} producto={producto} />
                    }
                </div>
            }
        </>
    )
}

export default withRouter(Cotizador)