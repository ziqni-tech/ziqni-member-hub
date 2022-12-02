import dashboardIcon from '../../assets/icons/sidebar/dashboard.svg';
// import dashboardIcon from '../../assets/icons/sidebar/home_.png';
import historyIcon from '../../assets/icons/sidebar/history.svg';
import messagesIcon from '../../assets/icons/sidebar/messages.svg';
import tournamentsIcon from '../../assets/icons/sidebar/tournaments.svg';
import missionsIcon from '../../assets/icons/sidebar/missions.svg';
import loyalityLevelIcon from '../../assets/icons/sidebar/loyality-Level.svg';
import instantRewardsIcon from '../../assets/icons/sidebar/instant-rewards.svg';
import loyalityStoreIcon from '../../assets/icons/sidebar/loyality-store.svg';

const sidebarNav = [
    {
        name: 'Dashboard',
        to: '/',
        icon: dashboardIcon,
    },
    {
        name: 'Tournaments',
        to: '/tournaments',
        icon: tournamentsIcon,
    },
    {
        name: 'Missions',
        to: '/missions',
        icon: missionsIcon,
    },
    {
        name: 'Loyality Level',
        to: '/loyality-Level',
        icon: loyalityLevelIcon,
    },
    {
        name: 'Instant Rewards',
        to: '/instant-rewards',
        icon: instantRewardsIcon,
    },
    {
        name: 'Loyality Store',
        to: '/loyality-store',
        icon: loyalityStoreIcon,
    },
    {
        name: 'Messages',
        to: '/messages',
        icon: messagesIcon,
    },
    {
        name: 'History',
        to: '/history',
        icon: historyIcon,
    }
];

export default sidebarNav;