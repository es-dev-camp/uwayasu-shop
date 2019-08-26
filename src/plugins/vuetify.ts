import Vue from "vue";
import Vuetify from "vuetify";
import ja from "vuetify/lib/locale/ja";
import colors from "vuetify/lib/util/colors";
import "vuetify/dist/vuetify.min.css";

Vue.use(Vuetify);

const lightThemeSettings = {
  primary: colors.blue.base,
  // secondary: colors.green.base,
  accent: colors.pink.base
  // error: '#FF5252',
  // info: '#2196F3',
  // success: '#4CAF50',
  // warning: '#FB8C00'
};

const darkThemeSettings = {
  primary: colors.blue.base,
  // secondary: colors.green.base,
  accent: colors.pink.base
  // error: '#FF5252',
  // info: '#2196F3',
  // success: '#4CAF50',
  // warning: '#FB8C00'
};

export default new Vuetify({
  lang: {
    locales: { ja },
    current: "ja"
  },
  theme: {
    dark: true,
    themes: {
      light: lightThemeSettings,
      dark: darkThemeSettings
    }
  },
  icons: {
    iconfont: "mdi"
  }
});
