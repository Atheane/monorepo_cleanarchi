

// We want a npm install in CI.
if (process.env.npm_execpath.indexOf('yarn') === -1 && process.env.USER !== 'vsts') {
 console.error(`
██╗░░░██╗░█████╗░██████╗░███╗░░██╗  ██╗███╗░░██╗░██████╗████████╗░█████╗░██╗░░░░░██╗░░░░░
╚██╗░██╔╝██╔══██╗██╔══██╗████╗░██║  ██║████╗░██║██╔════╝╚══██╔══╝██╔══██╗██║░░░░░██║░░░░░
░╚████╔╝░███████║██████╔╝██╔██╗██║  ██║██╔██╗██║╚█████╗░░░░██║░░░███████║██║░░░░░██║░░░░░
░░╚██╔╝░░██╔══██║██╔══██╗██║╚████║  ██║██║╚████║░╚═══██╗░░░██║░░░██╔══██║██║░░░░░██║░░░░░
░░░██║░░░██║░░██║██║░░██║██║░╚███║  ██║██║░╚███║██████╔╝░░░██║░░░██║░░██║███████╗███████╗
░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝╚═╝░░╚══╝  ╚═╝╚═╝░░╚══╝╚═════╝░░░░╚═╝░░░╚═╝░░╚═╝╚══════╝╚══════╝`);
  console.log(`───────────────────██
              ──────────────────█─██
              ──────────────────█───█
              ──────────────────█───█
              ──────────────────█───█
              ──────────────────█───█
              ──────────────────█───█▓
              ──────────────────█───▓█
              ──────────────────█───░█
              ──────────────────█───░█
              ──────────────────█░░░─█
              ───────────▓███──██▓▓███
              ───────────██──▓██▓────██
              ───────────█▓────█▓─────▓█
              ───────────█▓─────█──────░█
              ██████─────█▓─────█────────█
              ████████▓███░──────█──█▓────█
              █░░░░░░█───────────█░███────█▓
              ▓██████─────────────█▓██────██
              ███████░────────────────────▓█
              ▓██████░────────────────────░█
              ▓██████░────────────────────▓█
              ▓██████░────────────────────█▓
              ▓██████░────────────────────█
              ▓██████░───────────────────██
              ▓███░██░──────────────────█
              ▓███──████████████████████
`)
}
