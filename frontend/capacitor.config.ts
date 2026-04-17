import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'it.siae.plus',
  appName: 'SIAE+',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
}

export default config
