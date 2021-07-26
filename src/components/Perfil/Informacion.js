import React from 'react';
import {InputGroup, Icon} from 'rsuite';
import List from '../shared/List';

const Informacion = ({ usuario }) => {

    return (
        <div style={{margin: 0, padding: 0}} className="row mx-auto">
            <hr />
            <div className="col-md-6 d-inline-block my-1">
                <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                    <InputGroup.Addon>
                        <Icon icon="user" />
                    </InputGroup.Addon>
                    <span className="w-100 text-left text-dark pt-1 px-3">{usuario.nombre}</span>
                </InputGroup>
                <List estilos="w-90 shadow mx-auto" data={usuario.correos} clave="email" header="Correos Registrados" edit={false} borrar={false} />
            </div>
            <div className="col-md-6 d-inline-block my-1">
                <InputGroup className="mx-auto w-90 btn-outline-light mb-2">
                    <InputGroup.Addon>
                        <Icon icon="id-card-o" />
                    </InputGroup.Addon>
                    <span className="w-100 text-left text-dark pt-1 px-3">{usuario.cedula}</span>
                </InputGroup>
                <List estilos="w-90 shadow mx-auto" data={usuario.telefonos} clave="telefono" header="Telefonos Registrados" edit={false} borrar={false}/>
            </div>
        </div>
    );
}

export default Informacion;