import React, { useState } from 'react'
import { Loader, Notification } from 'rsuite';
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_MOVIMIENTOS_INSUMO } from '../../../services/MovimientoInsumosResolver'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router';
import DataGrid from '../../shared/DataGrid';
import { Link } from 'react-router-dom';

const MovimientosInsumo = ({ ...props }) => {

    const { id } = props.match.params;

    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const { loading: load_movimiento, error: error_movimiento, data: data_movimiento } = useQuery(OBTENER_MOVIMIENTOS_INSUMO, { variables: { id: id }, pollInterval: 1000 })

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

    const getData = () => {
        if (data_movimiento) {
            return data_movimiento.obtenerMovimientosInsumo.filter((value, index) => {
                if (filter !== "" && modo !== "") {
                    return getFilteredByKey(modo, value, filter);
                }
                return value
            });
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
                <Boton name="Atras" onClick={e => props.history.push(`/insumos`)} icon="arrow-left-line" tooltip="Ir a Dispensado" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Movimientos del Insumo</h3>
            {data_movimiento.obtenerMovimientosInsumo.length > 0 &&
                <>
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
                        <DataGrid data={data} type="movimientos_insumo" displayLength={9} {...props} />
                    </div>
                </>
            }
            {data_movimiento.obtenerMovimientosInsumo.length === 0 &&
                <>
                    <hr />
                    <h4 className="text-center">No existe movimientos</h4>
                </>
            }
            <Link to={`/movimientos_insumo/nuevo/${id}`} ><Boton className="my-2" color="green" tooltip="Agregar Entrada" icon="plus" name="Agregar Entrada" /></Link>
        </>
    )

}

export default withRouter(MovimientosInsumo)

