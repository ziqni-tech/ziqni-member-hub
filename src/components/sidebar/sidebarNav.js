import Dashboard from './svg-icons/Dashboard';
import Tournaments from './svg-icons/Tournaments';
import Missions from './svg-icons/Missions';
import Messages from './svg-icons/Messages';
import Achievements from './svg-icons/Achievements';
import Awards from './svg-icons/Awards';

const icons = {
    dashboard: Dashboard,
    tournaments: Tournaments,
    achievements: Achievements,
    awards: Awards,
    messages: Messages,
    missions: Missions
}

const getSidebarNav = (config) => {
    const sidebarNav = []

    for (const menuItem of config.mainMenu.items) {
        const menuObject =      {
            name: menuItem.text,
            to: menuItem.url,
            icon: icons[menuItem.key],
            enabled: menuItem.enabled
            // icon: menuItem.images.icon,
        }
        sidebarNav.push(menuObject)
    }

    return sidebarNav
}

export default getSidebarNav;
