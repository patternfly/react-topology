import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import {
  Page,
  Nav,
  NavList,
  NavItem,
  PageSection,
  PageSidebar,
  Avatar,
  Brand,
  Radio,
  NavExpandable,
  PageSidebarBody,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Masthead,
  MastheadToggle,
  PageToggleButton,
  MastheadContent,
  MastheadBrand,
  MastheadMain,
  ToolbarContent
} from '@patternfly/react-core';
import { BarsIcon } from '@patternfly/react-icons/dist/esm/icons/bars-icon';
import imgBrand from './assets/images/imgBrand.svg';
import imgAvatar from './assets/images/imgAvatar.svg';
import Demos from './Demos';
import './App.css';
interface AppState {
  activeItem: number | string;
  isNavOpen: boolean;
  isDarkTheme: boolean;
}

class App extends React.Component<{}, AppState> {
  state: AppState = {
    activeItem: Demos.reduce(
      (active, demo) => active || (demo.isDefault ? demo.id : demo.demos?.find((subDemo) => subDemo.isDefault)?.id),
      ''
    ),
    isNavOpen: true,
    isDarkTheme: false
  };

  private onNavSelect = (_event: any, selectedItem: { itemId: number | string; groupId: number | string }) => {
    this.setState({ activeItem: selectedItem.itemId });
  };

  private onThemeSelect = (isDarkTheme: boolean) => {
    this.setState({ isDarkTheme });
    const htmlElement = document.getElementsByTagName('html')[0];
    if (htmlElement) {
      if (isDarkTheme) {
        htmlElement.classList.add('pf-v5-theme-dark');
      } else {
        htmlElement.classList.remove('pf-v5-theme-dark');
      }
    }
  };

  private getPages = () => {
    const defaultDemo = Demos.reduce(
      (active, demo) => active || (demo.isDefault ? demo : demo.demos?.find((subDemo) => subDemo.isDefault)),
      undefined
    );
    return (
      <Switch>
        {Demos.reduce((acc, demo) => {
          if (demo.demos) {
            demo.demos.forEach((subDemo) => {
              acc.push(
                <Route
                  path={`/${demo.id}-nav-link/${subDemo.id}-nav-link`}
                  render={() => (
                    <PageSection style={{ zIndex: 2 }} id={`/${demo.id}-nav-link/${subDemo.id}-nav-link`}>
                      {React.createElement(subDemo.componentType)}
                    </PageSection>
                  )}
                  key={demo.id}
                />
              );
            });
          } else {
            acc.push(
              <Route
                path={`/${demo.id}-nav-link`}
                render={() => (
                  <PageSection style={{ zIndex: 2 }} id={`/${demo.id}-page-section`}>
                    {React.createElement(demo.componentType)}
                  </PageSection>
                )}
                key={demo.id}
              />
            );
          }
          return acc;
        }, [])}
        {defaultDemo ? (
          <Route
            path="/"
            render={() => (
              <PageSection style={{ zIndex: 2 }} id={`/${defaultDemo.id}-page-section`}>
                {React.createElement(defaultDemo.componentType)}
              </PageSection>
            )}
            key={defaultDemo.id}
          />
        ) : null}
      </Switch>
    );
  };

  private pageId = 'ts-demo-app-page-id';

  render() {
    const { isNavOpen, activeItem, isDarkTheme } = this.state;

    const AppToolbar = (
      <Toolbar id="toolbar" isFullHeight isStatic>
        <ToolbarContent>
          <ToolbarGroup align={{ default: 'alignRight' }}>
            <ToolbarItem style={{ marginRight: '10px' }}>
              <Radio
                id="light-theme"
                aria-label="Light theme"
                label={`Light theme`}
                name="light-theme"
                isChecked={!isDarkTheme}
                onChange={(_event: any, checked: boolean) => checked && this.onThemeSelect(false)}
              />
            </ToolbarItem>
            <ToolbarItem>
              <Radio
                id="dark-theme"
                label="Dark theme"
                aria-label="Dark theme"
                name="dark-theme"
                isChecked={isDarkTheme}
                onChange={(_event: any, checked: boolean) => checked && this.onThemeSelect(true)}
              />
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarItem>
            <Avatar src={imgAvatar} alt="Avatar image" />
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
    );

    const AppHeader = (
      <Masthead>
        <MastheadToggle>
          <PageToggleButton
            variant="plain"
            aria-label="Global navigation"
            isSidebarOpen={isNavOpen}
            onSidebarToggle={() => this.setState({ isNavOpen: !isNavOpen })}
          >
            <BarsIcon />
          </PageToggleButton>
        </MastheadToggle>
        <MastheadMain>
          <MastheadBrand component="a">
            <Brand src={imgBrand} alt="Patternfly Logo" heights={{ default: '36px' }} />
          </MastheadBrand>
        </MastheadMain>
        <MastheadContent>{AppToolbar}</MastheadContent>
      </Masthead>
    );

    const nav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavList>
          {Demos.map((demo) => {
            if (demo.demos) {
              return (
                <NavExpandable title={demo.name} groupId={demo.id} isExpanded key={demo.id}>
                  {demo.demos.map((subDemo) => (
                    <NavItem itemId={subDemo.id} isActive={activeItem === subDemo.id} key={subDemo.id}>
                      <Link id={`${subDemo.id}-nav-item-link`} to={`/${demo.id}-nav-link/${subDemo.id}-nav-link`}>
                        {subDemo.name}
                      </Link>
                    </NavItem>
                  ))}
                </NavExpandable>
              );
            }
            return (
              <NavItem itemId={demo.id} isActive={activeItem === demo.id} key={demo.id}>
                <Link id={`${demo.id}-nav-item-link`} to={`/${demo.id}-nav-link`}>
                  {demo.name}
                </Link>
              </NavItem>
            );
          })}
        </NavList>
      </Nav>
    );

    const AppSidebar = (
      <PageSidebar isSidebarOpen={isNavOpen}>
        <PageSidebarBody>{nav}</PageSidebarBody>
      </PageSidebar>
    );

    return (
      <Router>
        <Page header={AppHeader} sidebar={AppSidebar} isManagedSidebar mainContainerId={this.pageId}>
          {this.getPages()}
        </Page>
      </Router>
    );
  }
}

export default App;
