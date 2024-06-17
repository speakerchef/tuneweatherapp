import React from 'react';
import { ScaleLoader} from "react-spinners";

const cssOverride = {
    display: 'block',
    margin: '0 auto',
    marginTop: '4rem',
    marginBottom: '-3rem',
}

const Spinner = ({loading}) => {
    return (
        <div>
            <ScaleLoader
            className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-vibrantMagenta"
            loading={loading}
            cssOverride={cssOverride}
            size={150}
            />
        </div>
    );
};

export default Spinner;