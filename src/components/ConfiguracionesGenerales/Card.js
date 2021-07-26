import React, { useState } from 'react';
import { Panel, Icon } from 'rsuite';
import { Link } from 'react-router-dom';

const Card = ({ link, name, icon }) => {
    const [state, setState] = useState(false);

    return (
        <Link className="linkConfig" to={link}>
            <Panel shaded bordered bodyFill style={{ width: 260, maxWidth: 270 }}
                className={` ${state ? 'shadow-lg' : ' '} mx-4 my-4`}
                onMouseEnter={() => setState(true)}
                onMouseLeave={() => setState(false)}
            >
                <h4 className="mt-4 text-center">{name}</h4>
                <div className="d-flex justify-content-center">
                    <Panel >
                        <Icon className="my-2" icon={icon} size="4x"/>
                    </Panel>
                </div>
            </Panel>
        </Link>
    )
}

export default Card;