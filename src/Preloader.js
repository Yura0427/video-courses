import React from 'react';
import style from './Perloader.module.css';


export const Preloader = () => {
    return (
        // <div className={style.preloader}>
        //     <div className={style.preloader__image_animate}></div>
        // </div>
        <div className={style.preloader}>
            <div className={style.loader} ></div>
        </div>
    );

}