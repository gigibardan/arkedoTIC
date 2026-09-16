import arkyIdle from './images/arky_idle.png';
import arkySuccess from './images/arky_success.png';
import arkyError from './images/arky_error.png';
import arkyMaster from './images/arky_master.png';

export type ArkyMascotState = 'idle' | 'success' | 'error' | 'finished';

export const ARKY_IMAGES: Record<ArkyMascotState, string> = {
  idle: arkyIdle,
  success: arkySuccess,
  error: arkyError,
  finished: arkyMaster,
};
