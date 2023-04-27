import React from 'react'
import reactCSS from 'reactcss'
import map from 'lodash/map'

import { Swatch } from '../common'

export const BlockSwatches = ({ colors, onClick, onSwatchHover, active }) => {
  const styles = reactCSS({
    'default': {
      swatches: {
        marginRight: '-5px',
      },
     
      swatch: {
        width: '22px',
        height: '22px',
        float: 'left',
        marginRight: '5px',
        marginBottom: '5px',
        borderRadius: '5px',
      },
      clear: {
        clear: 'both',
      },
      
    },
  
  })

  return (
    <div style={ styles.swatches }>
      { map(colors, c => (
        <Swatch
          key={ c }
          color={ c }
          style={ styles.swatch }
          active={ c.toLowerCase() === active }
          onClick={ onClick }
          onHover={ onSwatchHover }
          focusStyle={{
            boxShadow: 'none',
          }}
        >
         
          </Swatch>
          
      )) }

      <div style={ styles.clear } />
    </div>
  )
}

export default BlockSwatches
