/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification, Input } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_ACTIVO } from '../../services/ActivosService'

const NuevoActivo = ({ ...props }) => {
    const [numero, setNumero] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [modelo, setModelo] = useState('')
    const [serie, setSerie] = useState('')
    const [fecha_ingreso, setFechaIngreso] = useState('')
    const [fecha_etiquetado, setFechaEtiquetado] = useState('')
    const [fecha_desecho, setFechaDesecho] = useState('')
    const [insertar] = useMutation(SAVE_ACTIVO);

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
                    estado: "Nuevo",
                    state: "ACTIVO"
                }
                const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                console.log(data)
                const { estado, message } = data.insertarActivo;
                if (estado) {
                    Notification['success']({
                        title: 'Insertar Activo',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/activos`);
                } else {
                    Notification['error']({
                        title: 'Insertar Activo',
                        duration: 5000,
                        description: message
                    })
                }
            }else{
                Notification['warning']({
                    title: 'Insertar Activo',
                    duration: 5000,
                    description: "El orden de fechas debe ser Fecha de Ingreso, Fecha de Etiquetado y Fecha de Desechos"
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Activo',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el activo"
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
                <h3 className="text-center">Registrar Activo</h3>
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
                    </div>
                </div>
                <h6 className="my-3">Descripción del Activo</h6>
                <Input componentClass="textarea" rows={3} placeholder={"Descripción"} value={descripcion} onChange={(e) => setDescripcion(e)} style={{ height: '120px', minHeight: '120px' }} />
                <div className="row">
                    <div className="col-md-6 float-left mt-2">
                        <h6 className="my-3">Fecha de Ingreso</h6>
                        <Input type="date" placeholder={"Fecha de Ingreso"} value={fecha_ingreso} onChange={(e) => setFechaIngreso(e)} />
                        <h6 className="my-3">Fecha de Etiquetado</h6>
                        <Input type="date" placeholder={"Fecha de Etiquetado"} value={fecha_etiquetado} onChange={(e) => setFechaEtiquetado(e)} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <h6 className="my-3">Fecha de Desecho</h6>
                        <Input type="date" placeholder={"Fecha de Desecho"} value={fecha_desecho} onChange={(e) => setFechaDesecho(e)} />
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={onSaveActivo} tooltip="Guardar Activo" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )

}

export default withRouter(NuevoActivo)