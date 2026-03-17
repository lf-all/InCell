// lib/pdfExport.ts — Exportação do dashboard como PDF usando jsPDF + html2canvas
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/* =========================================================
   EXPORT DASHBOARD COMPLETO
   ========================================================= */

/**
 * Captura o elemento do dashboard e exporta como PDF A4 horizontal.
 * @param elementId - ID do elemento HTML a capturar
 * @param fileName - Nome do arquivo PDF (sem extensão)
 */
export async function exportDashboardToPDF(
  elementId: string,
  fileName = 'meu-dashboard'
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Elemento #${elementId} não encontrado.`)
  }

  // Salva scroll atual e rola para o topo antes de capturar
  const originalScrollY = window.scrollY
  window.scrollTo(0, 0)

  try {
    const canvas = await html2canvas(element, {
      scale: 2,              // alta resolução
      useCORS: true,
      logging: false,
      backgroundColor: document.documentElement.classList.contains('dark')
        ? '#0f172a'          // slate-900
        : '#f8fafc',         // slate-50
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width / 2, canvas.height / 2],
    })

    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
    pdf.save(`${fileName}.pdf`)
  } finally {
    // Restaura scroll
    window.scrollTo(0, originalScrollY)
  }
}

/* =========================================================
   EXPORT GRÁFICO INDIVIDUAL COMO PNG
   ========================================================= */

/**
 * Captura um gráfico individual e baixa como PNG.
 * @param elementId - ID do elemento do gráfico
 * @param fileName - Nome do arquivo
 */
export async function exportChartToPNG(
  elementId: string,
  fileName = 'grafico'
): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Elemento #${elementId} não encontrado.`)
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: document.documentElement.classList.contains('dark')
      ? '#1e293b'   // slate-800
      : '#ffffff',
  })

  // Cria link de download
  const link = document.createElement('a')
  link.download = `${fileName}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
}
