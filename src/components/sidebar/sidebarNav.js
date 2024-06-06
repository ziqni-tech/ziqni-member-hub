import { markRaw } from 'vue';

import Dashboard from './svg-icons/Dashboard';
import Tournaments from './svg-icons/Tournaments';
import Missions from './svg-icons/Missions';
import Messages from './svg-icons/Messages';
import Achievements from './svg-icons/Achievements';
import Awards from './svg-icons/Awards';

const icons = {
  dashboard: markRaw(Dashboard),
  tournaments: markRaw(Tournaments),
  achievements: markRaw(Achievements),
  awards: markRaw(Awards),
  messages: markRaw(Messages),
  missions: markRaw(Missions)
};

const getSidebarNav = (config) => {
  const sidebarNav = [];

  for (const menuItem of config.mainMenu.items) {
    const menuObject = {
      name: menuItem.text,
      to: menuItem.url,
      icon: icons[menuItem.key],
      enabled: menuItem.enabled
      // icon: menuItem.images.icon,
    };
    sidebarNav.push(menuObject);
  }

  return sidebarNav;
};

export default getSidebarNav;
