const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withNetworkSecurityConfig = (config) => {
  config = withDangerousMod(config, [
    'android',
    async (config) => {
      const rawDir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/raw'
      );
      fs.mkdirSync(rawDir, { recursive: true });

      const srcCert = path.join(config.modRequest.projectRoot, 'certs', 'cts_ca.pem');
      const destCert = path.join(rawDir, 'cts_ca.pem');
      fs.copyFileSync(srcCert, destCert);

      const xmlDir = path.join(
        config.modRequest.platformProjectRoot,
        'app/src/main/res/xml'
      );
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(
        path.join(xmlDir, 'network_security_config.xml'),
        `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="@raw/cts_ca" />
        </trust-anchors>
    </base-config>
</network-security-config>
`
      );

      return config;
    },
  ]);

  config = withAndroidManifest(config, (config) => {
    const app = config.modResults.manifest.application[0];
    app.$['android:networkSecurityConfig'] = '@xml/network_security_config';
    return config;
  });

  return config;
};

module.exports = withNetworkSecurityConfig;