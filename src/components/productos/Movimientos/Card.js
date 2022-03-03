/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from 'react'
import { Panel } from 'rsuite';
import { withRouter } from 'react-router-dom';
import Label from '../../shared/Label'

const CardMovimiento = ({ ...props }) => {
    const [state, setState] = useState(false);
    const { movimiento } = props;
    
    function getFecha(fecha) {
        var date = new Date(fecha);
        var day = (date.getDate() < 9) ? '0' + (date.getDate() + 1) : date.getDate() + 1;
        var mes = (date.getMonth() < 9) ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
        return date.getFullYear() + ' / ' + mes + ' / ' + day;
    }

    return (
        <Panel shaded bordered bodyFill style={{ width: 300, maxWidth: 300 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <>
                <h4 className="mt-4 text-center">{"Datos del Movimiento"}</h4>
                <div className="mx-1">
                    <h6>Tipo</h6>
                    <Label icon="list" value={movimiento.tipo} />
                    {movimiento.tipo === 'ENTRADA' &&
                        <>
                            {movimiento.fecha_vencimiento &&
                                <>
                                    <h6>Fabricación</h6>
                                    <Label icon="calendar-o" value={getFecha(movimiento.fecha_vencimiento)} />
                                </>
                            }
                        </>
                    }
                    <h6>Cantidad</h6>
                    <Label icon="hashtag" value={movimiento.cantidad} />
                    <h6>Registrado por</h6>
                    <Label icon="user" value={movimiento.usuario.nombre} />
                    <h6>Fecha de registro</h6>
                    <Label icon="calendar-o" value={getFecha(movimiento.fecha)} />
                </div>
            </>
        </Panel>
    )
}

export default withRouter(CardMovimiento)