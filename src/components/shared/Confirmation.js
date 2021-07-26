import React, { useState } from 'react';

import { Modal, Icon, Button } from 'rsuite'

const Confirmation = (props) => {
    const [show, setShow] = useState(true)

    const onHide = () => {
        setShow(false)
    }
    const confimationYes = () => {
        props.setConfirmation({ bool: false, idDelet: '' });
        props.onDeletObjeto(props.idDelete);
    }
    const confimationNo = () => {
        props.setConfirmation({ bool: false, idDelet: '' });
    }
    return (
        <Modal backdrop="static" show={true} onHide={onHide} size="xs">
            <Modal.Header style={{ fontSize: 18 }} onHide={confimationNo}>
                <Icon icon="remind" style={{ color: '#ffb300', fontSize: 24 }}/>
                {'  '}
                Eliminar
            </Modal.Header>
            <Modal.Body>
                <label style={{ fontSize: 18 }}>{props.message}</label>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={confimationYes} appearance="primary">Ok</Button>
                <Button onClick={confimationNo} appearance="subtle">Cancelar</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Confirmation;