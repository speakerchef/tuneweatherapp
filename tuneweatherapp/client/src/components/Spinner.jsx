import React from 'react';
import { ScaleLoader} from "react-spinners";

const cssOverride = {
    display: 'block',
    margin: '0 auto',
    marginTop: '5rem',
    marginBottom: '-3rem',
}

const Spinner = ({loading}) => {
    return (
        <div>
            <ScaleLoader
            color={'#a100ff'}
            loading={loading}
            cssOverride={cssOverride}
            size={150}
            />
        </div>
    );
};

export default Spinner;

