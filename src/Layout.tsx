import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
    CSidebar,
    CSidebarBrand,
    CSidebarHeader,
    CSidebarNav,
    CSidebarToggler,
    CNavItem,
    CNavTitle,
    CContainer,
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

const Layout = () => {
    // On desktop (≥992px), sidebar is visible by default; on mobile it's hidden
    const [sidebarVisible, setSidebarVisible] = useState(typeof window !== 'undefined' ? window.innerWidth >= 992 : true);
    const [sidebarUnfoldable, setSidebarUnfoldable] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Handle window resize to manage sidebar visibility
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 992) {
                setSidebarVisible(true);
            } else {
                setSidebarVisible(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavClick = (href: string) => {
        navigate(href);
        // Close sidebar on mobile after navigation
        if (window.innerWidth < 992) {
            setSidebarVisible(false);
        }
    };

    return (
        <div className="layout-wrapper">
            <CSidebar
                className="border-end"
                colorScheme="light"
                position="fixed"
                unfoldable={sidebarUnfoldable}
                visible={sidebarVisible}
                onVisibleChange={(visible: boolean) => {
                    setSidebarVisible(visible);
                }}
            >
                <CSidebarHeader className="border-bottom">
                    <CSidebarBrand className="d-none d-md-flex">
                        PyGrays
                    </CSidebarBrand>
                    <CSidebarBrand className="d-md-none">
                        PG
                    </CSidebarBrand>
                </CSidebarHeader>

                <CSidebarNav>
                    <CNavTitle>Navigation</CNavTitle>
                    {menuItems.map(({ href, title, icon }) => (
                        <CNavItem
                            key={href}
                            href="#"
                            onClick={(e: React.MouseEvent) => {
                                e.preventDefault();
                                handleNavClick(href);
                            }}
                            className={location.pathname === href ? 'active' : ''}
                        >
                            <CIcon customClassName="nav-icon" icon={icon} />
                            {title}
                        </CNavItem>
                    ))}
                </CSidebarNav>

                <CSidebarHeader className="border-top d-none d-lg-flex">
                    <CSidebarToggler
                        onClick={() => setSidebarUnfoldable(!sidebarUnfoldable)}
                    />
                </CSidebarHeader>
            </CSidebar>

            <div className="wrapper d-flex flex-column min-vh-100">
                <div className="body flex-grow-1">
                    <CContainer fluid className="px-4 py-4">
                        <Outlet />
                    </CContainer>
                </div>
            </div>

            {/* Mobile overlay backdrop */}
            <div
                className={`sidebar-backdrop ${sidebarVisible ? 'show' : ''}`}
                onClick={() => setSidebarVisible(false)}
            />

            {/* Mobile toggle button */}
            <button
                className="sidebar-toggler d-lg-none"
                onClick={() => setSidebarVisible(!sidebarVisible)}
                aria-label={sidebarVisible ? "Close menu" : "Open menu"}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    );
};

export default Layout;