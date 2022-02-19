import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { Input, Notification, SelectPicker, Loader } from 'rsuite'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { SAVE_INCIDENTE } from '../../../services/IncidenteService';
import { OBTENER_UBICACIONES } from '../../../services/UbicacionService';
import Boton from '../../shared/Boton';

const NuevoIncidente = ({ ...props }) => {
    const { id } = props.match.params;
    const [descripcion, setDescripcion] = useState('')
    const [fecha, setFecha] = useState('')
    const [ubicacion, setUbicacion] = useState('')
    const [causa, setCausa] = useState('')
    const [insertar] = useMutation(SAVE_INCIDENTE);
    const { loading: load_ubicaciones, data: data_ubicaciones } = useQuery(OBTENER_UBICACIONES, { pollInterval: 1000 })

    const getUbicaciones = () => {
        const ubicaciones = []
        if (data_ubicaciones) {
            data_ubicaciones.obtenerUbicaciones.map(item => {
                ubicaciones.push({
                    "label": item.nombre,
                    "value": item.id
                })
            })
        }
        return ubicaciones
    }

    const onSaveIncidente = async () => {
        var date = new Date();
        var f = date.getFullYear() + "-" + (((date.getMonth() + 1) < 10) ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1)) + '-' + ((date.getDate() < 10) ? ('0' + date.getDate()) : date.getDate());
        if (fecha <= f) {
            const input = {
                maquina: id,
                descripcion,
                fecha,
                ubicacion,
                causa,
                estado: 'Registrado'
            }
            console.log(input)
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarIncidente;
            if (estado) {
                Notification['success']({
                    title: 'Registrar Incidente',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/maquinaria`);
            } else {
                Notification['error']({
                    title: 'Registrar Incidente',
                    duration: 5000,
                    description: message
                })
            }
        } else {
            Notification['warning']({
                title: 'Registrar Incidente',
                duration: 20000,
                description: "La fecha del incidente debe ser hoy o anterior a hoy"
            })
        }
    }

    const validarForm = () => {
        return !descripcion || !fecha || !ubicacion
    }

    if (load_ubicaciones) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Ingresar Incidente</h3>
            <div className="row my-1">
                <div className="col-md-6">
                    <h6 className="my-1">Fecha del Incidente</h6>
                    <Input type="datetime-local" placeholder="Fecha del Incidente" value={fecha} onChange={(e) => setFecha(e)} />
                    <h6 className="my-1">Descripción</h6>
                    <textarea className="form-control" placeholder="Descripción" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Ubicación en Planta</h6>
                    <SelectPicker className="mx-auto w-100" size="md" placeholder="Ubicación en Planta" data={getUbicaciones()} onChange={(e) => setUbicacion(e)} searchable={true} />
                    <h6 className="my-1">Causa</h6>
                    <textarea className="form-control" placeholder="Causa" value={causa} onChange={(e) => setCausa(e.target.value)} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveIncidente} tooltip="Guardar Incidente" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevoIncidente)