import {LoadingIndicator, ThemeProvider, ThemeType} from 'dooboo-ui';
import React, {Suspense} from 'react';

import {AppProvider} from './AppProvider';
import {ResettableRelayProvider} from './ResettableRelayProvider';
import {createRelayEnvironment} from '../relay';

interface Props {
  initialThemeType?: ThemeType;
  children?: React.ReactElement;
}

const RootProvider = ({
  initialThemeType,
  children,
}: Props): React.ReactElement => {
  return (
    <ThemeProvider initialThemeType={initialThemeType}>
      <ResettableRelayProvider createRelayEnvironment={createRelayEnvironment}>
        <Suspense fallback={<LoadingIndicator />}>
          <AppProvider>{children}</AppProvider>
        </Suspense>
      </ResettableRelayProvider>
    </ThemeProvider>
  );
};

export default RootProvider;
