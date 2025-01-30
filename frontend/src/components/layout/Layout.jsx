
import { AppShell } from '@mantine/core';
import { Header } from './Header/Header';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened }
      }}
      padding="md"
       layout="alt"
    >
      <Header opened={opened} toggle={toggle} />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}