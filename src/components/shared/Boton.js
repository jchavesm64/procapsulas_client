import React from 'react';
import { FlexboxGrid, IconButton, Icon, Tooltip, Whisper } from "rsuite";

const Boton = (props) => {
    const tooltip = (
        <Tooltip>{props.tooltip}</Tooltip>
    )
    return (
        <FlexboxGrid justify={props.position}>
            <Whisper placement="top" trigger="hover" speaker={tooltip}>
                <IconButton {...props} icon={<Icon icon={props.icon} />} placement="left" color={props.color} size={props.size}>
                    {props.name}
                </IconButton>
            </Whisper>
        </FlexboxGrid>
    )
}

export default Boton;