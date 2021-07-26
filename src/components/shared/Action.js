import React from 'react';
import { IconButton, Icon, Tooltip, Whisper } from "rsuite";

const Action = (props) => {
    const tooltip = (
        <Tooltip> {props.tooltip}</Tooltip>
    )
    return (

        <Whisper placement="top" trigger="hover" speaker={tooltip}>
            <IconButton {...props} icon={<Icon icon={props.icon} />} circle color={props.color} size={props.size}>
                {props.name}
            </IconButton>
        </Whisper>

    );
}

export default Action;