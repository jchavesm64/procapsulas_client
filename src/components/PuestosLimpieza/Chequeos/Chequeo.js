/* eslint-disable array-callback-return */
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import Boton from "../../shared/Boton";
import Confirmation from '../../shared/Confirmation';
import { Notification, Checkbox } from 'rsuite'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_CHEQUEO } from '../../../services/ChequeoService'

const Chequeo = ({ props, info, date, puesto }) => {

    const obtenerAreas = () => {
        let areas = []
        const { chequeo, estado } = info.obtenerChequeo;
        if (estado === 1) {
            areas = chequeo.areas
        } else if (estado === 2) {
            const pl = puesto.obtenerPuestoLimpieza
            pl.areas.map(item => {
                areas.push({ area: item.nombre, estado: false })
            })
        } else {
            Notification['error']({
                title: "Error",
                duration: 20000,
                description: "Error al obtener la informacion del chequeo de hoy"
            })
        }
        return areas
    }

    const id = localStorage.getItem('id_vincular_puesto')
    const [datos, setDatos] = useState({ areas: obtenerAreas(), procesado: false });
    const [refresh, setRefresh] = useState(false)
    const [confimation, setConfirmation] = useState(false);
    const [insertar] = useMutation(SAVE_CHEQUEO);

    const cambiarEstado = (index) => {
        const area = datos.areas[index]
        const new_area = {
            area: area.area,
            estado: true
        }
        datos.areas[index] = new_area
        setRefresh(!refresh)
    }

    const isConfirmation = (confimation.bool) ?
        <Confirmation
            message="Si marca esta área, no podra desmarcarla después"
            onDeletObjeto={cambiarEstado}
            setConfirmation={setConfirmation}
            idDelete={confimation.id}
        />
        : ""

    const AreaChequeo = ({ area, index }) => {
        return (
            <div className={`p-2 m-2 shadow-lg rounded-3`} style={{ minWidth: '300px', width: '300px', maxWidth: '300px', backgroundColor: area.estado ? "#6de069" : "white" }}>
                <h4 className="text-center">{area.area}</h4>
                <Checkbox checked={area.estado} onChange={!area.estado ? () => setConfirmation({ bool: true, id: index }) : () => { }}><label style={{ fontSize: '16pt', marginTop: '-5px' }} >Área Chequeada</label></Checkbox>
            </div>
        )
    }

    const guardarChequeo = async () => {
        const { session } = props
        const input = {
            puesto_limpieza: id,
            areas: datos.areas,
            fecha: date,
            aprobado: false,
            usuario: session.id
        }
        const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
        const { estado, message } = data.insertarChequeo;
        if (estado) {
            Notification['success']({
                title: 'Registrar Chequeo',
                duration: 5000,
                description: message
            })
        } else {
            Notification['error']({
                title: 'Registrar Chequeo',
                duration: 5000,
                description: message
            })
        }
    }

    const validarForm = () => {
        return datos.areas.length === 0
    }

    console.log(datos)

    return (
        <div className="container">
            <div className="d-flex flex-wrap justify-content-center col-xs mt-5">
                {
                    datos.areas.map((item, index) => {
                        return (<AreaChequeo area={item} index={index} />)
                    })
                }
            </div>
            <div className="d-flex justify-content-end float-rigth mt-3">
                <Boton onClick={guardarChequeo} tooltip="Guardar Chequeo" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
            {isConfirmation}
        </div>
    )

}

export default withRouter(Chequeo)