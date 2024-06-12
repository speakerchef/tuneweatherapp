import React from 'react';
import { ScaleLoader} from "react-spinners";

const cssOverride = {
    display: 'block',
    margin: '0 auto',
    borderColor: '#553bff',
    marginTop: '4rem',
}

const Spinner = ({loading}) => {
    return (
        <div>
            <ScaleLoader
            color={'#553bff'}
            loading={loading}
            cssOverride={cssOverride}
            size={150}
            />
        </div>
    );
};

export default Spinner;