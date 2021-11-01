/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import { Notification, SelectPicker, InputPicker } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router-dom'
import { useMutation } from '@apollo/react-hooks'
import { SAVE_MATERIA_PRIMA } from '../../services/MateriaPrimaService'
import { countries } from '../../Json/countries.json'

const NuevaMateriaPrima = ({ ...props }) => {
    const [nombre, setNombre] = useState('');
    const [pais, setPais] = useState('');
    const [insertar] = useMutation(SAVE_MATERIA_PRIMA);
    const [unidad, setUnidad] = useState('')

    console.log(props.history)

    const getPaises = () => {
        const paises = []
        countries.map(p => {
            paises.push({
                "label": p.name,
                "value": p
            })
        });
        return paises;
    }

    const onSaveMateriaPrima = async () => {
        try {
            const input = {
                nombre,
                pais: pais.name,
                unidad: unidad,
                existencias: 0,
                estado: 'ACTIVO'
            }
            console.log(input)
            const { data } = await insertar({ variables: { input }, errorPolicy: 'all' });
            const { estado, message } = data.insertarMateriaPrima;
            if (estado) {
                Notification['success']({
                    title: 'Insertar Materia Prima',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/materias_primas`);
            } else {
                Notification['error']({
                    title: 'Insertar Materia Prima',
                    duration: 5000,
                    description: message
                })
            }
        } catch (error) {
            console.log(error)
            Notification['error']({
                title: 'Insertar Materia Prima',
                duration: 5000,
                description: "Hubo un error inesperado al guardar la materia prima"
            })
        }
    }

    const validarForm = () => {
        return !nombre || !pais || !unidad;
    }

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Registro de Materias Primas</h3>
            <h6>Nombre de la Materia Prima</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre de la Materia Prima" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="row">
                <div className="col-md-6 float-left">
                    <h6>País de Origen</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="País de Origen" data={getPaises()} onChange={(e) => setPais(e)} searchable={true} />
                </div>
                <div className="col-md-6 mt-2">
                    <h6 className="my-1">Unidad Métrica</h6>
                    <InputPicker className="w-100" data={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }]} placeholder="Unidad Métrica" value={unidad} onChange={(e) => setUnidad(e)} />
                </div>
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMateriaPrima} tooltip="Guardar Entrada" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    )
}

export default withRouter(NuevaMateriaPrima)