/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification, Loader, SelectPicker } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { UPDATE_SELECION } from '../../services/SeleccionService'
import { OBTENER_PRODUCTOS_2 } from '../../services/ProductoService';

const EditarSeleccion = ({props, seleccion}) => {
    const [producto, setProducto] = useState(seleccion.producto.id);
    const { loading: load_productos, error: error_productos, data: data_productos } = useQuery(OBTENER_PRODUCTOS_2, { pollInterval: 1000 })
    const [actualizar] = useMutation(UPDATE_SELECION);

    React.useEffect(() => {
        setProducto(seleccion.producto.id)
    }, [seleccion])

    const getProductos = () => {
        const ordenes = []
        data_productos.obtenerProductos.map(item => {
            ordenes.push({
                "label": item.nombre,
                "value": item.id
            })
        })
        return ordenes
    }

    const onSaveSeleccion = async () => {
        try {
            const input = {
                producto,
                estado: 'ACTIVO'
            }
            const { data } = await actualizar({ variables: { id: seleccion.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarSeleccion;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Selección',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/seleccion`);
            } else {
                Notification['error']({
                    title: 'Actualizar Selección',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Actualizar Selección',
                duration: 5000,
                description: "Hubo un error inesperado al guardar la selección"
            })
        }
    }

    const validarForm = () => {
        return !producto
    }

    if (load_productos) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_productos) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de productos, verificar tu conexión a internet'
        })
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/seleccion`)} icon="arrow-left-line" tooltip="Ir a Selección" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Editar Selección</h3>
            <h6>Producto</h6>
            <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Productos" value={producto} data={getProductos()} onChange={(e) => setProducto(e)} searchable={true} />
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveSeleccion} tooltip="Guardar Selección" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(EditarSeleccion)