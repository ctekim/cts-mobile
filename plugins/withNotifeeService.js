const { withAndroidManifest } = require('@expo/config-plugins');

const withNotifeeService = (config) => {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Permissions
    const permissions = [
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_DATA_SYNC',
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.WAKE_LOCK',
    ];

    if (!manifest['uses-permission']) manifest['uses-permission'] = [];
    const existingPerms = new Set(
      manifest['uses-permission'].map((p) => p.$['android:name'])
    );

    for (const name of permissions) {
      if (!existingPerms.has(name)) {
        manifest['uses-permission'].push({ $: { 'android:name': name } });
      }
    }

    // Declare notifee's foreground service with dataSync type
    const application = manifest.application[0];
    if (!application.service) application.service = [];

    const serviceName = 'app.notifee.core.ForegroundService';
    const existing = application.service.find(
      (s) => s.$['android:name'] === serviceName
    );

    if (existing) {
      existing.$['android:foregroundServiceType'] = 'dataSync';
    } else {
      application.service.push({
        $: {
          'android:name': serviceName,
          'android:foregroundServiceType': 'dataSync',
        },
      });
    }

    return config;
  });
};

module.exports = withNotifeeService;