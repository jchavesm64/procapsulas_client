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
        <Panel shaded bordered bodyFill style={{ width: 600, maxWidth: 600 }}
            className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
            onMouseEnter={() => setState(true)}
            onMouseLeave={() => setState(false)}
        >
            <h4 className="mt-4 text-center">{"Datos del Movimiento"}</h4>
            <div className="mx-1 row">
                <div className="col-md-6">
                    <h6>Tipo</h6>
                    <Label icon="list" value={movimiento.tipo} />
                    <h6>Lote</h6>
                    <Label icon="hashtag" value={movimiento.lote} />
                    <h6>Código</h6>
                    <Label icon="barcode" value={movimiento.codigo} />
                    {movimiento.tipo === 'ENTRADA' &&
                        <>
                            <h6>Fabricación</h6>
                            <Label icon="calendar-o" value={getFecha(movimiento.fechaFabricacion)} />
                            <h6>Vencimiento</h6>
                            <Label icon="calendar-o" value={getFecha(movimiento.fechaVencimiento)} />
                        </>
                    }
                    <h6>Cantidad</h6>
                    <Label icon="hashtag" value={movimiento.cantidad} />
                </div>
                <div className="col-md-6">
                    {movimiento.tipo === 'ENTRADA' &&
                        <>
                            <h6>Existencias</h6>
                            <Label icon="hashtag" value={movimiento.existencia} />
                            <h6>Precio unidad</h6>
                            <Label icon="hashtag" value={movimiento.precio_unidad} />
                            <h6>Total</h6>
                            <Label icon="hashtag" value={movimiento.precio} />
                        </>
                    }
                    <h6>Registrado por</h6>
                    <Label icon="user" value={movimiento.usuario.nombre} />
                    <h6>Fecha de registro</h6>
                    <Label icon="calendar-o" value={getFecha(movimiento.fecha)} />
                </div>
            </div>
        </Panel>
    )
}

export default withRouter(CardMovimiento)