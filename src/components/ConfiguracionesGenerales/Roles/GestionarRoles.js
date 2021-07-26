import React, { useState } from 'react';
import { withRouter } from 'react-router';
import {
    OBTENER_ROLES,
    UPDATE_ROLES,
    OBTENER_PERMISOS
} from '../../../services/RolService';
import Boton from '../../shared/Boton';
import { Redirect } from 'react-router-dom';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Loader, Notification, TagPicker, Checkbox, CheckboxGroup } from 'rsuite';

const GestionarRoles = ({ ...props }) => {
    const [rol, setRol] = useState();
    const [permisos, setPermisos] = useState([]);
    const [acciones, setAcciones] = useState([]);
    const { loading: load_roles, error: error_roles, data: data_roles } = useQuery(OBTENER_ROLES, { pollInterval: 1000 });
    const { loading: load_permisos, error: error_permisos, data: data_permisos } = useQuery(OBTENER_PERMISOS, { pollInterval: 1000 });
    const [editar] = useMutation(UPDATE_ROLES);

    const mostrarRol = (e) => {
        setRol(e);
        const rol = data_roles.obtenerRoles.filter(rol => rol.id === e);
        const { permisos, acciones } = rol[0] ? rol[0] : [];
        const rolPermisos = [];
        const rolAcciones = [];
        permisos && permisos.map(item => {
            rolPermisos.push(item.id);
        })
        acciones && acciones.map(item => {
            if (item.editar) rolAcciones.push("editar")
            if (item.eliminar) rolAcciones.push("eliminar")
            if (item.agregar) rolAcciones.push("agregar")
        })
        setAcciones(rolAcciones);
        setPermisos(rolPermisos);
    }

    const getPermisos = () => {
        const datos = []
        if (data_permisos.obtenerPermisos) {
            data_permisos.obtenerPermisos.map(item => {
                datos.push({
                    "value": item.id.toString(),
                    "label": item.descripcion.toString()
                });
            });
        }
        return datos;
    }

    const validarForm = () => {
        return !permisos || !rol;
    }

    const actualizarRol = async () => {
        try{
            const input = {
                permisos,
                acciones:[{
                    editar: acciones.includes("editar"),
                    eliminar: acciones.includes("eliminar"),
                    agregar: acciones.includes("agregar")
                }],
            }
            const {data} = await editar({variables: {id: rol, input: input}})
            const {estado, message} = data.actualizarRol;
            if(estado){
                Notification['success']({
                    title: 'Actualizar Rol',
                    duration: 10000,
                    description: message
                })
                props.history.push(`/perfil`);
            }else{
                Notification['error']({
                    title: 'Actualizar Rol',
                    duration: 10000,
                    description: message
                })
            }
        }catch(error){
            
        }
    }

    if (load_roles || load_permisos) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            {props.session && props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && rol.tipo === "ADMINISTRADOR" && (rol.permisos.some(permiso => permiso.descripcion === "CONFIGURACIONES GENERALES"))) ? '' : <Redirect to="/login" />}
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/config`)} icon="arrow-left-line" tooltip="Ir a Configuraciones Generales" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Gestionar Roles</h3>
            <form className="shadow-md px-8 pt-6 pb-8 mb-4">
                <div className="form-group">
                    <h4>Roles</h4>
                    <select onChange={(e) => mostrarRol(e.target.value)} value={rol} className="my-3 form-control">
                        <option value="">Seleccionar...</option>
                        {
                            data_roles.obtenerRoles.map((rol, index) => (
                                <option key={index} value={rol.id}>{rol.tipo}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="form-group">
                    <h4>Permisos</h4>
                    <TagPicker className="my-3" data={getPermisos()} block defaultValue={["60a9acc5a75f5423f08309e2"] }value={permisos} onChange={e => setPermisos(e)} />
                </div>
                <div className="form-group">
                    <h4>Acciones</h4>
                    <CheckboxGroup className="my-3" inline name="checkboxList" value={acciones} onChange={(e) => setAcciones(e)}>
                        <Checkbox value="agregar">Agregar</Checkbox>
                        <Checkbox value="editar">Editar</Checkbox>
                        <Checkbox value="eliminar" >Eliminar</Checkbox>
                    </CheckboxGroup>
                </div>
            </form>
            <div className="form-group col-md-12">
                <Boton type="button" tooltip="Actualizar Cambios" name="Actualizar" icon="edit" size="sm" color="blue" position="end" onClick={actualizarRol} disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(GestionarRoles);