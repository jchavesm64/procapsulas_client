import React, { useState } from 'react'
import { Loader, Notification } from 'rsuite';
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_MOVIMIENTOS_SELECCION } from '../../../services/MovimientoSeleccionService'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router';
import DataGrid from '../../shared/DataGrid';
import { Link } from 'react-router-dom';

const MovimientosSeleccion = ({ ...props }) => {

    const { id, nombre } = props.match.params;

    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const { loading: load_movimiento, error: error_movimiento, data: data_movimiento } = useQuery(OBTENER_MOVIMIENTOS_SELECCION, { variables: { id: id }, pollInterval: 1000 })

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.tipo.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            const val = key.usuario.nombre.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        }
        return null;
    }

    const transformarData = (data) => {
        let newData = [], auxMov = []
        var exi = 0
        data.map(item1 => {
            if (item1.tipo === 'ENTRADA') {
                data.map(item2 => {
                    if (item2.tipo === 'SALIDA' && item2.lote === item1.lote) {
                        exi += item2.cantidad
                    }
                })
                newData.push({
                    id: item1.id,
                    lote: item1.lote,
                    fecha: item1.fecha,
                    cantidad: item1.cantidad,
                    usuario: item1.usuario,
                    seleccion: item1.seleccion,
                    tipo: item1.tipo,
                    existencias: item1.cantidad - exi
                })
            } else {
                newData.push({
                    id: item1.id,
                    lote: item1.lote,
                    fecha: item1.fecha,
                    cantidad: item1.cantidad,
                    usuario: item1.usuario,
                    seleccion: item1.seleccion,
                    tipo: item1.tipo,
                    existencias: item1.cantidad - exi
                })
            }
        })
        return newData
    }

    const getData = () => {
        if (data_movimiento) {
            console.log(data_movimiento)
            if (data_movimiento.obtenerMovimientosSeleccion) {
                const data = transformarData(data_movimiento.obtenerMovimientosSeleccion)
                return data.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    if (load_movimiento) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_movimiento) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de movimientos, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/seleccion`)} icon="arrow-left-line" tooltip="Ir a Productos" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Movimientos de Selección</h3>
            {data_movimiento.obtenerMovimientosSeleccion.length > 0 &&
                <>
                    <h5 className="text-center">{nombre}</h5>
                    <div className="input-group mt-3 mb-3">
                        <div>
                            <select id="select_modo" className="rounded-0 btn btn-outline-secondary dropdown-toggle" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                                <option value="1"> Tipo de Movimiento</option>
                                <option value="2"> Nombre del Usuario</option>
                            </select>
                        </div>
                        <input id="filter" type="text" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                    <div className="mt-3">
                        <DataGrid data={data} type="movimientos_seleccion" displayLength={9} {...props} />
                    </div>
                </>
            }
            {data_movimiento.obtenerMovimientosSeleccion.length === 0 &&
                <>
                    <hr />
                    <h4 className="text-center">No existe movimientos</h4>
                </>
            }
            <Link to={`/movimiento_seleccion/nuevo/${id}`} ><Boton className="my-2" color="green" tooltip="Agregar Entrada" icon="plus" name="Agregar Entrada" /></Link>
        </>
    )

}

export default withRouter(MovimientosSeleccion)

