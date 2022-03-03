import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, Notification} from 'rsuite'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_MOVIMIENTO_DISPENSADO } from '../../../services/MovimientoDispensadoService';
import Boton from '../../shared/Boton';


const NuevoMovimientoSeleccion = (props) => {
    const [lote, setLote] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [insertar] = useMutation(SAVE_MOVIMIENTO_DISPENSADO);

    const { session } = props
    const { id } = props.match.params

    const onSaveMovimiento = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (!(cantidad <= 0)) {
            try {
                const input = {
                    tipo: 'ENTRADA',
                    lote,
                    fecha,
                    cantidad,
                    usuario: session.id,
                    dispensado: id
                }
                const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                const { estado, message } = data.insertarMovimientoDispensado;
                if (estado) {
                    Notification['success']({
                        title: 'Ingresar Entrada',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/dispensado`);
                } else {
                    Notification['error']({
                        title: 'Ingresar Entrada',
                        duration: 5000,
                        description: message
                    })
                }
            } catch (error) {
                console.log(error)
                Notification['error']({
                    title: 'Ingresar Entrada',
                    duration: 5000,
                    description: "Hubo un error inesperado al guardar la entrada"
                })
            }
        } else {
            Notification['error']({
                title: 'Ingresar Entrada',
                duration: 5000,
                description: "Los valores numericos deben ser mayor a cero"
            })
        }
    }

    const validarForm = () => {
        return !lote || !cantidad
    }

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/dispensado`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Entrada</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Lote</h6>
                    <Input type="text" placeholder="Lote" value={lote} onChange={(e) => setLote(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Cantidad</h6>
                    <Input type="number" min={0} placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e)} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMovimiento} tooltip="Guardar Movimiento" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </div>
    )
}

export default withRouter(NuevoMovimientoSeleccion)