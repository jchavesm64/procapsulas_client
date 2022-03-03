/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardMateria = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { producto, setConfirmation, mostrarMsj } = props;

    function calcularMovimientos(datos) {
        var cantidad = 0;
        datos.map(item => {
            if (item.tipo === 'ENTRADA') {
                cantidad += item.cantidad
            } else {
                cantidad -= item.cantidad;
            }
        })
        return cantidad;
    }

    console.log(producto)

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Producto"}</h4>
            <div className="mx-1">
                <h6>Producto</h6>
                <Label icon="font" value={producto.producto.nombre} />
                <h6 className="text-center">Orden de Producción</h6>
                <h6>Cliente</h6>
                <Label icon="user" value={producto.producto.orden_produccion.cliente.nombre} />
                <h6>Fórmula</h6>
                <Label icon="list" value={producto.producto.orden_produccion.formula.nombre} />
                <h6>Tipo</h6>
                <Label icon="font" value={producto.producto.orden_produccion.presentacion.tipo} />
                <h6>Existencias</h6>
                <Label icon="hashtag" value={calcularMovimientos(producto.movimientos) + ' ' + producto.producto.unidad} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`movimientos_productos/${producto.producto.id}/${producto.producto.nombre}`}><Action tooltip="Ver movimientos" color="blue" icon="info" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`movimiento_producto/nuevo/${producto.producto.id}`}><Action tooltip="Agregar Movimiento" color="green" icon="plus" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`productos/editar/${producto.producto.id}`}><Action tooltip="Editar Producto" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: producto.producto.id }) : mostrarMsj() }} tooltip="Eliminar Producto" color="red" icon="trash" size="xs" /></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardMateria)