<h1 align="center">
vitest-gen
</h1>
<p align="center">
NPM package for generating <a href="https://github.com/vercel/next.js">Next.JS</a> template files with corresponding <a href="https://github.com/vitest-dev/vitest">Vitest</a> test files
</p>
<p align="center">
  <a href="https://www.npmjs.com/package/vitest-gen"><img src="https://img.shields.io/npm/v/vitest-gen?color=729B1B&label="></a>
<p>

# Features
- Generate both component (.tsx) and function (.ts) template files
- Generate template unit tests matching the directory structure of create files

> vitest-gen requires Vitest >=2.1.1 Node >=v20.0.0

# Examples
## Generate component
```bash
$ npx vitest-gen app/home/page.tsx HomePage
```
```tsx
// app/home/page.tsx
export const HomePage = () => {
  return (
    <div>
      <h1>HomePage</h1>
    </div>
  )
}
```
```tsx
// __test__/app/home/page.test.tsx
import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from '@/app/home/page'

test('HomePage', () => {
  render(<HomePage />)
  expect(screen.getByRole('heading', { level: 1, name: 'HomePage' })).toBeDefined()
})
```

## Generate function
```bash
$ npx vitest-gen lib/testFunc.ts TestFunc
```
```ts
// lib/testFunc.ts
export function TestFunc() {
  return 0
}
```
```ts
// __test__/lib/testFunc.test.ts
import { expect, test } from 'vitest'
import { TestFunc } from '@/lib/testFunc'

test('TestFunc', () => {
  expect(TestFunc()).equal(0, "TestFunc should return 0")
})
```

## License

[MIT](./LICENSE) License © 2024-Present [Kristian Kolehmainen](https://github.com/MCKoleman)
