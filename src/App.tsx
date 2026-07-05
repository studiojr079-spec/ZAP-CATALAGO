/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './components/Storefront';
import OwnerPortal from './components/OwnerPortal';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <HashRouter>
        <Routes>
          <Route path="/admin/*" element={<OwnerPortal />} />
          <Route path="/:slug" element={<Storefront />} />
          <Route path="/" element={<Navigate to="/admin" replace />} />
        </Routes>
        <Toaster />
    </HashRouter>
  );
}
