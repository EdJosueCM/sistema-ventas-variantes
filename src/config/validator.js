// Valida una configuración de variante contra el modelo de características.
// Devuelve la lista de errores encontrados (vacía si la configuración es válida).
function validateConfig(config, model, registry = null) {
  const errors = [];

  if (!config || typeof config !== 'object') {
    return ['La configuración debe ser un objeto'];
  }
  if (typeof config.variant !== 'string' || config.variant.trim() === '') {
    errors.push('"variant" es obligatorio');
  }
  if (!config.features || typeof config.features !== 'object') {
    return [...errors, '"features" es obligatorio'];
  }

  const { features } = config;
  const known = Object.keys(model.features);

  for (const name of Object.keys(features)) {
    if (!known.includes(name)) {
      errors.push(`Característica desconocida: "${name}"`);
    }
  }

  for (const [name, definition] of Object.entries(model.features)) {
    const value = features[name];

    if (typeof value !== 'boolean') {
      errors.push(`"${name}" debe declararse como true o false`);
      continue;
    }
    if (definition.type === 'mandatory' && !value) {
      errors.push(`"${name}" es obligatoria y no puede deshabilitarse`);
    }
    if (value) {
      for (const dependency of definition.requires || []) {
        if (features[dependency] !== true) {
          errors.push(`"${name}" requiere que "${dependency}" esté habilitada`);
        }
      }
      if (registry && !registry[name]) {
        errors.push(`"${name}" está habilitada pero no tiene implementación registrada`);
      }
    }
  }

  return errors;
}

module.exports = { validateConfig };
