import { ModuleProviderExports } from '@medusajs/framework/types';
import BunnyFileProviderService from './service';

const services = [BunnyFileProviderService];

const providerExport: ModuleProviderExports = {
  services,
};

export default providerExport;