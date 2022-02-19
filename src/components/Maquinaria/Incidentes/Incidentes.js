import React, { useState } from 'react'
import { Loader, Notification } from 'rsuite';
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_INCIDENTES } from '../../../services/IncidenteService'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router';
import DataGrid from '../../shared/DataGrid';
import { Link } from 'react-router-dom';

const Incidentes = ({ ...props }) => {
    const { id, nombre } = props.match.params;
    const [filter, setFilter] = useState('')
    const [modo, setModo] = useState('1')
    const { loading: load_incidentes, error: error_incidente, data: data_incidentes } = useQuery(OBTENER_INCIDENTES, { variables: { id: id }, pollInterval: 1000 })

    function getFilteredByKey(modo, key, value) {
        if (modo === "1") {
            const val = key.ubicacion.toLowerCase();
            const val2 = value.toLowerCase();
            console.log(val, val2, val.includes(val2));
            if (val.includes(val2)) {
                return key
            }
        } else if (modo === "2") {
            if (key.fecha <= value) {
                return key
            }
        }
        return null;
    }

    const getData = () => {
        if (data_incidentes) {
            console.log(data_incidentes)
            if (data_incidentes.obtenerIncidentes) {
                return data_incidentes.obtenerIncidentes.filter((value, index) => {
                    if (filter !== "" && modo !== "") {
                        return getFilteredByKey(modo, value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    if (load_incidentes) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_incidente) {
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
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Incidentes de la Máquina</h3>
            {data_incidentes.obtenerIncidentes.length > 0 &&
                <>
                    <h5 className="text-center">{nombre}</h5>
                    <div className="input-group mt-3 mb-3">
                        <div>
                            <select id="select_modo" className="rounded-0 btn btn-outline-secondary dropdown-toggle" onChange={(e) => setModo(e.target.options[e.target.selectedIndex].value)}>
                                <option value="1"> Ubicacion</option>
                                <option value="2"> Fecha</option>
                            </select>
                        </div>
                        <input id="filter" type={modo === "1" ? "text" : "date"} className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                    <div className="mt-3">
                        <DataGrid data={data} type="incidente" displayLength={9} {...props} />
                    </div>
                </>
            }
            {data_incidentes.obtenerIncidentes.length === 0 &&
                <>
                    <hr />
                    <h4 className="text-center">No existe movimientos</h4>
                </>
            }
            <Link to={`/incidentes/nuevo/${id}`} ><Boton className="my-2" color="green" tooltip="Registrar Incidente" icon="plus" name="Registrar Incidente" /></Link>
        </>
    )
}

export default withRouter(Incidentes)