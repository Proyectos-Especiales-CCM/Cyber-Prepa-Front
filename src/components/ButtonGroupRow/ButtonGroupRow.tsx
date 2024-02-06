import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import "./ButtonGroupRow.css"

interface ButtonGroupProps {
  children: ReactNode;
}

const ButtonGroupRow: React.FC<ButtonGroupProps> = ({ children }) => {
  return (
    <Box className="box-row">
      {children}
    </Box>
  );
};

export default ButtonGroupRow;