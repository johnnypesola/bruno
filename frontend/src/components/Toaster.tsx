import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const MessageBox = styled.div`
  font-size: 13px;
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  color: black;
  border-radius: 10px;
  height: 30px;
  width: 200px;

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
  const [className, setClassName] = useState<'hide' | 'show'>('hide');

  useEffect(() => {
    setClassName(message ? 'show' : 'hide');
    setTimeout(() => setClassName('hide'), 100);
  }, [message]);

  return <MessageBox className={className}>{message}</MessageBox>;
};

export default Toaster;
