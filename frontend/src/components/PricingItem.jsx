import React from 'react'
import BulletIcon from '../assets/bullet.svg'

const PricingItem = ({ classNames, text }) => {
    return (
        <div className={`${classNames} d-flex align-items-center mb-3`}>
            <img src={BulletIcon} alt="Bullet Point" />
            <span className="ms-2">{text}</span>
        </div >
    )
}

export default PricingItem