console.log('🧪 Running tests...')

// Basic test suite
const tests = []

function test(name, fn) {
    tests.push({ name, fn })
}

// Add tests
test('Config loads correctly', () => {
    if (!global.owner) throw new Error('Config not loaded')
})

test('Database structure exists', () => {
    if (!global.db || !global.db.data) throw new Error('Database not initialized')
})

// Run tests
async function runTests() {
    let passed = 0
    let failed = 0

    for (const t of tests) {
        try {
            await t.fn()
            console.log(`✓ ${t.name}`)
            passed++
        } catch (e) {
            console.error(`✗ ${t.name}: ${e.message}`)
            failed++
        }
    }

    console.log(`\n${passed} passed, ${failed} failed`)
}

runTests()
