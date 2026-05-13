#!/usr/bin/env bash
set -euo pipefail

cd /media/ergrato-dev/data/ergrato-dev/bc-channel/bc-cloudflare

WEEKS=(
  "01|la_red_de_cloudflare_y_wrangler|La Red de Cloudflare y Wrangler 3|Etapa 0 — Fundamentos del Edge"
  "02|v8_isolates_y_el_runtime_de_workers|V8 Isolates y el Runtime de Workers|Etapa 0 — Fundamentos del Edge"
  "03|http_avanzado_y_routing_con_hono|HTTP Avanzado y Routing con Hono|Etapa 0 — Fundamentos del Edge"
  "04|workers_kv_y_cache_api|Workers KV y Cache API|Etapa 0 — Fundamentos del Edge"
  "05|d1_sqlite_en_el_edge|D1: SQLite en el Edge|Etapa 1 — Persistencia y Datos"
  "06|r2_object_storage|R2: Object Storage|Etapa 1 — Persistencia y Datos"
  "07|queues_mensajeria_asincrona|Queues: Mensajería Asíncrona|Etapa 1 — Persistencia y Datos"
  "08|durable_objects_estado_consistente|Durable Objects: Estado Consistente en el Edge|Etapa 1 — Persistencia y Datos"
  "09|hyperdrive_y_bases_de_datos_externas|Hyperdrive y Bases de Datos Externas|Etapa 1 — Persistencia y Datos"
  "10|workers_ai_inferencia_sin_gpu|Workers AI: Inferencia sin GPU propia|Etapa 2 — AI en el Edge"
  "11|vectorize_vector_database|Vectorize: Vector Database en el Edge|Etapa 2 — AI en el Edge"
  "12|ai_gateway_proxy_inteligente|AI Gateway: Proxy Inteligente|Etapa 2 — AI en el Edge"
  "13|proyecto_rag_completo|Proyecto RAG Completo|Etapa 2 — AI en el Edge"
  "14|cloudflare_agents|Cloudflare Agents|Etapa 2 — AI en el Edge"
  "15|pages_workers_assets_y_cicd|Pages, Workers Assets y CI/CD|Etapa 3 — Full-Stack Avanzado"
  "16|service_bindings_y_rpc|Service Bindings y RPC|Etapa 3 — Full-Stack Avanzado"
  "17|workers_for_platforms|Workers for Platforms|Etapa 3 — Full-Stack Avanzado"
  "18|workflows_ejecucion_durable|Workflows: Ejecución Durable|Etapa 3 — Full-Stack Avanzado"
  "19|observabilidad_y_testing|Observabilidad y Testing|Etapa 4 — Producción y Plataforma"
  "20|seguridad_en_workers|Seguridad en Workers|Etapa 4 — Producción y Plataforma"
  "21|proyecto_final|Proyecto Final: Plataforma Completa|Etapa 4 — Producción y Plataforma"
)

scaffold_week() {
  local NUM="$1" SLUG="$2" TITULO="$3" ETAPA="$4"
  local DIR="bootcamp/week-${NUM}-${SLUG}"

  mkdir -p "${DIR}/0-assets" \
           "${DIR}/1-teoria" \
           "${DIR}/2-practicas" \
           "${DIR}/3-proyecto/starter" \
           "${DIR}/4-recursos/videografia" \
           "${DIR}/4-recursos/webgrafia" \
           "${DIR}/5-glosario"

  touch "${DIR}/0-assets/.gitkeep" \
        "${DIR}/1-teoria/.gitkeep" \
        "${DIR}/2-practicas/.gitkeep" \
        "${DIR}/3-proyecto/starter/.gitkeep" \
        "${DIR}/4-recursos/videografia/.gitkeep" \
        "${DIR}/4-recursos/webgrafia/.gitkeep"

  # README.md
  printf '# Semana %s — %s\n\n> **%s** · Bootcamp Cloudflare De Cero a Héroe\n\n---\n\n## 🎯 Objetivos\n\n> 🚧 Contenido en desarrollo.\n\n---\n\n## ⏱️ Distribución del tiempo (8h)\n\n| Bloque | Actividad | Horas |\n|--------|-----------|-------|\n| Teoría | Conceptos fundamentales | 2.0h |\n| Práctica | Ejercicios guiados | 3.0h |\n| Proyecto | Proyecto integrador | 2.5h |\n| Recursos | Revisión y referencias | 0.5h |\n\n---\n\n## 🗂️ Contenido\n\n- [📖 Teoría](1-teoria/)\n- [💻 Prácticas](2-practicas/)\n- [📦 Proyecto](3-proyecto/)\n- [📚 Recursos](4-recursos/)\n- [📝 Glosario](5-glosario/)\n- [📊 Rúbrica](rubrica-evaluacion.md)\n\n---\n\n## ✅ Checklist de Entrega\n\n- [ ] Ejercicios completados con Worker deployado\n- [ ] Proyecto adaptado al dominio asignado y deployado\n- [ ] URL de producción Cloudflare entregada\n- [ ] Evidencias del cuestionario completadas\n' \
    "$NUM" "$TITULO" "$ETAPA" > "${DIR}/README.md"

  # rubrica-evaluacion.md
  printf '# Rúbrica de Evaluación — Semana %s\n\n> **%s**\n\n---\n\n## 📊 Distribución de Puntaje\n\n| Tipo | Peso | Mínimo para aprobar |\n|------|------|---------------------|\n| 🧠 Conocimiento (cuestionario) | 30%% | 70%% |\n| 💪 Desempeño (Worker deployado) | 40%% | 70%% |\n| 📦 Producto (proyecto entregado) | 30%% | 70%% |\n\n---\n\n## 🧠 Conocimiento (30%%)\n\n> 🚧 Criterios en desarrollo.\n\n---\n\n## 💪 Desempeño (40%%)\n\n> 🚧 Criterios en desarrollo.\n\n---\n\n## 📦 Producto (30%%)\n\n> 🚧 Criterios en desarrollo.\n\n---\n\n## 📋 Requisitos de Entrega\n\n- URL de producción del Worker (`*.workers.dev` o dominio custom)\n- Código fuente en repositorio personal del aprendiz\n- Worker responde correctamente en producción al momento de revisión\n' \
    "$NUM" "$TITULO" > "${DIR}/rubrica-evaluacion.md"

  # 5-glosario/README.md
  printf '# Glosario — Semana %s\n\n> **%s**\n\nTérminos Cloudflare clave introducidos esta semana, ordenados alfabéticamente.\n\n---\n\n> 🚧 Glosario en desarrollo.\n' \
    "$NUM" "$TITULO" > "${DIR}/5-glosario/README.md"
}

for ENTRY in "${WEEKS[@]}"; do
  IFS='|' read -r NUM SLUG TITULO ETAPA <<< "$ENTRY"
  scaffold_week "$NUM" "$SLUG" "$TITULO" "$ETAPA"
done

echo "Scaffolding completado: $(ls bootcamp/ | wc -l | tr -d ' ') semanas"
