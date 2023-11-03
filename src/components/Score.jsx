import React from 'react'

function Score({ score, turn }) {
    return (
        <div style={{ display: 'flex', gap: '2px' }}>
            <div className='scoreBoard'>
                Turn : {turn}
            </div>
            <div className='scoreBoard'>
                Score : {score}
            </div>
        </div>

    )
}

export default Score