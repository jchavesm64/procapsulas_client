import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { OBTENER_ROLES } from '../../services/RolService';
import { Loader, Modal, Icon } from 'rsuite';
import Logout from '../authentication/Logout';

const SideBar = ({ session }) => {
    const [show, setShow] = useState(true);
    const [rolTipo, setRolTipo] = useState(localStorage.getItem('rol'));
    const { loading, data } = useQuery(OBTENER_ROLES, { pollInterval: 1000 });

    const agregarRol = async (rol) => {
        setRolTipo(rol);
        await localStorage.setItem('rol', rol);
    }

    localStorage.setItem('rol', session.roles[0].tipo);

    if (loading) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            {
                rolTipo !== null && data.obtenerRoles.some(rol => rol.tipo === rolTipo) && session.roles.some(rol => rol.tipo === rolTipo) ?
                    (
                        <nav id="sidebar">
                            <div className="sidebar-header  text-center ">
                                <h4> Sistema Pro Cápsulas </h4>
                                <strong>SPC v1.0</strong>
                            </div>
                            <ul className="list-unstyled components" >
                                {
                                    session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "USUARIOS"))) ?
                                    <li>
                                        <a href="#usuarios" data-bs-toggle="collapse" aria-expanded="false" >
                                            <h6><Icon icon="user"/>Usuarios</h6>
                                            <strong><Icon icon="user"/>Usuarios</strong>
                                        </a>
                                        <ul className="collapse list-unstyled" id="usuarios">
                                            <li className="List">
                                                <Link to={`/usuarios`}><Icon icon="user"/>Usuarios</Link>
                                            </li>
                                            <li className="List">
                                                <Link to={`/usuarios/nuevo`}><Icon icon="plus"/>Nuevo Usuario</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    : ''
                                }
                                {
                                    session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "CLIENTES"))) ?
                                    <li>
                                        <a href="#clientes" data-bs-toggle="collapse" aria-expanded="false" >
                                            <h6><Icon icon="male"/>Clientes</h6>
                                            <strong><Icon icon="male"/>Clientes</strong>
                                        </a>
                                        <ul className="collapse list-unstyled" id="clientes">
                                            <li className="List">
                                                <Link to={`/clientes`}><Icon icon="male"/>Clientes</Link>
                                            </li>
                                            <li className="List">
                                                <Link to={`/clientes/nuevo`}><Icon icon="plus"/>Nuevo Cliente</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    : ''
                                }
                                {
                                    session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "PROVEEDORES"))) ?
                                    <li>
                                        <a href="#proveedores" data-bs-toggle="collapse" aria-expanded="false" >
                                            <h6><Icon icon="shopping-cart"/>Proveedores</h6>
                                            <strong><Icon icon="shopping-cart"/>Proveedores</strong>
                                        </a>
                                        <ul className="collapse list-unstyled" id="proveedores">
                                            <li className="List">
                                                <Link to={`/proveedores`}><Icon icon="shopping-cart"/>Proveedores</Link>
                                            </li>
                                            <li className="List">
                                                <Link to={`/proveedores/nuevo`}><Icon icon="plus"/>Nuevo Proveedor</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    : ''
                                }
                                {
                                    session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "INVENTARIOS"))) ?
                                    <li>
                                        <a href="#inventarios" data-bs-toggle="collapse" aria-expanded="false" >
                                            <h6><Icon icon="list"/>Inventarios</h6>
                                            <strong><Icon icon="list"/>Inventarios</strong>
                                        </a>
                                        <ul className="collapse list-unstyled" id="inventarios">
                                            <li className="List">
                                                <Link to={`/materias_primas`}><i className="fas fa-boxes"/>Materias Primas</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    : ''
                                }
                                {
                                    session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "COTIZAR"))) ?
                                    <li>
                                        <a href="#cotizar" data-bs-toggle="collapse" aria-expanded="false" >
                                            <h6><Icon icon="money"/>Cotizaciones</h6>
                                            <strong><Icon icon="money"/>Cotizaciones</strong>
                                        </a>
                                        <ul className="collapse list-unstyled" id="cotizar">
                                            <li className="List">
                                                <Link to={`/cotizaciones`}><Icon icon="money"/>Cotizaciones</Link>
                                            </li>
                                            <li className="List">
                                                <Link to={`/cotizar`}><Icon icon="plus"/>Cotizar</Link>
                                            </li>
                                        </ul>
                                    </li>
                                    : ''
                                }
                                {
                                    session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "MAQUINARIA"))) ?
                                        <li>
                                            <a href="#maquinaria" data-bs-toggle="collapse" aria-expanded="false" >
                                                <h6><Icon icon="fas fa-cogs" />Máquinas</h6>
                                                <strong><Icon icon="fas fa-cogs" />Máquinas</strong>
                                            </a>
                                            <ul className="collapse list-unstyled" id="maquinaria">
                                                <li className="List">
                                                    <Link to={`/maquinaria`}><Icon icon="fas fa-cogs" />Máquinas</Link>
                                                </li>
                                                <li className="List">
                                                    <Link to={`/maquinaria/nuevo`}><Icon icon="plus" />Nuevo Máquina</Link>
                                                </li>
                                            </ul>
                                        </li>
                                        : ''
                                }
                            </ul>
                            <ul className="list-unstyled components">
                                <li className="link">
                                    <Link to="/perfil"><Icon icon="user-circle-o" />Mi perfil</Link>
                                </li>
                                <li className="link">
                                    <Logout name="Cerrar Sesión" />
                                </li>
                            </ul>
                            {
                                session.roles.some(rol => rol.tipo === rolTipo && (rol.permisos.some(permiso => permiso.descripcion === "CONFIGURACIONES GENERALES"))) ?
                                    <ul className="list-unstyled components">
                                        <div className="text-center">
                                            <strong>Accesos</strong>
                                            <li className="link">
                                                <Link to="/config"><Icon icon="cog" />Configuraciones Generales</Link>
                                            </li>
                                        </div>
                                    </ul> : ""
                            }
                        </nav>
                    ) : (
                        <>
                            {
                                session.roles.length > 1 ?
                                    <Modal backdrop="static" show={show} onHide={() => { setShow(false) }}>
                                        <Modal.Header>
                                            <Modal.Title>ROL DE USUARIO</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div className="form-group">
                                                <select
                                                    onChange={e => agregarRol(e.target.value)}
                                                    value={rolTipo}
                                                    className="form-control"       >
                                                    <option value="" >Elegir...</option>
                                                    {
                                                        session.rol.map((rolItem, index) => (
                                                            <option key={index} value={rolItem.tipo} >{rolItem.tipo}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>

                                        </Modal.Footer>
                                    </Modal> : agregarRol(session.roles[0].tipo)
                            }
                        </>
                    )
            }
        </>
    )
}

export default SideBar;