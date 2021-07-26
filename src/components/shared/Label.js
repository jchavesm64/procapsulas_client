import React from 'react'
import { InputGroup, Icon } from 'rsuite'

const Label = (props) => {
    return (
        <InputGroup size="lg" className="w-90 mx-auto my-2">
            <InputGroup.Addon size="lg">
                <Icon icon={props.icon} />
            </InputGroup.Addon>
            <span style={{ fontSize: 17 }} className="text-dark w-100 pt-2 px-1">{props.value}</span>
        </InputGroup>
    )
}
export default Label