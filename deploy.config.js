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
  },
  docker: {
    registry: process.env.DOCKER_REGISTRY || 'ghcr.io',
    imageName: 'ai-code-generator',
    tag: process.env.GITHUB_SHA || 'latest'
  }
};