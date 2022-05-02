/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardActivos = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { activo, setConfirmation, mostrarMsj } = props;

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + ' / ' + mes + ' / ' + day;
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 350, maxWidth: 350 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Activo"}</h4>
            <div className="mx-1">
                <h6>Número</h6>
                <Label icon="fas fa-hashtag" value={activo.numero} />
                <h6>Modelo</h6>
                <Label icon="fas fa-hashtag" value={activo.modelo} />
                <h6>Serie</h6>
                <Label icon="fas fa-hashtag" value={activo.serie} />
                <h6>Fecha de Ingreso</h6>
                <Label icon="fas fa-calendar" value={getFecha(activo.fecha_ingreso)} />
                <h6>Fecha de Etiquetado</h6>
                <Label icon="fas fa-calendar" value={getFecha(activo.fecha_etiquetado)} />
                <h6>Fecha de Desecho</h6>
                {
                    activo.fecha_desechado ? (
                        <Label icon="fas fa-calendar" value={getFecha(activo.fecha_desecho)} />
                    ): (
                        <Label icon="fas fa-calendar" value={"Sin Especificar"} />
                    )
                }
                <h6>Estado</h6>
                <Label icon="fas fa-clock" value={activo.estado} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`activos/editar/${activo.id}`}><Action tooltip="Editar Activo" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: activo.id }) : mostrarMsj() }} tooltip="Eliminar Activo" color="red" icon="trash" size="xs" /></div>
                <div className="mx-1"><Link to={`activos/detalles/${activo.id}`}><Action tooltip="Detalles del Activo" color="blue" icon="info" size="xs" /></Link></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardActivos)