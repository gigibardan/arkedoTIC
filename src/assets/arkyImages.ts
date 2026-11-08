import arkyIdle from './images/arky_idle.webp';
import arkySuccess from './images/arky_success.webp';
import arkyError from './images/arky_error.webp';
import arkyMaster from './images/arky_master.webp';

export type ArkyMascotState = 'idle' | 'success' | 'error' | 'finished';

export const ARKY_IMAGES: Record<ArkyMascotState, string> = {
  idle: arkyIdle,
  success: arkySuccess,
  error: arkyError,
  finished: arkyMaster,
};
