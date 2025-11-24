import { styleText } from 'util';

export function logColor(...msg: (string | number)[]) {
  const messages = msg
    .map(message => styleText(['bgGray', 'whiteBright'], `${message}`))
    .join(' ');
  console.log(styleText('gray', messages));
}