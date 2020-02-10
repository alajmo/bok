import Header from '../header/header.ts';
import Navbar from '../navbar/navbar.ts';

export default function() {
  return `
    ${Header}

    ${Navbar}

    ${content}
  `;
}
