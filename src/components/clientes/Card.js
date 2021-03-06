/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardClientes = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { cliente, setConfirmation, mostrarMsj } = props;

    return (
        <Panel shaded bordered bodyFill style={{ width: 350, maxWidth: 350 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Cliente"}</h4>
            <div className="mx-1">
                <h6>Tipo</h6>
                <Label icon="user" value={cliente.tipo} />
                <h6>Nombre</h6>
                <Label icon="font" value={cliente.nombre} />
                <h6>Identificación</h6>
                <Label icon="id-card-o" value={cliente.codigo} />
                <h6>País</h6>
                <Label icon="globe" value={cliente.pais} />
                <h6>Estado o Provincia</h6>
                <Label icon="bank" value={cliente.ciudad} />
                {cliente.correo &&
                    <>
                        <h6>Correo</h6>
                        <Label icon="at" value={cliente.correos[0].email} />
                    </>
                }
                {cliente.telefono &&
                    <>
                        <h6>Teléfono</h6>
                        <Label icon="phone" value={cliente.telefonos[0].telefono} />
                    </>
                }
                {cliente.redes.length > 0 &&
                    <>
                        <h6>Redes Sociales</h6>
                        <a href={cliente.redes[0].enlace} target="_blank"><Label icon="comment" value={cliente.redes[0].red + ": " + cliente.redes[0].enlace} /></a>
                    </>
                }

            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`clientes/editar/${cliente.id}`}><Action tooltip="Editar Cliente" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: cliente.id }) : mostrarMsj() }} tooltip="Eliminar Cliente" color="red" icon="trash" size="xs" /></div>
                <div className="mx-1"><Link to={`clientes/detalles/${cliente.id}`}><Action tooltip="Detalles del Cliente" color="blue" icon="info" size="xs" /></Link></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardClientes)