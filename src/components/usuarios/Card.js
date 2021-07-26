import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { Link, withRouter } from 'react-router-dom';
import Action from '../shared/Action';
import Label from '../shared/Label'

const CardUsuarios = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { usuario, setConfirmation, mostrarMsj } = props;

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos de Usuario"}</h4>
            <div className="mx-1">
                <h6>Nombre</h6>
                <Label icon="font" value={usuario.nombre}/>
                <h6>Identificación</h6>
                <Label icon="id-card-o" value={usuario.cedula}/>
                <h6>Correo</h6>
                <Label icon="at" value={usuario.correos[0].email}/> 
                <h6>Telefono</h6>
                <Label icon="phone" value={usuario.telefonos[0].telefono}/>
            </div> 
            <div className="d-flex justify-content-end mx-1 my-1">
                <div className="mx-1"><Link to={`usuarios/editar/${usuario.id}`}><Action tooltip="Editar Usuario" color="orange" icon="edit" size="xs"/></Link></div>
                <div className="mx-1"><Action onClick={() => { props.session.roles.some(rol => rol.tipo === localStorage.getItem('rol') && (rol.acciones[0].eliminar === true)) ? setConfirmation({bool: true, id: usuario.id}) : mostrarMsj() }} tooltip="Eliminar Usuario" color="red" icon="trash" size="xs"/></div>
            </div>
        </Panel>
    )
}

export default withRouter(CardUsuarios)