/**
 * Sprint 26 Test Suite
 * Production Deployment & Enterprise Hardening
 * TGX Waste Coin - PT Jwalita Energi Trenggalek
 */

const http  = require('http');
const fs    = require('fs');
const path  = require('path');

const ROOT    = path.join(__dirname, '../..');
const BACKEND = path.join(ROOT, 'backend');
const DOCS    = path.join(ROOT, 'docs');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}: ${err.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

// ─────────────────────────────────────────────────
// 1. Docker Files
// ─────────────────────────────────────────────────
console.log('\n[1] Docker Infrastructure');

test('docker-compose.yml exists', () => {
  assert(fs.existsSync(path.join(ROOT, 'docker-compose.yml')), 'docker-compose.yml not found');
});

test('docker-compose.yml has required services', () => {
  const content = fs.readFileSync(path.join(ROOT, 'docker-compose.yml'), 'utf8');
  ['postgres', 'redis', 'backend', 'frontend', 'nginx'].forEach(svc => {
    assert(content.includes(`  ${svc}:`), `Service "${svc}" missing from docker-compose.yml`);
  });
});

test('backend/Dockerfile exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'Dockerfile')), 'backend/Dockerfile not found');
});

test('backend/Dockerfile has non-root user', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'Dockerfile'), 'utf8');
  assert(content.includes('adduser'), 'Non-root user not configured in backend Dockerfile');
});

test('frontend/Dockerfile exists', () => {
  assert(fs.existsSync(path.join(ROOT, 'frontend/Dockerfile')), 'frontend/Dockerfile not found');
});

test('nginx/nginx.conf exists', () => {
  assert(fs.existsSync(path.join(ROOT, 'nginx/nginx.conf')), 'nginx/nginx.conf not found');
});

// ─────────────────────────────────────────────────
// 2. Production Environment
// ─────────────────────────────────────────────────
console.log('\n[2] Production Environment');

test('.env.production exists', () => {
  assert(fs.existsSync(path.join(BACKEND, '.env.production')), '.env.production not found');
});

test('.env.production has required variables', () => {
  const content = fs.readFileSync(path.join(BACKEND, '.env.production'), 'utf8');
  ['DATABASE_URL', 'JWT_SECRET', 'CORS_ORIGINS', 'NODE_ENV', 'PORT'].forEach(varName => {
    assert(content.includes(varName), `${varName} missing from .env.production`);
  });
});

// ─────────────────────────────────────────────────
// 3. Security Middleware
// ─────────────────────────────────────────────────
console.log('\n[3] Security Middleware');

test('security.js middleware exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'src/middleware/security.js')), 'security.js not found');
});

test('security.js exports applySecurityMiddleware', () => {
  const mod = require('./middleware/security');
  assert(typeof mod.applySecurityMiddleware === 'function', 'applySecurityMiddleware not exported');
});

test('helmet is installed', () => {
  assert(fs.existsSync(path.join(BACKEND, 'node_modules/helmet')), 'helmet not installed');
});

test('express-rate-limit is installed', () => {
  assert(fs.existsSync(path.join(BACKEND, 'node_modules/express-rate-limit')), 'express-rate-limit not installed');
});

test('security.js has CORS whitelist', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'src/middleware/security.js'), 'utf8');
  assert(content.includes('allowedOrigins'), 'CORS whitelist not found in security.js');
});

test('security.js has auth rate limiter', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'src/middleware/security.js'), 'utf8');
  assert(content.includes('authLimiter'), 'authLimiter not found');
});

// ─────────────────────────────────────────────────
// 4. Logger
// ─────────────────────────────────────────────────
console.log('\n[4] Logger Service');

test('logger.js exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'src/services/logger.js')), 'logger.js not found');
});

test('logger.js exports error handler middleware', () => {
  const logger = require('./services/logger');
  assert(typeof logger.errorHandler === 'function', 'logger.errorHandler not exported');
  assert(typeof logger.requestLogger === 'function', 'logger.requestLogger not exported');
});

test('logger writes JSON format', () => {
  const logger = require('./services/logger');
  // Override console.log to capture output
  let captured = '';
  const orig = console.log;
  console.log = (msg) => { captured = msg; };
  logger.info('test message', { key: 'value' });
  console.log = orig;
  const parsed = JSON.parse(captured);
  assert(parsed.level === 'info', 'level field missing or wrong');
  assert(parsed.message === 'test message', 'message field missing');
  assert(parsed.key === 'value', 'meta fields not included');
});

// ─────────────────────────────────────────────────
// 5. Swagger / API Docs
// ─────────────────────────────────────────────────
console.log('\n[5] Swagger API Documentation');

test('swagger.js config exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'src/config/swagger.js')), 'src/config/swagger.js not found');
});

test('swagger-jsdoc is installed', () => {
  assert(fs.existsSync(path.join(BACKEND, 'node_modules/swagger-jsdoc')), 'swagger-jsdoc not installed');
});

test('swagger-ui-express is installed', () => {
  assert(fs.existsSync(path.join(BACKEND, 'node_modules/swagger-ui-express')), 'swagger-ui-express not installed');
});

test('swagger spec has all required tags', () => {
  const spec = require('./config/swagger');
  const tagNames = (spec.tags || []).map(t => t.name);
  ['Health', 'Auth', 'Waste', 'Wallet', 'Carbon', 'Marketplace', 'AI', 'Executive'].forEach(tag => {
    assert(tagNames.includes(tag), `Swagger tag "${tag}" missing`);
  });
});

