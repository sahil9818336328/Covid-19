import React from 'react'
import '../css/table.css'
import numeral from 'numeral'

const Table = ({ countries }) => {
  return (
    <div className='table'>
      {countries.map((countries, index) => {
        const { country, cases } = countries

        return (
          <tr key={index}>
            <td>{country}</td>
            <td>
              <strong>{numeral(cases).format('0,0')}</strong>
            </td>
          </tr>
        )
      })}
    </div>
  )
}

export default Table
