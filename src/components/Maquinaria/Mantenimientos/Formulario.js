import React, { useState, useEffect } from 'react'
import { Notification, Input, InputPicker } from 'rsuite'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { UPDATE_MANTENIMIENTO } from '../../../services/MantenimientoService'

const Editar = ({ props, mantenimiento }) => {
    const [descripcion, setDescripcion] = useState(mantenimiento.descripcion)
    const [fecha_mantenimiento, setFechaMantenimiento] = useState(mantenimiento.fecha_mantenimiento)
    const [observaciones, setObservaciones] = useState('')
    const [state, setEstado] = useState(mantenimiento.estado)
    const [actualizar] = useMutation(UPDATE_MANTENIMIENTO);

    useEffect(() => {
        setDescripcion(mantenimiento.descripcion)
        setFechaMantenimiento(mantenimiento.fecha_mantenimiento)
        setObservaciones(mantenimiento.observaciones)
        setEstado(mantenimiento.estado)
    }, [mantenimiento])

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + '-' + mes + '-' + day;
    }

    const onSaveMantenimiento = async () => {
        var date = new Date();
        var f = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (fecha_mantenimiento >= f) {
            const input = {
                maquina: mantenimiento.maquina.id,
                descripcion,
                fecha_mantenimiento,
                observaciones,
                estado: state
            }
            const { data } = await actualizar({ variables: { id: mantenimiento.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMantenimiento;
            if (estado) {
                Notification['success']({
                    title: 'Editar Mantenimiento',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/maquinaria`);
            } else {
                Notification['error']({
                    title: 'Editar Mantenimiento',
                    duration: 5000,
                    description: message
                })
            }
        } else {
            Notification['warning']({
                title: 'Editar Mantenimiento',
                duration: 20000,
                description: "La fecha del incidente debe ser hoy o anterior a hoy"
            })
        }
    }

    const getEstados = () => {
        if (mantenimiento.estado === 'Registrado') {
            return [{ "label": "En Proceso", "value": "En Proceso" }, { "label": "Finalizado", "value": "Finalizado" }]
        }
        return [{ "label": "Finalizado", "value": "Finalizado" }]

    }

    const validarForm = () => {
        return !descripcion || !state
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">{props.uso ? "Editar Mantenimiento" : "Detalles de Mantenimiento"}</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Fecha del Mantenimiento</h6>
                    <Input type="date" placeholder="Fecha del Mantenimiento" value={getFecha(fecha_mantenimiento)} onChange={(e) => setFechaMantenimiento(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Estado del Mantenimiento</h6>
                    <InputPicker className='w-100' placeholder="Estado del Mantenimiento" data={getEstados()} value={state} onChange={(e) => setEstado(e)} />
                </div>
            </div>
            <h6 className="my-1">descripción</h6>
            <textarea className="form-control" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
            <h6 className="my-1">Observaciones</h6>
            <textarea className="form-control" placeholder="Observaciones" value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
            {
                props.uso &&
                <div className="d-flex justify-content-end float-rigth mt-2">
                    <Boton onClick={onSaveMantenimiento} tooltip="Guardar Mantenimiento" name="Guardar" icon="save" color="green" disabled={validarForm()} />
                </div>
            }
        </>
    )

}

export default withRouter(Editar)