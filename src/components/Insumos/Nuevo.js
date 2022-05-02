/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification, Input, Loader, InputPicker } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { SAVE_INSUMO } from '../../services/InsumosService'
import { OBTENER_UBICACIONES } from '../../services/UbicacionService'

const NuevoInsumo = ({ ...props }) => {
    const [descripcion, setDescripcion] = useState('')
    const [codigo, setCodigo] = useState('')
    const [area, setArea] = useState('')
    const [cantidad_limite, setCantidadLimite] = useState(1)
    const [insertar] = useMutation(SAVE_INSUMO);
    const { loading: load_ubicaciones, error: error_ubicaciones, data: data_ubicaciones } = useQuery(OBTENER_UBICACIONES, { pollInterval: 1000 })

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

    const onSaveInsumo = async () => {
        try {
            if (cantidad_limite > 0) {
                const input = {
                    descripcion,
                    codigo,
                    cantidad_limite,
                    area,
                    estado: "ACTIVO"
                }
                const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
                console.log(data)
                const { estado, message } = data.insertarInsumo;
                if (estado) {
                    Notification['success']({
                        title: 'Insertar Insumo',
                        duration: 5000,
                        description: message
                    })
                    props.history.push(`/insumos`);
                } else {
                    Notification['error']({
                        title: 'Insertar Insumo',
                        duration: 5000,
                        description: message
                    })
                }
            } else {
                Notification['warning']({
                    title: 'Insertar Insumo',
                    duration: 5000,
                    description: "La cantidad limite en stock debe ser mayor a cer"
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Insumo',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el activo"
            })
        }
    }

    const validarForm = () => {
        return !descripcion || !codigo || !area
    }

    if (load_ubicaciones) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_ubicaciones) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de productos, verificar tu conexión a internet'
        })
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/insumos`)} icon="arrow-left-line" tooltip="Ir a Insumos" size="xs" color="blue" />
                <h3 className="text-center">Registrar Insumo</h3>
                <div className="row">
                    <div className="col-md-6 float-left mt-2">
                        <h6 className="my-3">Código del Insumo</h6>
                        <Input type="text" placeholder={"Código del Insumo"} value={codigo} onChange={(e) => setCodigo(e)} />
                        <h6 className="my-3">Cantidad Limite en Stock</h6>
                        <Input type="number" placeholder={"Cantidad Limite en Stock"} value={cantidad_limite} onChange={(e) => setCantidadLimite(e)} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <h6 className="my-3">Area de uso</h6>
                        <InputPicker className='w-100' type="text" placeholder={"Area de uso"} value={area} data={getUbicaciones()} onChange={(e) => setArea(e)} />
                    </div>
                </div>
                <h6 className="my-3">Descripción del Insumo</h6>
                <Input componentClass="textarea" rows={3} placeholder={"Descripción"} value={descripcion} onChange={(e) => setDescripcion(e)} style={{ height: '120px', minHeight: '120px' }} />
            </div>
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={onSaveInsumo} tooltip="Guardar Insumo" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )

}

export default withRouter(NuevoInsumo)