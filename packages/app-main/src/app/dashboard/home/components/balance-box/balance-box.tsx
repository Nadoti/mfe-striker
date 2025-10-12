'use client';

import './balance-box.css';

type BalanceBoxProps = {
  value: string;
  date: string;
}

const BalanceBox = ({ value, date }: BalanceBoxProps) => (
    <div className="balanceBox">
        <span className="balanceTitle">Saldo:</span>
        <div className="balanceValue">{value}</div>
        <div className="balanceDate">{date}</div>
    </div>
);

export default BalanceBox;
