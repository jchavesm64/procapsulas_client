import React, { useState } from 'react'
import { Loader, Notification } from 'rsuite';
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_MANTENIMIENTOS } from '../../../services/MantenimientoService'
import Boton from '../../shared/Boton'
import { withRouter } from 'react-router';
import DataGrid from '../../shared/DataGrid';
import { Link } from 'react-router-dom';
import Label from '../../shared/Label';

const Mantenimientos = ({ ...props }) => {
    const { id, nombre } = props.match.params;
    const [filter, setFilter] = useState('')
    const { loading: load_mantenimientos, error: error_mantenimientos, data: data_mantenimientos } = useQuery(OBTENER_MANTENIMIENTOS, { variables: { id: id }, pollInterval: 1000 })

    function getFilteredByKey(key, value) {
        if (key.fecha_mantenimiento <= value) {
            return key
        }
        return null;
    }

    const getData = () => {
        if (data_mantenimientos) {
            if (data_mantenimientos.obtenerMantenimientos) {
                return data_mantenimientos.obtenerMantenimientos.filter((value, index) => {
                    if (filter !== "") {
                        return getFilteredByKey(value, filter);
                    }
                    return value
                });
            }
        }
        return []
    }

    if (load_mantenimientos) return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    if (error_mantenimientos) {
        Notification['error']({
            title: 'Error',
            duration: 20000,
            description: 'Error, no podemos obtener la información de mantenimientos, verificar tu conexión a internet'
        })
    }

    const data = getData();

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/maquinaria`)} icon="arrow-left-line" tooltip="Ir a Maquinaria" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Mantenimientos de la Máquina</h3>
            {data_mantenimientos.obtenerMantenimientos.length > 0 &&
                <>
                    <h5 className="text-center">{nombre}</h5>
                    <div className="input-group mt-3 mb-3">
                        <span className="text-center pt-2 px-1 text-dark bg-white border border-ligth"><strong style={{fontSize: '15px'}}>Fecha del Mantenimiento</strong></span>
                        <input id="filter" type="date" className="rounded-0 form-control" onChange={(e) => { if (e.target.value === "") setFilter(e.target.value); }} />
                        <Boton className="rounded-0" icon="search" color="green" onClick={() => setFilter(document.getElementById('filter').value)} tooltip="Filtrado automatico" />
                    </div>
                    <div className="mt-3">
                        <DataGrid data={data} type="mantenimiento" displayLength={9} {...props} />
                    </div>
                </>
            }
            {data_mantenimientos.obtenerMantenimientos.length === 0 &&
                <>
                    <hr />
                    <h4 className="text-center">No existe movimientos</h4>
                </>
            }
            <Link to={`/mantenimientos/nuevo/${id}`} ><Boton className="my-2" color="green" tooltip="Registrar Mantenimiento" icon="plus" name="Registrar Mantenimiento" /></Link>
        </>
    )
}

export default withRouter(Mantenimientos)