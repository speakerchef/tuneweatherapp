import React from 'react';
import { ScaleLoader} from "react-spinners";
import styled from '@emotion/styled';

const GradientScaleLoader = styled(ScaleLoader)`
  display: block;
  margin: 0 auto;
  margin-top: 4rem;
  margin-bottom: -3rem;

  span {
    background: linear-gradient(to right, rgb(67 56 202), #e600ff);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Spinner = ({loading}) => {
    return (
        <div>
            <ScaleLoader
            loading={loading}
            cssOverride={cssOverride}
            size={150}
            />
        </div>
    );
};

export default Spinner;