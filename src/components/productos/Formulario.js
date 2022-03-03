import React, { useState } from 'react'
import { useMutation, useQuery } from "@apollo/react-hooks";
import { UPDATE_PRODUCTO } from '../../services/ProductoService'
import { Notification, SelectPicker, InputPicker, Loader } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router';
import { OBTENER_ORDENES } from '../../services/CotizacionService'

const FormularioProducto = ({ props, producto }) => {

    const [nombre, setNombre] = useState(producto.nombre);
    const [orden, setOrden] = useState(producto.orden_produccion.id);
    const [unidad, setUnidad] = useState(producto.unidad)
    const [actualizar] = useMutation(UPDATE_PRODUCTO);
    const { loading: load_ordenes, error: error_ordenes, data: data_ordenes } = useQuery(OBTENER_ORDENES, { pollInterval: 1000 })


    React.useEffect(() => {
        setNombre(producto.nombre)
        setOrden(producto.orden_produccion.id)
        setUnidad(producto.unidad)
    }, [producto])

    const getOrdenes = () => {
        const ordenes = []
        console.log(data_ordenes)
        data_ordenes.obtenerCotizaciones2.map(item => {
            ordenes.push({
                "label": item.formula.nombre + " - " + item.cliente.nombre + " - " + item.presentacion.tipo,
                "value": item.id
            })
        })
        return ordenes
    }

    const onSaveProducto = async () => {
        try {
            const input = {
                nombre,
                unidad: unidad,
                existencias: 0,
                orden_produccion: orden,
                estado: 'ACTIVO'
            }
            const { data } = await actualizar({ variables: { id: producto.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarProducto;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Producto',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/productos`);
            } else {
                Notification['error']({
                    title: 'Actualizar Producto',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Actualizar Producto',
                duration: 5000,
                description: "Hubo un error inesperado al guardar el producto"
            })
        }
    }

    const validarForm = () => {
        return !nombre || !orden || !unidad;
    }

    if (load_ordenes) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_ordenes) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de cotizaciones, verificar tu conexión a internet'
        })
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/productos`)} icon="arrow-left-line" tooltip="Ir a Productos" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Editar Producto</h3>
            <h6>Nombre del Producto</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre del Producto" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="row">
                <div className="col-md-6 float-left">                    <h6>Ordenes de Producción</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Ordenes de Producción" defaultValue={orden} data={getOrdenes()} onChange={(e) => setOrden(e)} searchable={true} />
                </div>
                <div className="col-md-6 mt-2">
                    <h6 className="my-1">Unidad Métrica</h6>
                    <InputPicker className="w-100" data={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }, { label: 'Unidades', value: 'Unidades' }]} placeholder="Unidad Métrica" value={unidad} onChange={(e) => setUnidad(e)} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveProducto} tooltip="Guardar Producto" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(FormularioProducto)
