# Plataforma Clínica de Dolor Neuropático

Copia local editable preparada el 2026-10-07 a partir del archivo proporcionado por el usuario. Se conserva el diseño y el contenido científico del prototipo; la revisión científica está pendiente.

## Abrir la aplicación

La vista previa local está en `http://127.0.0.1:5173/`. Si el servidor está detenido, ejecutar `./iniciar.command` desde esta carpeta, o abrir ese archivo con Terminal. Mantener esa ventana abierta mientras se usa la aplicación.

Con Node y pnpm disponibles:

```sh
pnpm install
pnpm dev
```

Los cambios guardados en los componentes se reflejan automáticamente en la vista previa. El servidor escucha exclusivamente en este equipo. La aplicación no se ha publicado.

## Navegar entre herramientas

Al volver a Inicio, **Retomar escenario** conserva los datos ingresados, el plan elegido y las casillas marcadas, incluso si se consultan otras herramientas. El resumen del escenario muestra diagnóstico, edad e intensidad del dolor.

**Editar datos** permite ajustar el perfil y volver a analizarlo. **Nuevo escenario** reinicia los datos y el plan. La conservación se limita a la navegación actual: recargar o cerrar la página reinicia el escenario.

## Archivos para ajustar

- [App.tsx](App.tsx): navegación y estado de la aplicación.
- [HomeScreen.tsx](components/HomeScreen.tsx): pantalla principal.
- [PatientProfileForm.tsx](components/PatientProfileForm.tsx): formulario de escenarios.
- [clinicalAnalysisService.ts](services/clinicalAnalysisService.ts): reglas del análisis.
- [pharmacologyData.ts](services/pharmacologyData.ts): fichas farmacológicas.
- [ClinicalScales.tsx](components/ClinicalScales.tsx): NRS, DN4 y BPI.
- [TitrationGuide.tsx](components/TitrationGuide.tsx): tablas de titulación.
- [PainPathwayExplorer.tsx](components/PainPathwayExplorer.tsx): explorador visual.
- [algorithm.ts](data/algorithm.ts): pasos del algoritmo.
- [guideContent.ts](data/guideContent.ts): síntesis bibliográficas que consulta el asistente.
- [prompts.ts](server/prompts.ts): instrucciones originales del asistente.

## Gemini opcional

Sin una clave, funcionan los escenarios, las fichas, las escalas, la titulación, el algoritmo y el explorador visual. El chat y las explicaciones de IA muestran un aviso de configuración pendiente.

Para conectar Gemini, copiar [.env.example](.env.example) a `.env.local`, completar `GEMINI_API_KEY` y reiniciar el servidor. La clave se lee solo en el servidor local y no se incorpora a los archivos del navegador. Las consultas al asistente se envían a Gemini cuando está configurado. No se ha probado una llamada real al proveedor en esta réplica.

## Cambios de adaptación

- Configuración de instalación, compilación y vista previa con Vite y TypeScript.
- Estilos Tailwind compilados localmente, conservando las clases originales.
- API local para Gemini y funcionamiento del resto de la app sin clave.
- Presentación de texto Markdown sin insertar HTML de respuestas.
- Conservación del archivo original en [original/plataforma-original.zip](original/plataforma-original.zip), con SHA-256 en [original/proveniencia.json](original/proveniencia.json).

El contenido científico y las reglas de tratamiento se conservaron. Los avisos educativos y experimentales del original siguen visibles. La comprobación técnica no equivale a una validación clínica. Por ejemplo, la entrada renal del original es binaria (`ClCr <60`), mientras una regla de duloxetina aplica un umbral de `<30`; esa diferencia requiere revisión antes de cambiar la lógica científica.

## Verificar

```sh
pnpm check
pnpm build
```

Las dependencias quedan fijadas en [pnpm-lock.yaml](pnpm-lock.yaml). Los archivos nuevos permanecen en esta carpeta y no modifican índices, artículos ni resúmenes de la biblioteca. El repositorio de gobernanza de la biblioteca ignora este material docente; no se creó un historial Git separado.
