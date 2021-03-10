import React from 'react';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

const locationState = atom({
    key: 'locationState',
    default: '',
});

export { locationState };


