/// <reference types="vite/client" />

// Declaração para arquivos CSS
declare module '*.css' {
  const content: string
  export default content
}

// Declaração para imagens e outros assets (opcional, mas útil)
declare module '*.png' 
declare module '*.jpg' 
declare module '*.svg' 
