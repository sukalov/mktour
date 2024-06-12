- **/[root]** - config files
- **/docs** - internal descriptive files on project
- **/public** - static assets (`.png`, `.ico`...)
- **/src** - source code of the app
  - **/app** - ONLY next.js reserved files
  - **/lib** — FUNCTIONS
    - **/actions** - ts files marked with 'use server'
    - **/helpers** - ts files not marked with 'use server'
  - **/components** — ALL files returning `.tsx` except reserved by next.js routing
    - **/hooks** - react client functions (filenames start with `use-`)
  - **/styles** - (`.css` only)
  - **/types** - (`.d.ts` only)