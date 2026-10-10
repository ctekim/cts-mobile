const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withNetworkSecurityConfig(config) {
  // 1. Copy the XML file into the native project during prebuild
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const target = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/xml/network_security_config.xml'
      );
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>
</network-security-config>`);
      return config;
    },
  ]);

  // 2. Reference it from AndroidManifest.xml
  config = withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application?.[0];
    if (app) {
      app.$['android:networkSecurityConfig'] = '@xml/network_security_config';
      app.$['android:usesCleartextTraffic'] = 'true';
    }
    return config;
  });

  return config;
}

module.exports = withNetworkSecurityConfig;