import * as util from 'util';


export const deepLog = (obj: object) => {
  console.log(util.inspect(obj, false, null, true));
};