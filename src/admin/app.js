import Logo from './extensions/logo.png';

const name = "Project 1"

export default {
  config: {
    auth: {
      logo: Logo,
    },
    menu: {
      logo: Logo,
    },
    locales: [
      'id',
    ],
    translations: {
      id: {
        'app.components.LeftMenu.navbrand.title': name
      },
      en: {
        'app.components.LeftMenu.navbrand.title': name
      }
    }
  },
  bootstrap(app) {
    console.log(app);
  },
};
