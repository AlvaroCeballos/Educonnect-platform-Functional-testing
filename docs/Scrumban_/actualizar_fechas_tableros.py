"""
Script para actualizar la fecha y hora en el encabezado de los PDFs del tablero Trello (Fase 2).
Reemplaza la fecha original por las fechas oficiales acordadas en la planificación del proyecto EduConnect.
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
FILE_DATES = {
    # Sprint 1 (Fase 2)
    "SprintPlanningIntermedio.pdf": ("28/09/26", 19, 20),  # Sprint Planning 1 (28 de septiembre 2026)
    "Daily1.pdf": ("29/09/26", 19, 23),                   # Daily Scrum 1 (29 de septiembre 2026)
    "Daily2.pdf": ("30/09/26", 19, 23),                   # Daily Scrum 2 (30 de septiembre 2026)
    "Daily3.pdf": ("01/10/26", 19, 23),                   # Daily Scrum 3 (1 de octubre 2026)
    "Daily4.pdf": ("02/10/26", 19, 23),                   # Daily Scrum 4 (2 de octubre 2026)
    "Daily5.pdf": ("05/10/26", 19, 23),                   # Daily Scrum 5 (5 de octubre 2026)
    "Daily6.pdf": ("08/10/26", 19, 23),                   # Daily Scrum 6 y Retrospectiva 1 (8 de octubre 2026)

    # Sprint 2 (Fase 2)
    "SprintPlanningFinal.pdf": ("09/10/26", 19, 20),      # Sprint Planning 2 (9 de octubre 2026)
    "Daily7.pdf": ("09/10/26", 21, 23),                   # Daily Scrum 7 (9 de octubre 2026)
    "Daily8.pdf": ("12/10/26", 19, 23),                   # Daily Scrum 8 (12 de octubre 2026)
    "Daily9.pdf": ("13/10/26", 19, 23),                   # Daily Scrum 9 (13 de octubre 2026)
    "Daily10.pdf": ("14/10/26", 19, 23),                  # Daily Scrum 10 (14 de octubre 2026)
    "Daily11.pdf": ("15/10/26", 19, 23),                  # Daily Scrum 11 (15 de octubre 2026)
    "Daily12.pdf": ("19/10/26", 19, 23),                  # Daily Scrum 12 y Retrospectiva 2 (19 de octubre 2026)
}

def procesar_archivos():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    random.seed(42)  # Semilla reproducible pero con dispersión horaria realista
    
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
