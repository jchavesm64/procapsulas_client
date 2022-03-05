/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardClientes = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { personal, setConfirmation, mostrarMsj } = props;

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
            <h4 className="mt-4 text-center">{"Datos del Colaborador"}</h4>
            <div className="mx-1">
                <h6>Nombre</h6>
                <Label icon="font" value={personal.nombre} />
                <h6>Identificación</h6>
                <Label icon="id-card-o" value={personal.cedula} />
                <h6>País</h6>
                <Label icon="globe" value={personal.pais} />
                <h6>Estado o Provincia</h6>
                <Label icon="bank" value={personal.ciudad} />
                {personal.correo &&
                    <>
                        <h6>Correo</h6>
                        <Label icon="at" value={personal.correos[0].email} />
                    </>
                }
                {personal.telefono &&
                    <>
                        <h6>Teléfono</h6>
                        <Label icon="phone" value={personal.telefonos[0].telefono} />
                    </>
                }
                <h6>Puesto</h6>
                <Label icon="bank" value={personal.puesto.nombre} />
                <h6>Fecha de Contratación</h6>
                <Label icon="bank" value={getFecha(personal.fecha_contrato)} />
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`personal/editar/${personal.id}`}><Action tooltip="Editar Colaborador" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: personal.id }) : mostrarMsj() }} tooltip="Eliminar Colaborador" color="red" icon="trash" size="xs" /></div>
                <div className="mx-1"><Link to={`personal/detalles/${personal.id}`}><Action tooltip="Detalles del Colaborador" color="blue" icon="info" size="xs" /></Link></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardClientes)