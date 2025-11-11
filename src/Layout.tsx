import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    CSidebar,
    CSidebarBrand,
    CSidebarHeader,
    CSidebarNav,
    CNavItem,
    CNavTitle,
    CContainer,
    CSidebarToggler,
    CSidebarFooter,
    CCloseButton,
} from '@coreui/react-pro';
import CIcon from '@coreui/icons-react';
import {
    cilHome,
    cilList,
    cilDescription,
    cilCreditCard,
    cilBank,
} from '@coreui/icons';
import './Layout.scss';

interface MenuItem {
    href: string;
    title: string;
    icon: string[];
}

const menuItems: MenuItem[] = [
    { href: "/", title: "Home", icon: cilHome },
    { href: "/inventory", title: "Inventory", icon: cilList },
    { href: "/aging-report", title: "Aging Report", icon: cilDescription },
    { href: "/payment-extract", title: "Payment Extract", icon: cilCreditCard },
    { href: "/bank-statement", title: "Bank Statement", icon: cilBank },
];

const getIsDesktop = () => (typeof window !== 'undefined' ? window.innerWidth >= 992 : true);

const Layout = () => {
    const [isDesktop, setIsDesktop] = useState(getIsDesktop);
    const [sidebarVisible, setSidebarVisible] = useState(getIsDesktop);
    const [sidebarUnfoldable, setSidebarUnfoldable] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const desktop = getIsDesktop();
            setIsDesktop(desktop);
            setSidebarVisible(desktop);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const closeSidebarOnMobile = () => {
        if (!isDesktop) {
            setSidebarVisible(false);
        }
    };

    return (
        <div className="layout d-flex">
            <CSidebar
                className="border-end"
                colorScheme="light"
                position="fixed"
                visible={sidebarVisible}
                unfoldable={sidebarUnfoldable}
                onVisibleChange={(visible: boolean) => setSidebarVisible(visible)}
            >
                <CSidebarHeader className="border-bottom">
                    <CSidebarBrand className="fw-semibold">
                        <NavLink to="/" className="sidebar-brand__link">
                            PyGrays
                        </NavLink>
                    </CSidebarBrand>
                    <CCloseButton className="d-lg-none" onClick={() => setSidebarVisible(false)} />
                </CSidebarHeader>

                <CSidebarNav>
                    <CNavTitle>Navigation</CNavTitle>
                    {menuItems.map(({ href, title, icon }) => (
                        <CNavItem key={href}>
                            <NavLink
                                to={href}
                                end={href === '/'}
                                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                                onClick={closeSidebarOnMobile}
                            >
                                <CIcon customClassName="nav-icon" icon={icon} />
                                {title}
                            </NavLink>
                        </CNavItem>
                    ))}
                </CSidebarNav>

                <CSidebarFooter className="border-top d-none d-lg-flex">
                    <CSidebarToggler onClick={() => setSidebarUnfoldable((value) => !value)} />
                </CSidebarFooter>
            </CSidebar>

            <div className={`layout-main d-flex flex-column flex-grow-1 min-vh-100 ${sidebarUnfoldable ? 'layout-main--narrow' : ''}`}>
                <header className="layout-header d-lg-none">
                    <button
                        type="button"
                        className="layout-header__toggler"
                        onClick={() => setSidebarVisible(true)}
                        aria-label="Open navigation"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </header>

                <main className="layout-content flex-grow-1">
                    <CContainer fluid className="py-4">
                        <Outlet />
                    </CContainer>
                </main>
            </div>
        </div>
    );
};

export default Layout;