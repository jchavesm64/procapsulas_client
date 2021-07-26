import React, { useState } from 'react';
import { InputGroup, FormControl, ControlLabel, Form, Notification } from 'rsuite';
import Boton from '../shared/Boton';
import { ApolloConsumer, useMutation } from 'react-apollo';
import {CAMBIAR_CLAVE} from '../../services/UsuarioService'

const cerrarSesionUsuario = (cliente,history)=>{
    localStorage.removeItem('token','');
    //desloguear al usuario
    cliente.resetStore();
    //redirecionar al usuario
    history.push('/login');
    Notification['success']({
        title: 'Genial',
        duration: 10000,
        description: 'Felicidades, la contraseña se actualizo correctamente'
    });
}

const CambiarClave = ({ props, usuario }) => {
    const [actual, setActual] = useState('');
    const [nueva, setNueva] = useState('');
    const [confirmar, setConfirmar] = useState('');
    const [cambiar] = useMutation(CAMBIAR_CLAVE);

    const actualizarClave = async (cliente) => {
        if(nueva === confirmar){
            const {data} = await cambiar({variables: {id: usuario.id, actual, nueva}});
            const {success, message} = data.cambiarClave;
            if(success){
                await cerrarSesionUsuario(cliente, props.history)
            }else{
                Notification['error']({
                    title: 'Cambiar clave',
                    duration: 5000,
                    description: message
                })
            }
        }else{
            Notification['error']({
                title: 'Cambiar clave',
                duration: 5000,
                description: "La nueva clave y su confirmacion no coinciden"
            })
        }
    }

    return (
        <ApolloConsumer>{
            cliente => {
                return (
                    <div className="mx-auto w-75">
                        <Form fluid>
                            <ControlLabel style={{ fontSize: 16, textAlign: 'center', fontWeight: 700 }}>Contraseña actual</ControlLabel>
                            <InputGroup className="w-100 mb-2">
                                <FormControl style={{ textAlign: 'center' }} name="actual" placeholder="Contraseña actual" onChange={e => setActual(e)} defaultValue={actual} />
                            </InputGroup>
                            <ControlLabel style={{ fontSize: 16, textAlign: 'center', fontWeight: 700 }}>Contraseña nueva</ControlLabel>
                            <InputGroup className="w-100 mb-2">
                                <FormControl style={{ textAlign: 'center' }} name="nueva" placeholder="Contraseña nueva" onChange={e => setNueva(e)} defaultValue={nueva} />
                            </InputGroup>
                            <ControlLabel style={{ fontSize: 16, textAlign: 'center', fontWeight: 700 }}>Confirme contraseña</ControlLabel>
                            <InputGroup className="w-100 mb-2">
                                <FormControl style={{ textAlign: 'center' }} name="actual" placeholder="Confirme contraseña" onChange={e => setConfirmar(e)} defaultValue={confirmar} />
                            </InputGroup>
                            <Boton name="Sobrescribir" tooltip="Sobrescribir contraseña y cerrar la session" color="red" icon="exchange" size="sm" position="end" onClick={() => { actualizarClave(cliente) } } />
                        </Form>
                    </div>
                );
            }
        }</ApolloConsumer>
    );
}

export default CambiarClave;