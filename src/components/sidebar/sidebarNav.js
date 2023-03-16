import Dashboard from './svg-icons/Dashboard';
import Tournaments from './svg-icons/Tournaments';
import Missions from './svg-icons/Missions';
import LoyalityLevel from './svg-icons/LoyalityLevel';
import InstantRewards from './svg-icons/InstantRewards';
import LoyalityStore from './svg-icons/LoyalityStore';
import Messages from './svg-icons/Messages';
import Calendar from './svg-icons/Calendar';
import History from './svg-icons/History';

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
        name: 'Missions',
        to: '/missions',
        icon: Missions,
    },
    {
        name: 'Loyality Level',
        to: '/loyality-Level',
        icon: LoyalityLevel,
    },
    {
        name: 'Instant Rewards',
        to: '/instant-rewards',
        icon: InstantRewards,
    },
    {
        name: 'Loyality Store',
        to: '/loyality-store',
        icon: LoyalityStore,
    },
    {
        name: 'Messages',
        to: '/messages',
        icon: Messages,
    },
    {
        name: 'Calendar',
        to: '/calendar',
        icon: Calendar,
    },
    {
        name: 'History',
        to: '/history',
        icon: History,
    }
];

export default sidebarNav;