import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, Notification } from 'rsuite'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_MANTENIMIENTO } from '../../../services/MantenimientoService';
import Boton from '../../shared/Boton';
import Label from '../../shared/Label';

const NuevoMantenimiento = ({ ...props }) => {
    const { id } = props.match.params;
    const [descripcion, setDescripcion] = useState('')
    const [fecha_mantenimiento, setFechaMantenimiento] = useState('')
    const [observaciones, setObservaciones] = useState('')
    const [insertar] = useMutation(SAVE_MANTENIMIENTO);

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        return date.getFullYear() + ' / ' + mes + ' / ' + day 
    }

    function getFechaAviso(fecha) {
        var date = new Date(fecha);
        date.setMonth(date.getMonth() - 3)
        return getFecha(date)
    }

    const onSaveMantenimiento = async () => {
        var date = new Date();
        var f = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (fecha_mantenimiento >= f) {
            const input = {
                maquina: id,
                descripcion,
                fecha_mantenimiento,
                observaciones,
                estado: 'Registrado'
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarMantenimiento;
            if (estado) {
                Notification['success']({
                    title: 'Registrar Mantenimiento',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/maquinaria`);
            } else {
                Notification['error']({
                    title: 'Registrar Mantenimiento',
                    duration: 5000,
                    description: message
                })
            }
        } else {
            Notification['warning']({
                title: 'Registrar Mantenimiento',
                duration: 20000,
                description: "La fecha del incidente debe ser hoy o anterior a hoy"
            })
        }
    }

    const validarForm = () => {
        return !descripcion || !fecha_mantenimiento
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Mantenimiento</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Fecha del Mantenimiento</h6>
                    <Input type="date" placeholder="Fecha del Mantenimiento" value={fecha_mantenimiento} onChange={(e) => setFechaMantenimiento(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Fecha del Aviso</h6>
                    <Label className="m-0" icon="fas fa-calendar" value={fecha_mantenimiento ? getFechaAviso(fecha_mantenimiento) : 'Indeterminado'}/>
                </div>
            </div>
            <h6 className="my-1">Descripción</h6>
            <textarea className="form-control" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <h6 className="my-1">Observaciones</h6>
            <textarea className="form-control" placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMantenimiento} tooltip="Guardar Mantenimiento" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevoMantenimiento)