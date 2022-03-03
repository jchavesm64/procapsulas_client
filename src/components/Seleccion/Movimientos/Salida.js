/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, InputPicker, Notification, Loader } from 'rsuite'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { SAVE_MOVIMIENTO_SELECCION, OBTENER_MOVIMIENTOS_SELECCION_2 } from '../../../services/MovimientoSeleccionService';
import Boton from '../../shared/Boton';


const SalidaMovimientoSeleccion = (props) => {

    const { session } = props
    const { id } = props.match.params

    const [lote, setLote] = useState('')
    const [cantidad, setCantidad] = useState('')
    const { loading: load_lotes, error: error_lotes, data: data_lotes } = useQuery(OBTENER_MOVIMIENTOS_SELECCION_2, { variables: { id }, pollInterval: 1000 })
    const [insertar] = useMutation(SAVE_MOVIMIENTO_SELECCION);

    

    const getLotes = () => {
        if (data_lotes !== null) {
            if (data_lotes.obtenerMovimientosSeleccion != null) {
                const data = data_lotes.obtenerMovimientosSeleccion;
                var datos = [];
                data.map(item => {
                    if(item.tipo === 'ENTRADA'){
                        datos.push({
                            label: item.lote,
                            value: item
                        })
                    }
                })
                return datos
            }
        }
        return []
    }

    const onSaveMovimiento = async () => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (!(cantidad <= 0)) {
            try {
                const input = {
                    tipo: 'SALIDA',
                    lote: lote.lote,
                    fecha,
                    cantidad,
                    usuario: session.id,
                    seleccion: id
                }
                const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                const { estado, message } = data.insertarMovimientoSeleccion;
                if (estado) {
                    Notification['success']({
                        title: 'Ingresar Salida',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/seleccion`);
                } else {
                    Notification['error']({
                        title: 'Ingresar Salida',
                        duration: 5000,
                        description: message
                    })
                }
            } catch (error) {
                console.log(error)
                Notification['error']({
                    title: 'Ingresar Salida',
                    duration: 5000,
                    description: "Hubo un error inesperado al guardar la salida"
                })
            }
        } else {
            Notification['error']({
                title: 'Ingresar Salida',
                duration: 5000,
                description: "Los valores numericos deben ser mayor a cero"
            })
        }
    }

    const validarForm = () => {
        return !lote || !cantidad
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
                    <Input type="number" min={0} placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e)} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMovimiento} tooltip="Guardar Movimiento" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </div>
    )
}

export default withRouter(SalidaMovimientoSeleccion)