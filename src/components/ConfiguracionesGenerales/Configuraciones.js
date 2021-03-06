import React from 'react';
import Card from './Card';
import { Redirect } from 'react-router-dom';

const Configuracion = ({session}) => {
    return(
        <>
            {session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.permisos.some(permiso => permiso.descripcion === "CONFIGURACIONES GENERALES"))) ?  '':<Redirect to="/perfil" /> }
            <h3 className="text-center mb-2">Configuraciones Generales</h3>
            <div className="d-flex flex-wrap justify-content-center col-xs">
                <Card link={"/config/tipoproveduria"} name={"Tipo de Proveduría"} icon="list"/>
                <Card link={"/config/tipoproductos"} name={"Tipo de Productos"} icon="list"/>
                <Card link={"/config/roles"} name={"Gestionar Roles"} icon="peoples"/>
                <Card link={"/config/formulas"} name="Gestionar Nueva Fórmula" icon="calculator"/>
                <Card link={"/config/formulasbase"} name="Gestionar Nueva Fórmula Base" icon="calculator"/>
                <Card link={"/config/categorias"} name="Gestionar Categorias de Máquinas" icon="list"/>
                <Card link={"/config/ubicaciones"} name="Gestionar Ubicaciones en Planta" icon="fas fa-map-marker"/>
                <Card link={"/config/puestos"} name="Gestionar Puestos de Trabajo" icon="fas fa-briefcase"/>
            </div>
        </>
    )
}

export default Configuracion;