import React, { useState } from 'react'
import CardUsuarios from '../usuarios/Card'
import CardClientes from '../clientes/Card'
import CardProveedores from '../proveedores/Card'
import CardMaterias from '../materias_primas/Card'
import CardMovimientos from '../materias_primas/Movimientos/Card'
import CardMaquina from '../Maquinaria/Card'
import CardIncidente from '../Maquinaria/Incidentes/Card'
import CardMantenimientos from '../Maquinaria/Mantenimientos/Card'
import Pagination from '../shared/Pagination'

const DataGrid = ({ ...props }) => {
    const { data, type, displayLength } = props;
    var index = 0
    const [page, setPage] = useState((localStorage.getItem('active_page_'+type) && (data.length > displayLength)) ? localStorage.getItem('active_page_'+type) : 1);
    if(data.length < displayLength && page !== 1){
        setPage(1)
    }

    const getData = () => {
        var array = [], size = data.length;
        if (index + displayLength <= data.length) {
            size = index + displayLength;
        }
        for (let i = index; i < size; i++) {
            if(type === 'usuarios'){
                array.push(<CardUsuarios key={i} usuario={data[i]} {...props} />)
            }else if(type === 'clientes'){
                array.push(<CardClientes key={i} cliente={data[i]} {...props} />)
            }else if(type === 'proveedores'){
                array.push(<CardProveedores key={i} proveedor={data[i]} {...props} />)
            }else if(type === 'materias'){
                array.push(<CardMaterias key={i} materia={data[i]} {...props} />)
            }else if(type === 'movimientos'){
                array.push(<CardMovimientos key={i} movimiento={data[i]} {...props} />)
            }else if(type === 'maquina'){
                array.push(<CardMaquina key={i} maquina={data[i]} {...props} />)
            }else if(type === 'incidente'){
                array.push(<CardIncidente key={i} incidente={data[i]} {...props} />)
            }else if(type === 'mantenimiento'){
                array.push(<CardMantenimientos key={i} mantenimiento={data[i]} {...props} />)
            }
        }
        return array
    }

    const calIndex = () => {
        if(page === 1){
            index = 0
        }else{
            index = (((page - 1) * displayLength))
        }
    }

    calIndex()

    return (
        <div className="bg-white rounded shadow">
            <div className="d-flex flex-wrap justify-content-around col-xs">
                {
                    getData()
                }
            </div>
            {(data.length > displayLength) &&
                <div div className="d-flex justify-content-end w-90">
                    <Pagination type={type} length={data.length} displayLength={displayLength} activePage={parseInt(page)} setPage={setPage}/>
                </div>
            }
        </div >
    )
}

export default DataGrid