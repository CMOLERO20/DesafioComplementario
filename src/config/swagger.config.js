 const swaggerOpts = {
    definition: {
      openapi: "3.0.1",
      info: {
        title: "Documentacion con swagger OPEN API Standard - ECOMMERCE API",
        description: "API de ECOMMERCE, Como usar los endpoints y sus parametros",
        version: "1.0.0",
      },
    },
    apis: [`./src/docs/**/*.yml`],
  };
  
  module.exports = swaggerOpts