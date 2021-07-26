import React, { useState } from 'react'
import { Icon, Button } from 'rsuite'

const Pagination = ({ ...props }) => {
    const { length, displayLength, activePage, setPage } = props

    const getItems = () => {
        var pages = parseInt(length / displayLength)
        if(length % displayLength !== 0){
            pages += 1;
        }
        var array = []
        array.push(<Button onClick={() => setPage(1)} className="list-group-item">1 <Icon icon="angle-double-left" /></Button>)
        if (pages <= 5) {
            for (let i = 1; i <= pages; i++) {
                array.push(<Button onClick={() => setPage(i)} className={`${activePage === i ? 'text-primary' : ''} list-group-item`}>{i}</Button>)
            }
        }else{
            if(activePage < 4){
                for (let i = 1; i <= 5; i++) {
                    array.push(<Button onClick={() => setPage(i)} className={`${activePage === i ? 'text-primary' : ''} list-group-item`}>{i}</Button>)
                }
            }else if((activePage + 2) < pages){
                for (let i = (activePage - 2); i <= (activePage + 2); i++) {
                    array.push(<Button onClick={() => setPage(i)} className={`${activePage === i ? 'text-primary' : ''} list-group-item`}>{i}</Button>)
                }
            }else{
                for (let i = (pages - 5); i <= pages; i++) {
                    array.push(<Button onClick={() => setPage(i)} className={`${activePage === i ? 'text-primary' : ''} list-group-item`}>{i}</Button>)
                }
            }
        }
        array.push(<Button onClick={() => setPage(pages)} className="list-group-item"><Icon icon="angle-double-right" /> {pages}</Button>)
        return array
    }


    return (
        <>
            <ul className="list-group list-group-horizontal m-2">
                {
                    getItems()
                }
            </ul>
        </>
    )
}

export default Pagination