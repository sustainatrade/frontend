import React, { useState, useEffect } from 'react';
import { Script } from 'the-platform';

export default function Test() {
  return (
    <>
      <React.Suspense maxDuration={300} fallback={null}>
        <Script src="https://code.iconify.design/1/1.0.0-rc3/iconify.min.js" async>
          {() => {
            console.log('icons loaded');
            return null;
          }}
        </Script>
      </React.Suspense>
    </>
  );
}
