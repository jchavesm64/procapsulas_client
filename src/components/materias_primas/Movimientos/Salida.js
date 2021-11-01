/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { OBTENER_MOVIMIENTOS_2, SAVE_SALIDA } from '../../../services/MovimientosService'
import Boton from '../../shared/Boton'
import { Input, InputPicker, Loader, Notification, Modal, Button } from 'rsuite'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { VALIDAR_PARAMETRO } from '../../../services/ParametrosGeneralesService';


const Salida = ({ ...props }) => {

    const { id } = props.match.params;
    const { session } = props
    const [val_cod, {loading: load_validar}] = useMutation(VALIDAR_PARAMETRO);
    const [lote, setLote] = useState('')
    const [validado, setValidado] = useState(false)
    const [validar, setValidar] = useState(false)
    const [cantidad, setCantidad] = useState('')
    const [parametro, setParametro] = useState('')
    const { loading: load_lotes, error: error_lotes, data: data_lotes } = useQuery(OBTENER_MOVIMIENTOS_2, { variables: { id: id }, pollInterval: 1000 })
    const [insertar] = useMutation(SAVE_SALIDA);

    const getLotes = () => {
        if (data_lotes !== null) {
            if (data_lotes.obtenerMovimientos2 != null) {
                const data = data_lotes.obtenerMovimientos2;
                var datos = [];
                data.map(item => {
                    datos.push({
                        label: item.lote,
                        value: item
                    })
                })
                return datos
            }
        }
        return []
    }

    const guardarSalida = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if(cantidad > 0 && lote.existencia >= cantidad){
            try{
                var prov = null
                if(lote.proveedor){
                    prov = lote.proveedor.id
                }
                const input = {
                    tipo: 'SALIDA',
                    lote: lote.lote,
                    proveedor: prov,
                    codigo: lote.codigo,
                    fecha: fecha,
                    cantidad: cantidad,
                    usuario: session.id,
                    materia_prima: lote.materia_prima.id
                }
                const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                const { estado, message } = data.insertarSalida;
                if (estado) {
                    Notification['success']({
                        title: 'Ingresar Salida',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/materias_primas`);
                } else {
                    Notification['error']({
                        title: 'Ingresar Salida',
                        duration: 5000,
                        description: message
                    })
                }
            }catch(error){
                console.log(error)
                Notification['error']({
                    title: 'Ingresar Entrada',
                    duration: 5000,
                    description: "Hubo un error inesperado al guardar la salida"
                })
            }
        }else if(lote.existencia < cantidad){
            Notification['warning']({
                title: 'Ingresar Salida',
                duration: 5000,
                description: "No hay suficientes existencias"
            })
        }
    }

    const validarCodigo = async () => {
        const input = {
            codigo: 'C-001',
            valor: parametro
        }
        const {data} = await val_cod({ variables: { input }, errorPolicy: 'all' });
        const { estado, message } = data.validarParametro;
        if (estado) {
            Notification['success']({
                title: 'Recuperar Clave',
                description: message,
                duration: 10000
            });
            setValidar(false);
            setValidado(true);
        } else {
            Notification['error']({
                title: 'Recuperar Clave',
                description: message,
                duration: 10000
            });
        }
    }

    const validarForm = () => {
        return !lote || cantidad <= 0
    }

    if (load_lotes) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_lotes) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de lotes, verificar tu conexión a internet'
        })
    }

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Salida</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Lote</h6>
                    <InputPicker cleanable={false} value={lote} className="rounded-0 w-100" size="md" placeholder="Lote" data={getLotes()} searchable={true} onChange={(e) => setLote(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Cantidad</h6>
                    <Input type="text" placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e)} />
                </div>
            </div>
            <Modal backdrop="static" show={validar} onHide={() => { setValidar(false) }}>
                <Modal.Header>
                    <Modal.Title>Código de Verificación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row mx-2">
                        <h6 className="mb-2" >Ingrese el Código</h6>
                        <Input type="text" placeholder="Código" value={parametro} onChange={(e) => setParametro(e)} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={parametro === ''} onClick={() => validarCodigo()} appearance="primary">
                        Validar
                    </Button>
                    <Button onClick={() => setValidar(false)} appearance="subtle">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="row mt-2">
                {
                    (validado) ?
                    (
                        <Boton onClick={() => guardarSalida()} tooltip="Guardar Proveedor" name="Guardar" icon="save" color="green" disabled={validarForm()} />
                    ):(
                        <Boton onClick={() => setValidar(true)} tooltip="Validar Permiso" name="Verificar" icon="check" color="blue" />
                    )
                }
            </div>
        </div>
    )
}

export default withRouter(Salida)