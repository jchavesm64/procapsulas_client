/* eslint-disable array-callback-return */
import React, { useState, useEffect } from 'react'
import { useMutation } from "@apollo/react-hooks";
import { withRouter } from 'react-router-dom';
import { Notification, Input, InputPicker } from 'rsuite'
import Boton from '../shared/Boton'
import { UPDATE_ACTIVO } from '../../services/ActivosService'

const FormularioActivo = ({ props, activo }) => {
    const [numero, setNumero] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [modelo, setModelo] = useState('')
    const [serie, setSerie] = useState('')
    const [fecha_ingreso, setFechaIngreso] = useState('')
    const [fecha_etiquetado, setFechaEtiquetado] = useState('')
    const [fecha_desecho, setFechaDesecho] = useState('')
    const [estatus, setEstatus] = useState('')
    const [actualizar] = useMutation(UPDATE_ACTIVO);

    useEffect(() => {
        setNumero(activo.numero)
        setDescripcion(activo.descripcion)
        setModelo(activo.modelo)
        setSerie(activo.serie)
        setFechaIngreso(activo.fecha_ingreso)
        setFechaEtiquetado(activo.fecha_etiquetado)
        setFechaDesecho(activo.fecha_desecho)
        setEstatus(activo.estado)
    }, [activo])

    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + '-' + mes + '-' + day;
    }

    const getEstados = () => {
        const datos = []
        if (activo.estado === 'Nuevo') {
            datos.push({ "value": "Nuevo", "label": "Nuevo" }, { "value": "Desechado", "label": "Desechado" }, { "value": "En Buen Estado", "label": "En Buen Estado" })
        } else {
            datos.push({ "value": "Desechado", "label": "Desechado" }, { "value": "En Buen Estado", "label": "En Buen Estado" })
        }
        return datos
    }

    const onSaveActivo = async () => {
        try {
            let seguir = false
            seguir = (fecha_desecho) ? (fecha_ingreso < fecha_etiquetado < fecha_desecho) : (fecha_ingreso < fecha_etiquetado)
            if (seguir) {
                const input = {
                    numero,
                    descripcion,
                    modelo,
                    serie,
                    fecha_etiquetado,
                    fecha_ingreso,
                    fecha_desecho,
                    estado: estatus,
                    state: activo.state
                }
                const { data } = await actualizar({ variables: { id: activo.id, input }, errorPolicy: 'all' });
                console.log(data)
                const { estado, message } = data.actualizarActivo;
                if (estado) {
                    Notification['success']({
                        title: 'Actualizar Activo',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/activos`);
                } else {
                    Notification['error']({
                        title: 'Actualizar Activo',
                        duration: 5000,
                        description: message
                    })
                }
            } else {
                Notification['warning']({
                    title: 'Insertar Activo',
                    duration: 5000,
                    description: "El orden de fechas debe ser Fecha de Ingreso, Fecha de Etiquetado y Fecha de Desechos"
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Actualizar Activo',
                duration: 5000,
                description: "Hubo un error inesperado al actualizar el activo"
            })
        }
    }

    const validarForm = () => {
        return !numero || !descripcion || !modelo || !serie || !fecha_ingreso || !fecha_etiquetado
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/activos`)} icon="arrow-left-line" tooltip="Ir a Activos" size="xs" color="blue" />
                <h3 className="text-center">Actualizar Activo</h3>
                <div className="row">
                    <div className="col-md-6 float-left mt-2">
                        <h6 className="my-3">Número del Activo</h6>
                        <Input type="numero" placeholder={"Número del Activo"} value={numero} onChange={(e) => setNumero(e)} />
                        <h6 className="my-3">Serie del Activo</h6>
                        <Input type="text" placeholder={"Serie del Activo"} value={serie} onChange={(e) => setSerie(e)} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <h6 className="my-3">Modelo del Activo</h6>
                        <Input type="text" placeholder={"Modelo del Activo"} value={modelo} onChange={(e) => setModelo(e)} />
                        <h6 className="my-3">Estado del Activo</h6>
                        <InputPicker className='w-100' placeholder="Estado del Activo" value={estatus} data={getEstados()} onChange={(e) => setEstatus(e)} />
                    </div>
                </div>
                <h6 className="my-3">Descripción del Activo</h6>
                <Input componentClass="textarea" rows={3} placeholder={"Descripción"} value={descripcion} onChange={(e) => setDescripcion(e)} style={{ height: '120px', minHeight: '120px' }} />
                <div className="row">
                    <div className="col-md-6 float-left mt-2">
                        <h6 className="my-3">Fecha de Ingreso</h6>
                        <Input type="date" placeholder={"Fecha de Ingreso"} value={getFecha(fecha_ingreso)} onChange={(e) => setFechaIngreso(e)} />
                        <h6 className="my-3">Fecha de Etiquetado</h6>
                        <Input type="date" placeholder={"Fecha de Etiquetado"} value={getFecha(fecha_etiquetado)} onChange={(e) => setFechaEtiquetado(e)} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <h6 className="my-3">Fecha de Desecho</h6>
                        <Input type="date" placeholder={"Fecha de Desecho"} value={getFecha(fecha_desecho)} onChange={(e) => setFechaDesecho(e)} />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={onSaveActivo} tooltip="Guardar Activo" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(FormularioActivo)