/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, Notification, InputPicker } from 'rsuite'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_MOVIMIENTO_PRODUCTO } from '../../../services/MovimientosProductosService';
import Boton from '../../shared/Boton';

const NuevoMovimientoProducto = (props) => {
    const [tipo, setTipo] = useState('')
    const [fecha_vencimiento, setFechaVencimiento] = useState('')
    const [cantidad, setCantidad] = useState('')
    const [insertar] = useMutation(SAVE_MOVIMIENTO_PRODUCTO);

    const { session } = props
    const { id } = props.match.params

    const onSaveMovimiento = async (filename) => {
        var date = new Date();
        var fecha = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        let input = {};
        if (tipo === 'ENTRADA') {
            input = {
                tipo: 'ENTRADA',
                fecha_vencimiento,
                fecha,
                cantidad,
                usuario: session.id,
                producto: id
            }
        } else {
            input = {
                tipo: 'SALIDA',
                fecha,
                cantidad,
                usuario: session.id,
                producto: id
            }
        }
        const validar = tipo === 'ENTRADA' ? (fecha_vencimiento > fecha) : true
        if ((validar)) {
            console.log(input)
            if (cantidad > 0) {
                try {
                    const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                    const { estado, message } = data.insertarMovimientoProducto;
                    if (estado) {
                        Notification['success']({
                            title: 'Ingresar Movimiento',
                            duration: 5000,
                            description: message
                        })
                        props.history.push(`/productos`);
                    } else {
                        Notification['error']({
                            title: 'Ingresar Movimiento',
                            duration: 5000,
                            description: message
                        })
                    }
                } catch (error) {
                    Notification['error']({
                        title: 'Ingresar Movimiento',
                        duration: 5000,
                        description: "Hubo un error inesperado al guardar la entrada"
                    })
                }
            } else {
                Notification['error']({
                    title: 'Ingresar Movimiento',
                    duration: 5000,
                    description: "Los valores numericos deben ser mayor a cero"
                })
            }
        } else {
            Notification['error']({
                title: 'Ingresar Movimiento',
                duration: 5000,
                description: "Las fecha de vencimiento es incorrecta"
            })
        }
    }

    const validarForm = () => {
        if(!tipo){
            return false
        }
        return tipo === 'ENTRADA' ? !fecha_vencimiento || !cantidad : !cantidad;
    }

    return (
        <div>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/productos`)} icon="arrow-left-line" tooltip="Ir a Productos" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Movimiento</h3>
            <div className='row my-2 d-flex justify-content-start'>
                <h6>Tipo de Movimiento</h6>
                <InputPicker className="w-50 mx-2 my-2" data={[{ label: 'Entrada', value: 'ENTRADA' }, { label: 'Salida', value: 'SALIDA' }]} placeholder="Tipo de Movimiento" value={tipo} onChange={(e) => setTipo(e)} />
            </div>
            {
                tipo &&
                <>
                    {
                        tipo === 'ENTRADA' ? (
                            <div className="row my-1">
                                <div className="col-md-6">
                                    <h6 className="my-1">Fecha de Vencimiento</h6>
                                    <Input type="date" placeholder="Fecha de Vencimiento" value={fecha_vencimiento} onChange={(e) => setFechaVencimiento(e)} />
                                </div>
                                <div className="col-md-6">
                                    <h6 className="my-1">Cantidad</h6>
                                    <Input type="number" min={0} placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e)} />
                                </div>
                            </div>
                        ) : (
                            <div className="row my-1">
                                <div className="col-md-6">
                                    <h6 className="my-1">Cantidad</h6>
                                    <Input type="number" min={0} placeholder="Cantidad" value={cantidad} onChange={(e) => setCantidad(e)} />
                                </div>
                            </div>
                        )
                    }
                </>
            }
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={() => onSaveMovimiento()} tooltip="Guardar Movimiento" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </div>
    )
}

export default withRouter(NuevoMovimientoProducto)