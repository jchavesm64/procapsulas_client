import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, InputPicker, Notification} from 'rsuite'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_MOVIMIENTO_INSUMO } from '../../../services/MovimientoInsumosResolver';
import Boton from '../../shared/Boton';


const NuevoMovimientoSeleccion = (props) => {
    const [tipo, setTipo] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [insertar] = useMutation(SAVE_MOVIMIENTO_INSUMO);

    const { session } = props
    const { id } = props.match.params

    const onSaveMovimiento = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (!(cantidad <= 0)) {
            try {
                const input = {
                    tipo,
                    fecha,
                    cantidad,
                    usuario: session.id,
                    insumo: id
                }
                const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                const { estado, message } = data.insertarMovimientoInsumo;
                if (estado) {
                    Notification['success']({
                        title: 'Ingresar Movimiento',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/insumos`);
                } else {
                    Notification['error']({
                        title: 'Ingresar Movimiento',
                        duration: 5000,
                        description: message
                    })
                }
            } catch (error) {
                console.log(error)
                Notification['error']({
                    title: 'Ingresar Movimiento',
                    duration: 5000,
                    description: "Hubo un error inesperado al guardar el movimiento"
                })
            }
        } else {
            Notification['error']({
                title: 'Ingresar Movimiento',
                duration: 5000,
                description: "Los valores numericos deben ser mayor a cero"
            })
        }
    }

    const validarForm = () => {
        return !tipo || !cantidad
    }

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/insumos`)} icon="arrow-left-line" tooltip="Ir a Insumos" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Movimiento</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Tipo</h6>
                    <InputPicker className='w-100' type="text" placeholder="Tipo" data={[{"label": "Entrada", "value": "ENTRADA"}, {'label': 'Salida', 'value': 'SALIDA'}]} value={tipo} onChange={(e) => setTipo(e)} />
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