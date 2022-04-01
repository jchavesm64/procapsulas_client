/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification, SelectPicker, Loader, Input } from 'rsuite'
import Boton from '../shared/Boton'
import Action from '../shared/Action'
import { withRouter } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { SAVE_PUESTO_LIMPIEZA } from '../../services/PuestoLimpiezaService'
import { OBTENER_UBICACIONES } from '../../services/UbicacionService';

const NuevoPuesto = ({ ...props }) => {
    const [nombre, setNombre] = useState('')
    const [areas, setAreas] = useState([{ "nombre": "" }])
    const [ubicacion, setUbicacion] = useState('')
    const [codigo, setCodigo] = useState('')
    const [datos, setDatos] = useState(true)
    const [reload, setReload] = useState(false)
    const [insertar] = useMutation(SAVE_PUESTO_LIMPIEZA);
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

    const onSavePuestoLimpieza = async () => {
        try {
            const input = {
                nombre,
                ubicacion,
                codigo,
                areas,
                estado: 'ACTIVO'
            }
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarPuestoLimpieza;
            if (estado) {
                Notification['success']({
                    title: 'Insertar Puesto de Limpieza',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/puestos_limpieza`);
            } else {
                Notification['error']({
                    title: 'Insertar Puesto de Limpieza',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Puesto de Limpieza',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el puesto de limpieza"
            })
        }
    }

    const addCaracteritica = () => {
        areas.push({
            "nombre": ""
        })
        setReload(!reload)
    }

    const removeArea = (item) => {
        areas.splice(areas.indexOf(item), 1)
        setReload(!reload)
    }

    const addCaracteristicaNombre = (key, dato) => {
        let find = false
        areas.map(item => {
            if (item === key) {
                find = true
                item.nombre = dato
            }
        })
        if (!find) {
            areas.push({
                "nombre": dato
            })
        }
    }

    const FichaArea = ({ item }) => {
        return (
            <div className='row my-2'>
                <div className='col-md-11 float-left'>
                    <input className="form-control" type="text" placeholder={item.nombre} defaultValue={item.nombre} onChange={(e) => addCaracteristicaNombre(item, e.target.value)} />
                </div>
                <div className='col-md-1 float-left'>
                    <Action className="mb-1" onClick={() => removeArea(item)} tooltip={"Remover"} color={"red"} icon={"close"} size="xs" />
                </div>
            </div>
        )
    }

    const validarForm = () => {
        return !nombre || !ubicacion || !codigo || areas.length === 0
    }

    if (load_ubicaciones) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/puestos_limpieza`)} icon="arrow-left-line" tooltip="Ir a Puestos de Limpieza" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Registro de Puestos de Limpieza</h3>
            <h6>Nombre del Puesto</h6>
            <Input type="text" placeholder="Nombre del Puesto" value={nombre} onChange={(e) => setNombre(e)} />
            <div className="row">
                <div className="col-md-6 float-left">
                    <h6 className="my-1">Código del Puesto</h6>
                    <Input type="text" placeholder="Código del Puesto" value={codigo} onChange={(e) => setCodigo(e)} />
                </div>
                <div className="col-md-6">
                    <h6 className="my-1">Ubicación en Planta</h6>
                    <SelectPicker className="mx-auto w-100" size="md" placeholder="Ubicación en Planta" data={getUbicaciones()} onChange={(e) => setUbicacion(e)} searchable={true} />
                </div>
            </div>
            <div className="row border-bottom border-dark my-3">
                <div className="col-md-11 float-left">
                    <h5 className="mt-2">Areas a Atender</h5>
                </div>
                <div className="d-flex col-md-1 justify-content-end float-right">
                    <Action className="mb-1" onClick={() => { setDatos(!datos) }} tooltip={datos ? "Ocultar" : "Mostrar"} color={"cyan"} icon={datos ? "angle-up" : "angle-down"} size="xs" />
                </div>
            </div>
            {
                datos &&
                <>
                    <div className='my-4'>
                        {areas &&
                            areas.map(item => {
                                return (<FichaArea item={item} />)
                            })
                        }
                        <div className="d-flex col-md-12 justify-content-end float-right">
                            <Action className="mb-1" onClick={addCaracteritica} tooltip={"Agregar Area"} color={"green"} icon={"plus"} size="xs" />
                        </div>
                    </div>
                </>
            }
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={onSavePuestoLimpieza} tooltip="Guardar Puesto de Limpieza" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevoPuesto)