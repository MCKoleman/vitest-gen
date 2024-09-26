#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

/**
 * Generates a template component className at filePath
 * @param filePath - Path to write file to
 * @param className - Name of the component to create
 * @returns 0 on success or >0 on failure
 */
function genComponent(filePath: string, className: string): number {
	const content = 
`export const ${className} = () => {
	return (
		<div>
			<h1>${className}</h1>
		</div>
	)
}
` 
	return writeFile(filePath, content)
}

/**
 * Generates a template function className at filePath
 * @param filePath - Path to write file to
 * @param className - Name of the function to create
 * @returns 0 on success or >0 on failure
 */
function genFunction(filePath: string, className: string): number {
	const content =
`export function ${className}() {
	return 0
}
`
	return writeFile(filePath, content)
}

/**
 * Generates a test class at testPath for a template component className at filePath
 * @param filePath - Path that the file is at
 * @param testPath - Path to write test file to
 * @param className - Name of the component created
 * @returns 0 on success or >0 on failure
 */
function genComponentTest(filePath: string, testPath: string, className: string): number {
	const filePathNoExt = filePath.split('.')[0]
	const content = 
`import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ${className} } from '@/${filePathNoExt}'

test('${className}', () => {
	render(<${className} />)
	expect(screen.getByRole('heading', { level: 1, name: '${className}' })).toBeDefined()
})
`
	return writeFile(testPath, content)
}

/**
 * Generates a test class at testPath for a template function className at filePath
 * @param filePath - Path that the file is at
 * @param testPath - Path to write test file to
 * @param className - Name of the function created
 * @returns 0 on success or >0 on failure
 */
function genFunctionTest(filePath: string, testPath: string, className: string): number {
	const filePathNoExt = filePath.split('.')[0]
	const content = 
`import { expect, test } from 'vitest'
import { ${className} } from '@/${filePathNoExt}'

test('${className}', () => {
	expect(${className}()).equal(0, "${className} should return 0")
})
`
	return writeFile(testPath, content)
}

/**
 * Writes the given content to a file at the given directory, creating the directory if needed
 * @param dir - Directory to write file to
 * @param content - Content to write to file
 * @returns 0 on success, 1 on failure
 */
function writeFile(dir: string, content: string): number {
	try {
		fs.mkdirSync(path.dirname(dir), { recursive: true })
		fs.writeFileSync(dir, content, { flag: "w+"})
		return 0
	}
	catch (err)
	{
		console.log(err)
		return 1
	}
}

/**
 * Validates that the given filename is allowed and gets the extension
 * @param fileName - File name to check
 * @returns The file extension (.ts or .tsx) or an empty string if the extension is invalid
 */
function getFileExtension(fileName: string): string {
	const filePathParts = fileName.split(RegExp('[/\\\\]')).filter((part) => part)
	if (filePathParts.length <= 1) {
		console.log("Please provide a path in the filename")
		return ''
	}

	// Check if file extension is valid
	const fileNameParts = filePathParts[filePathParts.length-1].split('.').filter((part) => part)
	const fileExt = fileNameParts[fileNameParts.length-1]

	// Only allow typescript files to be created
	const isFunction = fileExt === "ts"
	const isComponent = fileExt === "tsx"
	if (!fileName || !(isFunction || isComponent) || fileNameParts.length <= 1) {
		console.log("Please provide a valid filename")
		return ''
	}
	return fileExt
}

/**
 * Validates that the given class name is allowed
 * @param className - Class name to check
 * @returns The modified class name or an empty string if it is invalid
 */
function getClassName(className: string): string {
	if (!className) {
		console.log("Please provide a valid className")
		return ''
	}
	return className
}

/**
 * Generates the path and name of a test for a validated filename
 * @param fileName - Filename that is confirmed to be valid
 * @returns The test file location that corresponds to the given filename
 */
function getTestPath(fileName: string): string {
	const filePathParts = fileName.split(RegExp('[/\\\\]')).filter((part) => part)
	const fileNameParts = filePathParts[filePathParts.length-1].split('.').filter((part) => part)
	const fileExt = fileNameParts[fileNameParts.length-1]

	// Combine file name parts into '__test__/path/fileName.test.ts'
	return `__test__/${filePathParts.slice(0, -1).join('/')}/${fileNameParts.slice(0, -1).join('.')}.test.${fileExt}`
}

/**
 * Generate the requested template file and test file
 * @param argv List of arguments, not including `npx vitest-gen`
 * @returns 0 on success, >0 on failure 
 */
function main(argv: string[]): number {
	try {
		// Get file name and extension
		const filePath = argv[0]
		const fileExt = getFileExtension(filePath)
		if (!fileExt) {
			return 1
		}

		// Get test location
		const testPath = getTestPath(filePath)

		// Get className
		const className = getClassName(argv[1])
		if (!className) {
			return 1
		}
		
		console.log(`FileName: ${filePath}, FileExt: ${fileExt}, TestPath: ${testPath}, ClassName: ${className}`)

		// Generate function template and test
		if (fileExt === "ts") {
			if (genFunction(filePath, className)) {
				return 3
			}
			if (genFunctionTest(filePath, testPath, className)) {
				return 3
			}
		}
		// Generate component template and test
		else if (fileExt === "tsx") {
			if (genComponent(filePath, className)) {
				return 3
			}
			if (genComponentTest(filePath, testPath, className)) {
				return 3
			}
		}

		console.log(`Created component ${className} at ${filePath} and matching test at ${testPath}`)
		return 0
	}
	catch (err) {
		console.log(err)
		return 2
	}
}

/**
 * Run main without `npx vitest-gen`
 */
const res = main(process.argv.slice(2))
if (res !== 0) {
	console.log("Usage: npx vitest-gen [path/fileName.ts(x)] [className]")
}