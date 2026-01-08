# mktour - development guidelines

## commands

### development

```bash
bun dev                 # start development server
bun dev:test           # start with test environment
bun dev:local          # start with offline/local database
bun opt                # start with optimizations enabled
```

### building & production

```bash
bun build              # build for production
bun start              # start production server
bun analyze            # analyze bundle size
```

### code quality

```bash
bun check              # run typecheck, lint, and tests
bun lint               # run eslint
bun format             # format with prettier
bun knip               # find unused dependencies/exports
```

### testing

```bash
bun test               # run all tests
bun test path/to/file  # run single test file (e.g., bun test src/tests/glicko2.test.ts)
```

### database

```bash
bun db:push            # generate and run migrations
bun db:drop            # drop database
bun db:studio          # open drizzle studio
bun db:check           # check database schema
bun localdb:*          # same commands but for offline development
```

### other

```bash
bun generate-erd       # generate entity-relationship diagram
bun generate-openapi   # generate openapi specification
```

## code style & conventions

### ui & formatting rules

- no capital letters in ui text at all
- no capital letters in comments
- no unnecessary comments in code
- write everything in lowercase unless technically required

### file structure

- use `src/` as the base directory
- follow next.js 13+ app router conventions
- components in `src/components/` (subdirectories for categories)
- pages in `src/app/[route]/page.tsx`
- api routes in `src/app/api/[...]/route.ts`
- database schema in `src/server/db/schema/`
- utilities in `src/lib/`

### component organization

- `src/components/ui/` only for default shadcn components
- all customized components go in `src/components/ui-custom/`
- never modify shadcn components directly, extend them in ui-custom

### import style

- use absolute imports with `@/` prefix: `import { button } from '@/components/ui/button'`
- order: react → third-party → internal (separated by blank lines)
- use `import type` for type-only imports
- consolidate import paths when possible (vsc organize imports available)

### naming conventions

- **files**: kebab-case (`user-profile.tsx`)
- **components**: pascalcase (`userprofile`)
- **variables/functions**: camelcase (`getuserdata`)
- **constants**: upper_snake_case (`api_base_url`)
- **interfaces/types**: pascalcase with descriptive names (`userdata`)

### typescript & typing system

- strict typing system enforced
- follow single source of truth pattern
- all types relate to database schema
- schema types prefixed with `database` (e.g., `databaseuser`)
- all models defined in `server/db/zod/`
- models are inferred from database schema with necessary modifications
- avoid defining types outside `server/db/zod/` folder
- types are inferred from schemas and exported
- only place to define zod schemas for api (both inputs and outputs)
- definition means inference + modification

### react components

- use functional components with hooks
- server components by default, use "use client" for interactive components
- prefer `cn()` utility for conditional tailwind classes
- use class-variance-authority (cva) for component variants

### styling

- tailwind css as primary styling solution
- follow mobile-first responsive design
- use shadcn/ui components as base, extend with variants
- use css-in-js only when absolutely necessary

### database & api

- drizzle orm with zod schemas for type safety
- trpc for api endpoints with auto-generated types
- separate router files by domain (`user.ts`, `club.ts`, etc.)
- use optimistic updates for better ux
- implement proper error handling with appropriate http status codes

### error handling

- use react-error-boundary for react components
- implement try-catch blocks in api routes
- return appropriate error messages via trpc procedures
- log errors but don't expose sensitive information

### testing

- use bun test runner
- test files end with `.test.ts` or `.test.tsx`
- place tests in `src/tests/` directory
- use mock functions from `bun:test`
- test both happy path and error cases
- setup utilities in `tests/setup/utils.ts`

### internationalization

- use next-intl for translations
- messages in `messages/en.json` and `messages/ru.json`
- use `<formattedmessage />` component for ui text
- format dates with date-fns

### performance

- enable next.js caching where appropriate
- use react.memo for expensive components
- implement loading states with suspense
- optimize images and use next.js image component
- bundle analyzer available with `bun analyze`

### git & commits

- follow conventional commits (see commitlint.config.js)
- types: feat, impr, fix, docs, style, ref, perf, test, build, ci, chore, revert
- subject line: max 100 characters, imperative tense
- body: wrapped at 100 characters
- use `impr` for improvements (instead of `refactor`)

### code quality tools

- eslint with next.js typescript config
- prettier with tailwind plugin
- husky for pre-commit hooks
- knip for unused code detection
- semantic release for versioning

### environment

- use `.env.local` for local development
- separate test environment with `node_env=test`
- database url configuration for online/offline modes
- environment variables validated via zod schemas
