import React, { useState } from 'react';
import { Table } from 'rsuite';
import Action from '../shared/Action';
const { Column, HeaderCell, Cell, Pagination } = Table;

const ListDoble = (props) => {

    const [page, setPage] = useState(1);
    const [displayLength, setDisplayLength] = useState(5);

    const handleChangePage = (dataKey) => {
        setPage(dataKey)
    }

    const handleChangeLength = (dataKey) => {
        setPage(1);
        setDisplayLength(dataKey);
    }

    const onDelete = (correo) => {
        var index = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].email === correo.email) {
                index = i;
                break;
            }
        }
        if (index != null) {
            data.splice(index, 1);
            props.setRefrescar(!props.refrescar);
        }
    }

    const { data, estilos } = props;
    return (
        <div className="p-0">
            <Table className={estilos} style={{ maxHeight: 270, minHeight: 270 }} data={data}>
                <Column flexGrow={1}>
                    <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>{props.header}</HeaderCell>
                    <Cell dataKey={props.clave} />
                </Column>
                <Column flexGrow={1}>
                    <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>{props.header2}</HeaderCell>
                    <Cell dataKey={props.clave2} />
                </Column>
                <Column width={75} fixed="right">
                    <HeaderCell style={{ background: '#0CA3AE', color: 'white' }}>Acciones</HeaderCell>
                    <Cell>
                        {rowData => {
                            return (
                                <>
                                    <div className="d-inline-block">
                                        <Action onClick={() => onDelete(rowData)} tooltip="Eliminar dato" color="red" icon="trash" size="xs" />
                                    </div>
                                </>
                            );
                        }}
                    </Cell>
                </Column>
            </Table>
            {(data.length > 5) &&
                < Pagination className={estilos}
                    first={false}
                    last={false}
                    next={false}
                    prev={false}
                    showInfo={false}
                    showLengthMenu={false}
                    activePage={page}
                    displayLength={displayLength}
                    total={data.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                />
            }
        </div>
    );

}

export default ListDoble;