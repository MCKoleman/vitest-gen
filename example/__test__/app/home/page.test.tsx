import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HomePage } from '@/app/home/page'

test('HomePage', () => {
	render(<HomePage />)
	expect(screen.getByRole('heading', { level: 1, name: 'HomePage' })).toBeDefined()
})