test('server.js mounts /api/docs', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'server.js'), 'utf8');
  assert(content.includes('/api/docs'), '/api/docs route not mounted in server.js');
});

// ─────────────────────────────────────────────────
// 6. Health Endpoint (in server.js)
// ─────────────────────────────────────────────────
console.log('\n[6] Health Endpoint');

test('server.js has /api/health endpoint', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'server.js'), 'utf8');
  assert(content.includes('/api/health'), '/api/health not found in server.js');
});

test('/api/health returns required fields in server.js', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'server.js'), 'utf8');
  // Fields appear as object keys (may or may not be quoted)
  ['status', 'database', 'version', 'uptime'].forEach(field => {
    assert(content.includes(field), `Health response missing field: ${field}`);
  });
});

// ─────────────────────────────────────────────────
// 7. Database Migrations
// ─────────────────────────────────────────────────
console.log('\n[7] Database Migrations');

const MIGRATIONS_DIR = path.join(BACKEND, 'database/migrations');

test('migrations directory exists', () => {
  assert(fs.existsSync(MIGRATIONS_DIR), 'database/migrations/ directory not found');
});

const EXPECTED_MIGRATIONS = [
  '001_sprint1_18_core.sql',
  '002_sprint19_marketplace.sql',
  '003_sprint20_gamification.sql',
  '004_sprint21_carbon_assets.sql',
  '005_sprint22_csr.sql',
  '006_sprint23_mobile.sql',
  '007_sprint24_ai.sql',
  '008_sprint25_executive.sql',
];

EXPECTED_MIGRATIONS.forEach(file => {
  test(`Migration file exists: ${file}`, () => {
    assert(fs.existsSync(path.join(MIGRATIONS_DIR, file)), `${file} not found`);
  });
});

test('migrate.js runner exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'database/migrate.js')), 'database/migrate.js not found');
});

test('migrate.js uses BEGIN/COMMIT/ROLLBACK', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'database/migrate.js'), 'utf8');
  assert(content.includes('BEGIN') && content.includes('COMMIT') && content.includes('ROLLBACK'),
    'migrate.js missing transaction handling');
});

// ─────────────────────────────────────────────────
// 8. Backup & Restore Scripts
// ─────────────────────────────────────────────────
console.log('\n[8] Backup & Restore Scripts');

test('backup.ps1 exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'database/backup.ps1')), 'backup.ps1 not found');
});

test('backup.sh exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'database/backup.sh')), 'backup.sh not found');
});

test('restore.ps1 exists', () => {
  assert(fs.existsSync(path.join(BACKEND, 'database/restore.ps1')), 'restore.ps1 not found');
});

test('backup.ps1 has retention policy', () => {
  const content = fs.readFileSync(path.join(BACKEND, 'database/backup.ps1'), 'utf8');
  assert(content.includes('Select-Object -Skip 30') || content.includes('30'), 'Retention policy not found in backup.ps1');
});

// ─────────────────────────────────────────────────
// 9. CI/CD Pipeline
// ─────────────────────────────────────────────────
console.log('\n[9] CI/CD Pipeline');

test('.github/workflows/deploy.yml exists', () => {
  assert(fs.existsSync(path.join(ROOT, '.github/workflows/deploy.yml')), 'deploy.yml not found');
});

test('deploy.yml has test, build, deploy jobs', () => {
  const content = fs.readFileSync(path.join(ROOT, '.github/workflows/deploy.yml'), 'utf8');
  // Check job IDs (lowercase keys in YAML)
  ['test:', 'build:', 'deploy:'].forEach(jobKey => {
    assert(content.includes(jobKey), `Job "${jobKey}" missing from deploy.yml`);
  });
});

test('deploy.yml runs regression tests', () => {
  const content = fs.readFileSync(path.join(ROOT, '.github/workflows/deploy.yml'), 'utf8');
  assert(content.includes('testSprint26.js'), 'Sprint 26 test not in CI pipeline');
});

// ─────────────────────────────────────────────────
// 10. Documentation
// ─────────────────────────────────────────────────
console.log('\n[10] Documentation');

['installation.md', 'architecture.md', 'database.md', 'api.md', 'admin-guide.md', 'user-guide.md'].forEach(doc => {
  test(`docs/${doc} exists`, () => {
    assert(fs.existsSync(path.join(DOCS, doc)), `docs/${doc} not found`);
    const content = fs.readFileSync(path.join(DOCS, doc), 'utf8');
    assert(content.length > 200, `docs/${doc} appears empty or too short`);
  });
});

// ─────────────────────────────────────────────────
// 11. Regression: All Prior Sprint Test Files Exist
// ─────────────────────────────────────────────────
console.log('\n[11] Regression: Prior Sprint Test Files');

[18, 19, 20, 21, 22, 23, 24, 25].forEach(sprint => {
  test(`testSprint${sprint}.js exists`, () => {
    assert(fs.existsSync(path.join(__dirname, `testSprint${sprint}.js`)), `testSprint${sprint}.js not found`);
  });
});

// ─────────────────────────────────────────────────
// Results
// ─────────────────────────────────────────────────
console.log('\n' + '═'.repeat(50));
console.log(`Sprint 26 Test Results: ${passed} PASS, ${failed} FAIL`);
console.log('═'.repeat(50));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n✅ ALL TESTS PASSED - Sprint 26 Production Hardening Complete\n');
}
