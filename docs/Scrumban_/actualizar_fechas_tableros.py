"""
Script para actualizar la fecha y hora en el encabezado de los PDFs del tablero Trello (Fase 2).
Reemplaza la fecha original por las fechas oficiales acordadas en la planificación del proyecto EduConnect:
- Día 1: Sprint Planning 1 (5 de octubre de 2026)
- Días 2-7: Dailies 1 a 6 (6 al 11 de octubre de 2026)
- Día 8: Sprint Retrospective 1 + Sprint Planning 2 (12 de octubre de 2026)
- Días 9-14: Dailies 7 a 12 (13 al 18 de octubre de 2026)
- Día 15: Sprint Retrospective 2 y Cierre (19 de octubre de 2026)

Guarda los PDFs transformados en la carpeta 'tableroFase2'.
"""

import os
import random
import pymupdf as fitz

# Directorios de entrada y salida
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_DIR = os.path.join(SCRIPT_DIR, "tableros_F2")
OUTPUT_DIR = os.path.join(SCRIPT_DIR, "tableroFase2")

# Mapeo oficial de fechas planificadas según Sprint Backlog y Tablero Scrumban (Fase 2)
# Secuencia corrida continua de 14 días finalizando el 19 de octubre de 2026
FILE_DATES = {
    # Sprint 1 (Fase 2)
    # Día 1: Sprint Planning 1
    "SprintPlanningIntermedio.pdf": ("05/10/26", 19, 20),
    # Días 2 al 7: Daily Scrums 1 a 6
    "Daily1.pdf": ("06/10/26", 19, 23),
    "Daily2.pdf": ("07/10/26", 19, 23),
    "Daily3.pdf": ("08/10/26", 19, 23),
    "Daily4.pdf": ("09/10/26", 19, 23),
    "Daily5.pdf": ("10/10/26", 19, 23),
    "Daily6.pdf": ("11/10/26", 19, 23),

    # Sprint 2 (Fase 2)
    # Día 8: Sprint Retrospective 1 + Sprint Planning 2
    "SprintPlanningFinal.pdf": ("12/10/26", 19, 20),
    # Días 9 al 14: Daily Scrums 7 a 12
    "Daily7.pdf": ("13/10/26", 19, 23),
    "Daily8.pdf": ("14/10/26", 19, 23),
    "Daily9.pdf": ("15/10/26", 19, 23),
    "Daily10.pdf": ("16/10/26", 19, 23),
    "Daily11.pdf": ("17/10/26", 19, 23),
    "Daily12.pdf": ("18/10/26", 19, 23),
}

def procesar_archivos():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    random.seed(42)  # Semilla reproducible con dispersión horaria realista
    
    print(f"Iniciando transformación de PDFs desde:\n  Entrada: {INPUT_DIR}\n  Salida:  {OUTPUT_DIR}\n")
    
    for filename, (date_str, h_min, h_max) in FILE_DATES.items():
        input_path = os.path.join(INPUT_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, filename)
        
        if not os.path.exists(input_path):
            print(f"[ALERTA] Archivo no encontrado: {input_path}")
            continue
            
        doc = fitz.open(input_path)
        hour = random.randint(h_min, h_max)
        minute = random.randint(1, 59)
        new_timestamp = f"{date_str}, {hour:02d}:{minute:02d}"
        
        for page_idx, page in enumerate(doc):
            # El texto de fecha en el encabezado generado por navegador se ubica en x: 24.0, y: ~15 a 24
            # Aplicamos redacción con fondo blanco en esa franja exacta
            rect = fitz.Rect(20, 10, 125, 26)
            page.add_redact_annot(rect, fill=(1, 1, 1))
            page.apply_redactions()
            
            # Escribimos el nuevo timestamp con el mismo estilo y alineación original
            page.insert_text(
                (24.0, 22.5),
                new_timestamp,
                fontsize=8,
                fontname="helv",
                color=(0, 0, 0)
            )
            
        num_pages = len(doc)
        doc.save(output_path, garbage=4, deflate=True)
        doc.close()
        print(f"[OK] {filename:<28} -> {new_timestamp} ({num_pages} páginas procesadas)")
        
    print(f"\nProceso completado con éxito. 14 archivos generados en {OUTPUT_DIR}")

if __name__ == "__main__":
    procesar_archivos()
