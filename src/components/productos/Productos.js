import React, { useState } from 'react'
import { withRouter } from 'react-router'
import Boton from '../shared/Boton'
import Confirmation from '../shared/Confirmation';
import { Loader, Notification } from 'rsuite';
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { OBTENER_PRODUCTOS_MOVIMIENTOS, DELETE_PRODUCTO } from '../../services/ProductoService'
import DataGrid from '../shared/DataGrid'

const Productos = ({ ...props}) => {
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const [confimation, setConfirmation] = useState(false);
    const { loading: load_productos, error: error_producto, data: data_producto } = useQuery(OBTENER_PRODUCTOS_MOVIMIENTOS, { pollInterval: 1000 })
    const [desactivar] = useMutation(DELETE_PRODUCTO);

    const onDeleteProducto = async (id) => {
        const { data } = await desactivar({ variables: { id } });
        const { estado, message } = data.desactivarProducto;
        if (estado) {
            Notification['success']({
                title: 'Eliminar Producto',
                duration: 20000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Eliminar Producto',
                duration: 20000,
                description: message
            })
        }
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="¿Estás seguro/a de eliminar?"
            onDeletObjeto={onDeleteProducto}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.producto.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            const val = key.producto.orden_produccion.formula.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if(data_producto){
            if(data_producto.obtenerProductosConMovimientos){
                return data_producto.obtenerProductosConMovimientos.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    const mostrarMsj = () => {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'No tienes el rol necesario para realizar esta acción.'
        })
    }

    if (load_productos) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_producto) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de productos, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <h3 className="text-center">Gestión de Productos</h3>
            <div className="row" style={{ margin: 0, padding: 0 }}>
                <div style={{ padding: 0 }} className="col-md-3">
                    <select id="select_modo" className="h-100 rounded-0 btn btn-outline-secondary dropdown-toggle w-100" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                        <option value="1"> Producto</option>
                        <option value="2"> Fórmula</option>
                    </select>
                </div>
                <div style={{ padding: 0 }} className="col-md-9 h-100">
                    <div className="input-group">
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <DataGrid data={data} setConfirmation={setConfirmation} mostrarMsj={mostrarMsj} type="producto" displayLength={9} {...props} />
            </div>
            <div className="d-flex justify-content-start my-2">
                <Link to={`/productos/nuevo`}><Boton tooltip="Nuevo Productos" name="Nuevo" icon="plus" color="green" /></Link>
            </div>
            {isConfirmation}
        </>
    )
}

export default withRouter(Productos)