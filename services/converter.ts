import type { ProxyConfig, ConversionResult, VmessProxyConfig, VlessProxyConfig, TrojanProxyConfig, ConversionSuccess } from '../types';

// This declaration is necessary because js-yaml is loaded from a CDN.
declare var jsyaml: {
  dump: (obj: any, options?: any) => string;
};

// --- Parsers for each protocol ---

function parseVmess(uri: string): ProxyConfig {
  const b64_config = uri.substring('vmess://'.length);
  const decoded_str = atob(b64_config);
  const config = JSON.parse(decoded_str);

  // Validate required fields
  if (!config.ps || !config.add || !config.port || !config.id) {
    throw new Error('Invalid VMess config: missing required fields (ps, add, port, id).');
  }

  const vmessConfig: VmessProxyConfig = {
    name: config.ps,
    type: 'vmess',
    server: config.add,
    port: parseInt(config.port, 10),
    uuid: config.id,
    alterId: parseInt(config.aid || '0', 10),
    cipher: config.scy || 'auto',
    tls: config.tls === 'tls',
    network: config.net || 'tcp',
    'skip-cert-verify': config.verify_cert === false,
    servername: config.sni || config.host || undefined,
  };

  if (vmessConfig.network === 'ws' && (config.path || config.host)) {
    vmessConfig['ws-opts'] = {
      path: config.path || '/',
      headers: {
        Host: config.host || config.add,
      },
    };
  }

  return vmessConfig;
}

function parseVless(uri: string): ProxyConfig {
  const url = new URL(uri);
  const params = url.searchParams;

  const vlessConfig: VlessProxyConfig = {
    name: decodeURIComponent(url.hash.substring(1)) || `${url.hostname}:${url.port}`,
    type: 'vless',
    server: url.hostname,
    port: parseInt(url.port, 10),
    uuid: url.username,
    tls: params.get('security') === 'tls',
    network: params.get('type') || 'tcp',
    servername: params.get('sni') || undefined,
    flow: params.get('flow') || undefined,
    'skip-cert-verify': params.get('allowInsecure') === '1',
  };

  if (vlessConfig.network === 'ws') {
    vlessConfig['ws-opts'] = {
      path: params.get('path') || '/',
      headers: {
        Host: params.get('host') || url.hostname,
      },
    };
  } else if (vlessConfig.network === 'grpc') {
    vlessConfig.grpc_opts = {
        'grpc-service-name': params.get('serviceName') || ''
    }
  }

  return vlessConfig;
}

function parseTrojan(uri: string): ProxyConfig {
  const url = new URL(uri);
  const params = url.searchParams;

  const trojanConfig: TrojanProxyConfig = {
    name: decodeURIComponent(url.hash.substring(1)) || `${url.hostname}:${url.port}`,
    type: 'trojan',
    server: url.hostname,
    port: parseInt(url.port, 10),
    password: url.username,
    tls: true, // Trojan is almost always over TLS
    network: params.get('type') || 'tcp',
    servername: params.get('sni') || url.hostname,
    'skip-cert-verify': params.get('allowInsecure') === '1' || params.get('verify') === 'false',
  };

  if (trojanConfig.network === 'ws') {
    trojanConfig['ws-opts'] = {
      path: params.get('path') || '/',
      headers: {
        Host: params.get('host') || url.hostname,
      },
    };
  }
  
  return trojanConfig;
}


// --- Main Processing Function ---

export function processInput(text: string): { yamlOutput: string, results: ConversionResult[] } {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const results: ConversionResult[] = [];

  for (const line of lines) {
    try {
      let config: ProxyConfig;
      if (line.startsWith('vmess://')) {
        config = parseVmess(line);
      } else if (line.startsWith('vless://')) {
        config = parseVless(line);
      } else if (line.startsWith('trojan://')) {
        config = parseTrojan(line);
      } else {
        throw new Error('Unsupported or invalid protocol.');
      }
      results.push({ success: true, config, original: line });
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown parsing error.';
      results.push({ success: false, error: errorMsg, original: line });
    }
  }

  const successfulConfigs = results
    .filter((r): r is ConversionSuccess => r.success)
    .map(r => r.config);

  const yamlOutput = generateYaml(successfulConfigs);
  return { yamlOutput, results };
}


function generateYaml(proxies: ProxyConfig[]): string {
    if (proxies.length === 0) {
        return '';
    }
    const yamlObject = {
        'proxies': proxies
    };
    return jsyaml.dump(yamlObject, { indent: 2, noRefs: true });
}