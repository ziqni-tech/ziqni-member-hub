import Dashboard from './svg-icons/Dashboard';
import Tournaments from './svg-icons/Tournaments';
import Missions from './svg-icons/Missions';
import Messages from './svg-icons/Messages';
import Achievements from './svg-icons/Achievements';
import Awards from './svg-icons/Awards';

const sidebarNav = [
    {
        name: 'Dashboard',
        to: '/dashboard',
        icon: Dashboard,
    },
    {
        name: 'Tournaments',
        to: '/tournaments',
        icon: Tournaments,
    },
    {
        name: 'Achievements',
        to: '/achievements',
        icon: Achievements,
    },
    {
        name: 'Awards',
        to: '/awards',
        icon: Awards,
    },
    {
        name: 'Messages',
        to: '/messages',
        icon: Messages,
    },
    {
        name: 'Missions',
        to: '/missions',
        icon: Missions,
    },
];

export default sidebarNav;