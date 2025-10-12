'use client';

import './info-box.css';

type InfoBoxProps = {
  label: string;
  value: string;
};

const InfoBox = ({ label, value }: InfoBoxProps) => (
    <div className="infoBox">
        <span className="infoLabel">{label}</span>
        <div className="infoValue">{value}</div>
    </div>
);

export default InfoBox;
