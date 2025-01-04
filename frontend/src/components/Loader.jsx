import React from 'react'

export default function Loader({ style = {}, className = "" }) {
    return (

        <div style={style} className={"skeleton  " + className}></div>
    )
}
