module.exports = {
  // Конфигурация для деплоя
  frontend: {
    buildCommand: 'npm run build',
    outputDir: 'dist',
    environment: process.env.NODE_ENV || 'production'
  },
  supabase: {
    projectId: 'msqyjrpkylernifouxct',
    functions: ['generate-code']
  }
};