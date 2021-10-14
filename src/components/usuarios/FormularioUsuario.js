/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Action from '../shared/Action'
import List from '../shared/List'
import Boton from '../shared/Boton'
import { InputGroup, Icon, TagPicker, Loader, Notification, InputPicker } from 'rsuite'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { OBTENER_ROLES } from '../../services/RolService'
import { UPDATE_USER } from '../../services/UsuarioService';
import { countries2 } from '../../Json/countries2.json'

const NuevoUsuario = ({ ...props }) => {

    const usuario = props.usuario;

    const getSelectedRoles = () => {
        const datos = [];
        usuario.roles.map(r => {
            datos.push(r.id);
        })
        return datos;
    }

    const [datos, setDatos] = useState(true);
    const [contacto, setContacto] = useState(false);
    const [rolesUsuario, setRolesUsuario] = useState(false);
    const [nombre, setNombre] = useState(usuario.nombre);
    const [cedula, setCedula] = useState(usuario.cedula);
    const [telefonos] = useState(usuario.telefonos);
    const [correos] = useState(usuario.correos);
    const [roles, setRoles] = useState(getSelectedRoles());
    const [refrescar, setRefrescar] = useState(false);
    const { loading: load_roles, data: data_roles } = useQuery(OBTENER_ROLES, { pollInterval: 1000 });
    const [actualizar] = useMutation(UPDATE_USER);
    const [code, setCode] = useState('')

    const agregarTelefono = (telefono) => {
        if (code !== "") {
            var band = false;
            telefonos.map(t => {
                if (code + ' ' + t.telefono === telefono) {
                    band = true;
                }
            })
            if (!band) {
                telefonos.push({
                    "telefono": code + ' ' + telefono
                })
                document.getElementById('telefono').value = "";
                setRefrescar(!refrescar);
            } else {
                Notification['info']({
                    title: 'Agregar Telefono',
                    duration: 5000,
                    description: "Ya está agregado el telefono"
                })
            }
        } else {
            Notification['info']({
                title: 'Agregar Telefono',
                duration: 5000,
                description: "No ha seleccionado un código"
            })
        }
    }

    const getCodes = () => {
        const codes = []
        countries2.map(c => {
            codes.push({
                "label": c.dial_code,
                "value": c.dial_code
            })
        })
        return codes
    }

    const agregarCorreo = (correo) => {
        if (/^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i.test(correo)) {
            var band = false;
            correos.map(c => {
                if (c.email === correo) {
                    band = true;
                }
            })
            if (!band) {
                correos.push({
                    "email": correo
                })
                document.getElementById('correo').value = "";
                setRefrescar(!refrescar);
            } else {
                Notification['info']({
                    title: 'Agregar Correo',
                    duration: 5000,
                    description: "Ya está agregado el correo"
                })
            }
        } else {
            Notification['info']({
                title: 'Agregar Correo',
                duration: 5000,
                description: "El formato de correo no es valido"
            })
        }
    }

    const getRoles = () => {
        const datos = [];
        if (data_roles.obtenerRoles) {
            data_roles.obtenerRoles.map(item => {
                datos.push({
                    "value": item.id,
                    "label": item.tipo
                });
            });
        }
        return datos;
    }

    const validarForm = () => {
        return !nombre || !cedula || telefonos.length === 0 || correos.length === 0 || roles.length === 0;
    }

    const onSaveUsuario = async () => {
        try {
            const input = {
                nombre,
                cedula,
                correos,
                telefonos,
                roles,
                estado: "ACTIVO"
            }
            const { data } = await actualizar({ variables: { id: usuario.id, input }, errorPolicy: 'all' })
            const { estado, message } = data.actualizarUsuario;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Usuario',
                    duration: 5000,
                    description: message
                })
                if (!props.perfil) {
                    props.history.push(`/usuarios`);
                } else {
                    props.history.push(`/perfil`);
                }
            } else {
                Notification['error']({
                    title: 'Actualizar Usuario',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            Notification['error']({
                title: 'Actualizar Usuario',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el cliente"
            })
        }
    }

    if (load_roles) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            {!props.perfil &&
                <>
                    <div>
                        <Boton name="Atras" onClick={e => props.history.push(`/usuarios`)} icon="arrow-left-line" tooltip="Ir a usuarios" size="xs" color="blue" />
                    </div>
                    <h3 className="text-center">{props.uso === true ? "Editar Usuario" : "Detalles del Usuario"}</h3>
                </>
            }
            <div>
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Datos del Usuario</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {datos &&
                    <>
                        <h6>Nombrel del Usuario</h6>
                        <input className="form-control mt-3 mb-3" type="text" placeholder="Nombre del usuario" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                        <h6>Número de identificación del usuario</h6>
                        <input className="form-control mt-3 mb-3" type="text" placeholder="Número de identificación del usuario" value={cedula} onChange={(e) => setCedula(e.target.value)} />
                    </>
                }
                <div className="row border-bottom border-dark my-3">
                    <div className="col-md-11 float-left">
                        <h5>Contacto del Usuario</h5>
                    </div>
                    <div className="d-flex col-md-1 justify-content-end float-right">
                        <Action className="mb-1" onClick={() => { setContacto(!contacto) }} tooltip={contacto ? "Ocultar" : "Mostrar"} color={"cyan"} icon={contacto ? "angle-up" : "angle-down"} size="xs" />
                    </div>
                </div>
                {contacto &&
                    <div style={{ margin: 0, padding: 0 }} className="row mt-3">
                        <div className="col-md-6 d-inline-block">
                            <List estilos="w-90 mx-auto" data={telefonos} clave="telefono" header="Teleonos" edit={false} borrar={true} setRefrescar={setRefrescar} refrescar={refrescar}/>
                            <div className="input-group mt-3 mb-3 w-90 mx-auto">
                                {props.uso === true &&
                                    <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                        <InputGroup.Addon>
                                            <Icon icon="phone" />
                                        </InputGroup.Addon>
                                        <InputPicker className="h-100 rounded-0" size="md" placeholder="Area" data={getCodes()} searchable={true} onChange={(e) => setCode(e)} style={{ border: 'none' }} />
                                        <input id="telefono" type="number" placeholder="Numero de telefono" className="rounded-0 form-control" />
                                        <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarTelefono(document.getElementById('telefono').value)} tooltip="Agregar Telefono" />
                                    </InputGroup>
                                }
                            </div>
                        </div>
                        <div className="col-md-6 d-inline-block">
                            <List data={correos} clave="email" header="Correos" edit={false} borrar={true} setRefrescar={setRefrescar} refrescar={refrescar}/>
                            <div className="input-group mt-3 mb-3 w-90 mx-auto">
                                {props.uso === true &&
                                    <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                                        <InputGroup.Addon>
                                            <Icon icon="at" />
                                        </InputGroup.Addon>
                                        <input id="correo" type="email" placeholder="Dirección de correo electronico" className="rounded-0 form-control" />
                                        <Boton className="rounded-0 h-100" icon="save" color="green" onClick={() => agregarCorreo(document.getElementById('correo').value)} tooltip="Agregar Correo" />
                                    </InputGroup>
                                }
                            </div>
                        </div>
                    </div>
                }
                {!props.perfil &&
                    <div className="row border-bottom border-dark my-3">
                        <div className="col-md-11 float-left">
                            <h5>Roles del Usuario</h5>
                        </div>
                        <div className="d-flex col-md-1 justify-content-end float-right">
                            <Action className="mb-1" onClick={() => { setRolesUsuario(!rolesUsuario) }} tooltip={rolesUsuario ? "Ocultar" : "Mostrar"} color={"cyan"} icon={rolesUsuario ? "angle-up" : "angle-down"} size="xs" />
                        </div>
                    </div>
                }
                {rolesUsuario &&
                    <>
                        <h6>Roles</h6>
                        <TagPicker className="my-3" data={getRoles()} block value={roles} onChange={e => setRoles(e)} />
                    </>
                }
            </div>
            {props.uso === true &&
                <div className="d-flex justify-content-end float-rigth mt-2">
                    <Boton onClick={onSaveUsuario} tooltip="Guardar Usuario" name="Guardar" icon="save" color="green" disabled={validarForm()} />
                </div>
            }
        </>
    )
}

export default withRouter(NuevoUsuario)