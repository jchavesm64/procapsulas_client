/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import Pagination from '../shared/Pagination'

const Table = ({ ...props }) => {

    const { Title, Rows, info } = props

    const getData = () => {
        var array = []
        info.map(i => {
            array.push(<Rows data={i} />)
        })
        return array
    }

    return (
        <div className='my-2 shadow-lg rounded-2'>
            <table className="table">
                <thead className="table-red">
                    <tr>
                        {
                            Title.map(i => {
                                return (<th scope="col" className={i.class} style={{ background: '#0CA3AE', color: 'white' }}>{i.title}</th>)
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        getData()
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Table;