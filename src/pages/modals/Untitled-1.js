// Función que retorna una promesa después de un cierto tiempo
function examplePromise(value) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, 2000);
  });
}

// Función asíncrona que ejecuta la promesa y espera su resultado
async function ejecutarYEsperarResultado() {
  console.log('Inicio de la función asíncrona');

  try {
    // Utilizando await para esperar la resolución de la promesa
    const resultado = await examplePromise('¡Resultado de la promesa!');
    console.log('Resultado obtenido:', resultado);
    return resultado;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Llamar a la función asíncrona y esperar su resultado
async function ejecutar() {
  try {
    const resultado = await ejecutarYEsperarResultado();
    console.log('Resultado final:', resultado);
  } catch (error) {
    console.error('Error en la ejecución:', error);
  }
}

// Llamar a la función principal
ejecutar();
