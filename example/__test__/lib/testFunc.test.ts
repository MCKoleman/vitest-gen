import { expect, test } from 'vitest'
import { TestFunc } from '@/lib/testFunc'

test('TestFunc', () => {
	expect(TestFunc()).equal(0, "TestFunc should return 0")
})
