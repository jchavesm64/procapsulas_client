import React, { useState } from 'react';
import { Table } from 'rsuite';
import Action from '../shared/Action';
const { Column, HeaderCell, Cell } = Table;

const List = (props) => {

    const onDelete = (correo) => {
        var index = null;
        for(var i = 0; i < data.length; i++){
            if(data[i].email === correo.email){
                index = i;
                break;
            }
        }
        if(index != null){
            data.splice(index, 1);
            props.setRefrescar(!props.refrescar);
        }
    }

    const { data, edit, borrar, estilos } = props;
    return (
        <div className="p-0">
            <Table className={estilos} height={200} data={data}>
                {(edit && borrar) ?
                    (
                        <Column width={300}>
                            <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>{props.header}</HeaderCell>
                            <Cell dataKey={props.clave} />
                        </Column>
                    ) : (
                        <Column flexGrow={2}>
                            <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>{props.header}</HeaderCell>
                            <Cell dataKey={props.clave} />
                        </Column>
                    )
                }
                {(edit || borrar) &&
                    <Column width={75} fixed="right">
                        <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>Acciones</HeaderCell>
                        <Cell>
                            {rowData => {
                                return (
                                    <>
                                        {edit &&
                                            <div className="d-inline-block">
                                                <Action tooltip="Editar dato" color="orange" icon="edit" size="xs" />
                                            </div>
                                        }
                                        {borrar &&
                                            <div className="d-inline-block">
                                                <Action onClick={() => onDelete(rowData)} tooltip="Eliminar dato" color="red" icon="trash" size="xs" />
                                            </div>
                                        }
                                    </>
                                );
                            }}
                        </Cell>
                    </Column>
                }
            </Table>
        </div>
    );

}

export default List;