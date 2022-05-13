import React from 'react';

const CustomInput = props => {
    const {
        label,
        value,
        setValue,
        type = "text"
    } = props;

    return (
        <div>
            <div>
                <label>{label}</label>
                <input
                    style={{ width: '100%', marginBottom: 30 }}
                    type={type}
                    value={value}
                    onChange={e => setValue(e.target.value)} />
            </div>
        </div>
    )
}

export default CustomInput;