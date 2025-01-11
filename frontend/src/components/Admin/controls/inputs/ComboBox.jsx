import React from 'react';
import PropTypes from 'prop-types';

const ComboBox = ({ options, onChange }) => {
    return (
        <select onChange={onChange} className="px-3 py-2 rounded-lg">
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

ComboBox.propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ComboBox;