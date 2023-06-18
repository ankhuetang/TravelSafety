import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faHeart,
    faHospital,
    faSkullCrossbones,
    faBalanceScale,
    faMoneyBill,
    faFlag,
    faFemale
} from '@fortawesome/free-solid-svg-icons';
import './InfoWindowContent.css';

const InfoWindowContent = ({ content }) => {
    return (
        <div className="info-window-content">
            <div className="info-item">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faHeart} className="icon heart" />
                </div>
                <div className="label">Overall:</div>
                <div className="value">{content.overall}</div>
            </div>
            <div className="info-item">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faFlag} className="icon pride" />
                </div>
                <div className="label">LGBTQ:</div>
                <div className="value">{content.lgbtq}</div>
            </div>
            <div className="info-item">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faHospital} className="icon hospital" />
                </div>
                <div className="label">Medical:</div>
                <div className="value">{content.medical}</div>
            </div>
            <div className="info-item">
                <div className="icon-container">
                    <FontAwesomeIcon
                        icon={faSkullCrossbones}
                        className="icon skull"
                    />
                </div>
                <div className="label">Physical Harm:</div>
                <div className="value">{content.physicalHarm}</div>
            </div>
            <div className="info-item">
                <div className="icon-container">
                    <FontAwesomeIcon
                        icon={faBalanceScale}
                        className="icon balance"
                    />
                </div>
                <div className="label">Political Freedom:</div>
                <div className="value">{content.politicalFreedom}</div>
            </div>
            <div className="info-item">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faMoneyBill} className="icon theft" />
                </div>
                <div className="label">Theft:</div>
                <div className="value">{content.theft}</div>
            </div>
            <div className="info-item">
                <div className="icon-container">
                    <FontAwesomeIcon icon={faFemale} className="icon female" />
                </div>
                <div className="label">Women:</div>
                <div className="value">{content.women}</div>
            </div>
        </div>
    );
};

export default InfoWindowContent;
