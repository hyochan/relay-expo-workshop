import React, {FC} from 'react';

import {RootStackNavigationProps} from '../navigations/RootStack';
import styled from '@emotion/native';

const Container = styled.View`
  flex: 1;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const StyledText = styled.Text`
  font-size: 16px;
  color: ${({theme}): string => theme.text};
`;

interface Props {
  navigation: RootStackNavigationProps<'default'>;
}

const User: FC<Props> = () => {
  return (
    <Container>
      <StyledText>User</StyledText>
    </Container>
  );
};

export default User;
