import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MessageBox = styled.div`
  font-size: 33px;
  font-weight: 700;
  color: #ea0;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  opacity: 1;
  transition: opacity 3s ease-in-out;

  &.show {
    transition: opacity 0s ease-in-out;
    opacity: 1;
  }

  &.hide {
    opacity: 0;
  }
`;

const Toaster: React.FC<{ message?: string }> = ({ message }) => {
  const [className, setClassName] = useState<'hide' | 'show'>('show');

  useEffect(() => {
    setClassName(message ? 'show' : 'hide');
    setTimeout(() => setClassName('hide'), 100);
  }, [message]);

  return <MessageBox className={className}>{message}</MessageBox>;
};

export default Toaster;
