// src/components/layout/Layout.jsx
import { AppShell } from '@mantine/core';
import { Header } from './Header/Header';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 70 }}
      padding={0}
      layout="alt"
    >
      <AppShell.Header
      >
        <div className="h-full py-2">
          <Header opened={opened} toggle={toggle}/>
        </div>
      </AppShell.Header>
      <AppShell.Main pt={70}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}