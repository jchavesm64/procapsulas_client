import React, { useState } from 'react'
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { withRouter } from 'react-router-dom';
import { OBTENER_USUARIO_CODIGO, ENVIAR_CORREO, RECUPERAR_CLAVE } from '../../services/UsuarioService'
import { Loader, Notification, SelectPicker } from 'rsuite'
import Boton from '../shared/Boton'

const CambiarClave = (props) => {
    const [cedula, setCedula] = useState('');
    const [mails, setMails] = useState([]);
    const [correo, setCorreo] = useState(null);
    const [paso2, setPaso2] = useState(false);
    const [paso3, setPaso3] = useState(false);
    const [codigo, setCodigo] = useState(null)
    const [verificacion, setVerificacion] = useState('')
    const [clave, setClave] = useState('');
    const [usuario, { loadig: load_usu_cedula, error: error_usu_cedula, data: data_usu_cedula }] = useLazyQuery(OBTENER_USUARIO_CODIGO);
    const [sendMail, { loadig: load_sendMail, error: error_sendMail, data: data_sendMail }] = useLazyQuery(ENVIAR_CORREO);
    const [recuperar] = useMutation(RECUPERAR_CLAVE);

    const verificarUsuario = async () => {
        await usuario({ variables: { codigo: cedula } });
    }

    const enviarCorreo = async () => {
        await sendMail({ variables: { id: data_usu_cedula.obtenerUsuarioByCodigo.id, correo } });
    }

    const restaurarClave = async () => {
        const {data} = await recuperar({variables: {id: data_usu_cedula.obtenerUsuarioByCodigo.id, nueva: clave}, errorPolicy: 'all'});
        const {success, message} = data.recuperarClave;
        if(success){
            Notification['success']({
                title: 'Recuperar Clave',
                description: message,
                duration: 10000
            });
        }else{
            Notification['error']({
                title: 'Recuperar Clave',
                description: message,
                duration: 10000
            });
        }
        props.history.push(`/login`);
    }

    if (load_usu_cedula || load_sendMail) {
        return <Loader backdrop content="Validando identificación..." vertical size="lg" />
    }
    if (error_usu_cedula) {
        Notification['error']({
            title: 'Error',
            description: error_usu_cedula.message,
            duration: 10000
        });
    }
    if(error_sendMail){
        Notification['error']({
            title: 'Error',
            description: error_sendMail.message,
            duration: 10000
        });
    }

    if (!paso2 && data_usu_cedula) {
        if (data_usu_cedula.obtenerUsuarioByCodigo) {
            const { correos } = data_usu_cedula.obtenerUsuarioByCodigo;
            if (correos !== null) {
                correos.map(c => {
                    mails.push({
                        "label": c.email,
                        "value": c.email
                    })
                });
                setPaso2(true);
            }
        }
    }

    if (paso2 && codigo === null && data_sendMail) {
        if (data_sendMail.enviarCodigoVerificacion) {
            console.log(data_sendMail)
            const { estado, codigo, message } = data_sendMail.enviarCodigoVerificacion;
            if (estado) {
                setCodigo(codigo);
            } else {
                Notification['error']({
                    title: 'Error',
                    description: message,
                    duration: 25000
                });
            }
        }
    }

    return (
        <>
            <h3 className="text-center">Cambiar Contraseña</h3>
            <div className="mt-2">
                <input className="form-control mt-3 mb-3" type="text" placeholder="Número de identificación del usuario" value={cedula} onChange={(e) => setCedula(e.target.value)} />
            </div>
            {!paso2 &&
                <Boton name="Verificar Usuario" tooltip="Verificación de la cuenta" color="blue" icon="arrow-circle-o-right" size="md" position="end" onClick={verificarUsuario} />
            }
            { paso2 &&
                <>
                    <SelectPicker className="mx-auto w-100 mt-3 mb-3" size="md" placeholder="Correos" data={mails} onChange={(e) => setCorreo(e)} searchable={false} />
                    { !codigo &&
                        <Boton name="Enviar correo" tooltip="Enviar correo" color="blue" icon="arrow-circle-o-right" size="md" position="end" onClick={enviarCorreo} disabled={correo === null} />
                    }
                </>
            }
            { codigo &&
                <>
                    <input className="form-control mt-3 mb-3" type="text" placeholder="Código de Verificación" value={verificacion} onChange={(e) => setVerificacion(e.target.value)} />
                    <input className="form-control mt-3 mb-3" type="text" placeholder="Nueva Contraseña" value={clave} onChange={(e) => setClave(e.target.value)} />
                    <Boton name="Restaurar clave" tooltip="Restaurar clave" color="blue" icon="arrow-circle-o-right" size="md" position="end" onClick={restaurarClave} disabled={verificacion === "" || clave === ""} />
                </>
            }
        </>
    )
}

export default withRouter(CambiarClave);