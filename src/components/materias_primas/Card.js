import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardMateria = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { materia, setConfirmation, mostrarMsj } = props;

    function calcularMovimientos(datos){
        var cantidad = 0;
        datos.map(item => {
            if(item.tipo === 'ENTRADA'){
                cantidad += item.cantidad
            }else{
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
            <h4 className="mt-4 text-center">{"Datos de la Materia Prima"}</h4>
            <div className="mx-1">
                <h6>Materia Prima</h6>
                <Label icon="font" value={materia.materia_prima.nombre} />
                <h6>País</h6>
                <Label icon="globe" value={materia.materia_prima.pais} />
                <h6>Existencias</h6>
                <Label icon="hashtag" value={calcularMovimientos(materia.movimientos) + ' ' + materia.materia_prima.unidad} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`movimientos/${materia.materia_prima.id}/${materia.materia_prima.nombre}`}><Action tooltip="Ver movimientos" color="blue" icon="info" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`movimiento/nuevo/${materia.materia_prima.id}`}><Action tooltip="Agregar Movimiento" color="green" icon="plus" size="xs" /></Link></div>
                <div className="mx-1"><Link to={`materias_primas/editar/${materia.materia_prima.id}`}><Action tooltip="Editar Materia Prima" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: materia.id }) : mostrarMsj() }} tooltip="Eliminar Materia Prima" color="red" icon="trash" size="xs" /></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardMateria)