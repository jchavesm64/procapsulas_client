/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardProveedores = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { proveedor, setConfirmation, mostrarMsj } = props;

    return (
        <Panel shaded bordered bodyFill style={{ width: 350, maxWidth: 350 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Proveedor"}</h4>
            <div className="mx-1">
                <h6>Nombre</h6>
                <Label icon="font" value={proveedor.empresa} />
                {proveedor.cedula &&
                    <>
                        <h6>Identificación</h6>
                        <Label icon="id-card-o" value={proveedor.cedula} />
                    </>
                }
                <h6>País</h6>
                <Label icon="globe" value={proveedor.pais} />
                <h6>Estado o Provincia</h6>
                <Label icon="bank" value={proveedor.ciudad} />
                {proveedor.correo &&
                    <>
                        <h6>Correo</h6>
                        <Label icon="at" value={proveedor.correos[0].email} />
                    </>
                }
                {proveedor.telefono &&
                    <>
                        <h6>Teléfono</h6>
                        <Label icon="phone" value={proveedor.telefonos[0].telefono} />
                    </>
                }
                {proveedor.redes.length > 0 &&
                    <>
                        <h6>Redes Sociales</h6>
                        <a href={proveedor.redes[0].enlace} target="_blank"><Label icon="comment" value={proveedor.redes[0].red + ": " + proveedor.redes[0].enlace} /></a>
                    </>
                }
            </div>
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`proveedores/editar/${proveedor.id}`}><Action tooltip="Editar Proveedor" color="orange" icon="edit" size="xs" /></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({ bool: true, id: proveedor.id }) : mostrarMsj() }} tooltip="Eliminar Cliente" color="red" icon="trash" size="xs" /></div>
                <div className="mx-1"><Link to={`proveedores/detalles/${proveedor.id}`}><Action tooltip="Detalles del Proveedor" color="blue" icon="info" size="xs" /></Link></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardProveedores)