const { validateConfig } = require('../src/config/validator');
const { loadConfig, loadModel } = require('../src/config/loader');
const registry = require('../src/features/registry');
const { createApp, request } = require('./helpers');

const model = loadModel();
const basica = () => structuredClone(loadConfig('basica', {}));

describe('Validación de configuraciones', () => {
  test('la variante básica es válida', () => {
    expect(validateConfig(basica(), model, registry)).toEqual([]);
  });

  test('no permite deshabilitar una característica obligatoria', () => {
    const config = basica();
    config.features.ventas = false;
    expect(validateConfig(config, model)).toContain('"ventas" es obligatoria y no puede deshabilitarse');
  });

  test('rechaza características que no existen en el modelo', () => {
    const config = basica();
    config.features.inventario = true;
    expect(validateConfig(config, model)).toContain('Característica desconocida: "inventario"');
  });

  test('verifica las dependencias entre características', () => {
    const config = basica();
    config.features.exportacion = true;
    expect(validateConfig(config, model)).toContain('"exportacion" requiere que "reportes" esté habilitada');
  });

  test('rechaza una característica habilitada sin implementación', () => {
    const config = basica();
    config.features.reportes = true;
    expect(validateConfig(config, model, {})).toContain(
      '"reportes" está habilitada pero no tiene implementación registrada',
    );
  });

  test('una variable de entorno inválida impide iniciar la aplicación', () => {
    expect(() => loadConfig('basica', { FEATURE_LOGIN: 'false' })).toThrow(/obligatoria/);
  });
});

describe('Variante básica', () => {
  test('expone solo las características habilitadas', async () => {
    const res = await request(createApp()).get('/api/config');
    expect(res.body.variant).toBe('basica');
    expect(res.body.features).toEqual(['login', 'productos', 'clientes', 'ventas']);
  });

  test('no publica rutas de características deshabilitadas', async () => {
    const res = await request(createApp()).get('/api/reports/summary');
    expect(res.status).toBe(404);
  });
});
