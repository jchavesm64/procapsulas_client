/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardMateria = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { seleccion, setConfirmation, mostrarMsj } = props;

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

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Seleccion"}</h4>
            <div className="mx-1">
                <h6>Selección</h6>
                <Label icon="font" value={seleccion.seleccion.producto.nombre} />
                <h6>Existencias</h6>
                <Label icon="hashtag" value={calcularMovimientos(seleccion.movimientos)} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1">
                    <Link to={`salida_seleccion/${seleccion.seleccion.id}`}>
                        <Action tooltip="Ingresar Salida" color="violet" icon="fas fa-minus" size="xs" />
                    </Link>
                </div>
                <div className="mx-1"><Link to={`movimientos_seleccion/${seleccion.seleccion.id}/${seleccion.seleccion.nombre}`}><Action tooltip="Ver movimientos" color="blue" icon="info" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`movimiento_seleccion/nuevo/${seleccion.seleccion.id}`}><Action tooltip="Agregar Movimiento" color="green" icon="plus" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`seleccion/editar/${seleccion.seleccion.id}`}><Action tooltip="Editar Seleccion" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: seleccion.seleccion.id }) : mostrarMsj() }} tooltip="Eliminar Seleccion" color="red" icon="trash" size="xs" /></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardMateria)