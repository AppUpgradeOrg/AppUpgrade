declare var global: NodeJS.Global &
  typeof globalThis & {
    appUpgrade: {
      appUpgradeId: string;
      load: () => void;
    };
  };

global.appUpgrade = {
  appUpgradeId: global.appUpgrade?.appUpgradeId,
  load: () => {
    if (global.appUpgrade.appUpgradeId) {
      console.log(global.appUpgrade.appUpgradeId);
    } else {
      console.error("Could not locate appUpgradeId");
    }
  },
};

global.appUpgrade.load();
