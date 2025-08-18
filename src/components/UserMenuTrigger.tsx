import styled from 'styled-components';

export const UserMenuTrigger = styled.div`
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background-color: transparent;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;
