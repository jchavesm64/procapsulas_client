import React, { useState } from 'react'
import { useQuery, useMutation } from "@apollo/react-hooks";
import { countries } from '../../Json/countries.json'
import { UPDATE_MATERIA_PRIMA } from '../../services/MateriaPrimaService'
import { Notification, SelectPicker, Loader, InputPicker, Checkbox, RadioGroup, Radio } from 'rsuite'
import Boton from '../shared/Boton'
import { withRouter } from 'react-router';
import { OBTENER_PROVEEDORES } from '../../services/ProveedorService'

const FormularioMateriaPrima = ({ props, materia }) => {
    const getPais = (pais) => {
        var country = null
        countries.map(p => {
            if (p.name === pais) {
                country = p
            }
        })
        return country;
    }

    const [nombre, setNombre] = useState(materia.nombre);
    const [proveedor, setProveedor] = useState(materia.proveedor.id);
    const [pais, setPais] = useState(getPais(materia.pais));
    const [unidad, setUnidad] = useState(materia.unidad)
    const [actualizar] = useMutation(UPDATE_MATERIA_PRIMA);
    const { loading: load_prov, data: data_prov } = useQuery(OBTENER_PROVEEDORES, { pollInterval: 1000 });

    React.useEffect(() => {
        setNombre(materia.nombre)
        setProveedor(materia.proveedor.id)
        setPais(getPais(materia.pais))
        setUnidad(materia.unidad)
    }, [materia])

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

    const getProveedores = () => {
        const datos = []
        if (data_prov.obtenerProveedores) {
            data_prov.obtenerProveedores.map(item => {
                datos.push({
                    "value": item.id,
                    "label": item.empresa
                })
            });
        }
        return datos
    }

    const onSaveMateriaPrima = async () => {
        try {
            const input = {
                nombre,
                proveedor,
                pais: pais.name,
                unidad: unidad,
                existencias: materia.existencias,
                estado: 'ACTIVO'
            }
            console.log(input)
            const { data } = await actualizar({ variables: { id: materia.id, input }, errorPolicy: 'all' });
            const { estado, message } = data.actualizarMateriaPrima;
            if (estado) {
                Notification['success']({
                    title: 'Actualizar Materia Prima',
                    duration: 5000,
                    description: message
                })
                props.history.push(`/materias_primas`);
            } else {
                Notification['error']({
                    title: 'Actualizar Materia Prima',
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
        return !nombre || !proveedor || !pais || !unidad;
    }

    if (load_prov) return (<Loader backdrop content="Cargando..." vertical size="lg" />);

    return (
        <>
            <div>
                <Boton name="Atras" onClick={e => props.history.push(`/materias_primas`)} icon="arrow-left-line" tooltip="Ir a Materias Primas" size="xs" color="blue" />
            </div>
            <h3 className="text-center">Editar Materia Prima</h3>
            <h6>Nombre de la Materia Prima</h6>
            <input className="form-control mt-2" type="text" placeholder="Nombre de la Materia Prima" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <div className="row mt-3 mb-3">
                <div className="col-md-4 float-left">
                    <h6>País de Origen</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="País de Origen" value={pais} data={getPaises()} onChange={(e) => setPais(e)} searchable={true} />
                </div>
                <div className="justify-content-end col-md-8 float-right">
                    <h6>Proveedor</h6>
                    <SelectPicker className="mx-auto w-100 mt-3" size="md" placeholder="Proveedor" value={proveedor} data={getProveedores()} onChange={(e) => setProveedor(e)} searchable={true} />
                </div>
            </div>
            <div className="mx-auto w-50 row">
                <h6 className="my-1">Unidad Métrica</h6>
                <InputPicker className="w-100" data={[{ label: 'Kilogramo', value: 'Kilogramo' }, { label: 'Litro', value: 'Litro' }]} placeholder="Unidad Métrica" value={unidad} onChange={(e) => setUnidad(e)} />
            </div>
            <div className="d-flex justify-content-end float-rigth mt-2">
                <Boton onClick={onSaveMateriaPrima} tooltip="Guardar Proveedor" name="Guardar" icon="save" color="green" disabled={validarForm()} />
            </div>
        </>
    );
}

export default withRouter(FormularioMateriaPrima);