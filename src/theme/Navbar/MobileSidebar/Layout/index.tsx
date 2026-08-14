import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {useNavbarSecondaryMenu} from '@docusaurus/theme-common/internal';
import type {Props} from '@theme/Navbar/MobileSidebar/Layout';

/**
 * Mobile navigation uses one full-width panel at a time.
 *
 * Docusaurus' default layout keeps primary and secondary menus side by side
 * and translates the container. That works well with the stock geometry, but
 * it becomes fragile once the knowledge-base navbar is customized. Rendering
 * only the active panel keeps Docs navigation readable on narrow screens while
 * preserving Docusaurus' existing menu state, back button and close behavior.
 */
export default function NavbarMobileSidebarLayout({
  header,
  primaryMenu,
  secondaryMenu,
}: Props): ReactNode {
  const {shown: secondaryMenuShown} = useNavbarSecondaryMenu();

  return (
    <div
      className={clsx(
        ThemeClassNames.layout.navbar.mobileSidebar.container,
        'navbar-sidebar',
        'navbar-sidebar--single-panel',
      )}>
      {header}
      <div className="navbar-sidebar__items navbar-sidebar__items--single-panel">
        <div
          className={clsx(
            ThemeClassNames.layout.navbar.mobileSidebar.panel,
            'navbar-sidebar__item menu',
          )}>
          {secondaryMenuShown ? secondaryMenu : primaryMenu}
        </div>
      </div>
    </div>
  );
}
