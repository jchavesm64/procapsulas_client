/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Loader, Notification, Input } from 'rsuite'
import Boton from "../../shared/Boton";
import Label from '../../shared/Label';
import { useQuery } from "@apollo/react-hooks";
import { OBTENER_CHEQUEO } from '../../../services/ChequeoService'
import { OBTENER_PUESTO_LIMPIEZA } from "../../../services/PuestoLimpiezaService";
import Chequeo from './Chequeo';


const ManagerChequeo = ({ ...props }) => {
    const fecha = new Date().toLocaleString().split(' ')[0].split('/')
    const [date] = useState(fecha[2] + '-' + (fecha[1] < 10 ? ('0' + fecha[1]) : fecha[1]) + '-' + fecha[0])
    const id = localStorage.getItem('id_vincular_puesto')
    const { loading: load_chequeo, error: error_chequeo, data: datos_chequeo } = useQuery(OBTENER_CHEQUEO, { variables: { id: id, fecha: date }, pollInterval: 1000 });
    const { loading, error, data } = useQuery(OBTENER_PUESTO_LIMPIEZA, { variables: { id: id }, pollInterval: 1000 });

    const desvincularDispositivo = () => {
        localStorage.removeItem('id_vincular_puesto')
        window.location.href = "/"
    }

    if (load_chequeo || loading) {
        return (<Loader backdrop content="Cargando..." vertical size="lg" />);
    }
    if (error_chequeo) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion del chequeo de hoy"
        })
    }
    if (error) {
        Notification['error']({
            title: "Error",
            duration: 20000,
            description: "Error al obtener la informacion del puesto de limpieza"
        })
    }

    return (
        <div className="container bg-white rounded-1 shadow-lg p-5">
            <div>
                <Boton name="Desvincular Dispositivo" onClick={() => desvincularDispositivo()} icon="fas fa-unlink" tooltip="Desvincular Dispositivo" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Chequeo de Área</h3>
            <h5>Fecha de Hoy</h5>
            <Label icon="fas fa-calendar" value={fecha[2] + '-' + (fecha[1] < 10 ? ('0' + fecha[1]) : fecha[1]) + '-' + fecha[0]} />
            <Chequeo date={date} info={datos_chequeo} props={props} puesto={data} />
        </div>
    )

}

export default withRouter(ManagerChequeo);