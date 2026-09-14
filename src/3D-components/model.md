# Chair ES104 / ES108 – GLB-dokumentation

## 1. Scenöversikt

**Fil:** `chair.glb`  
**Format:** glTF 2.0 Binary (`.glb`)  
**Syfte:** Webbanvändning, exempelvis Three.js / React Three Fiber.

GLB-filen innehåller två huvudmodeller av samma stolssystem:

- `Chair_ES104_Root`
- `Chair_ES108_Root`

De två modellerna ligger på samma produktposition och är avsedda att **visas/döljas (toggle)** på webben beroende på vald modell.

---

## 2. Avsedd användning i konfiguratorn

### ES108

När användaren väljer **ES108** är grundtanken att följande kombination visas som standard:

- `01_Base_metal_ES108`
- `05_Body_ES108`

Armstödet och armstödskudden visas samtidigt

- `02_Armrest_Metal_ES108`
- `06_Metal_Cushion_ES108`

Alternativa val:

- `03_Singel_Armrest_ES108` = alternativ armstödsvariant som ska visas tillsammans med kudde
- `06_Singel_Cushion_ES108` = kudde

- `04_Singel_NOarmrest_ES108` = variant utan armstöd

Vid byte av armstödsvariant ska utvecklaren visa rätt alternativ och dölja de andra armstödsalternativen.
Vid armstödsvariant bör också rätt armstödskudde visas då de har olika höjd berorende på armstödsalternativ

### ES104

ES104 följer samma logik.

Standard

- `01_Base_metal_ES104`
- `05_Body_ES104`

Armstödet

- `02_Armrest_Metal_ES104`
- `06_Metal_Cushion_ES104`

Alternativa val:

- `03_Singel_Armrest_ES104` = alternativ armstödsvariant som ska visas tillsammans med kudde
- `07_Singel_Cushion_ES104` = kudde

- `04_Singel_NOarmrest_ES108` = variant utan armstöd

ES104 har underrede med hjul och skiljer sig därför från ES108 i höjd/underrede.

> **Viktigt:** Objektnamnen ovan är exakt de namn som finns i GLB-filen. Stavningen `Singel` behålls här eftersom dokumentationen ska matcha filens faktiska nodnamn.

---

## 3. Scenhierarki

```text
Scene
├── Chair_ES104_Root
│   ├── 01_Base_metal_W_wheels_ES104
│   ├── 02_Armrest_Metal_ES104
│   ├── 03_Singel_Armrest_ES104
│   └── 04_Singel_NOarmrest_ES104
│   └── 05_Body_ES104
│   └── 06_Metal_Cushion_ES104
│   └── 07_Singel_Cushion_ES104
│
└── Chair_ES108_Root
    ├── 01_Base_metal_ES108
    ├── 02_Armrest_Metal_ES108
    ├── 03_Singel_Armrest_ES108
    └── 04_Singel_NOarmrest_ES108
│   └── 05_Body_ES108
│   └── 06_Metal_Cushion_ES108
│   └── 07_Singel_Cushion_ES108
```

`Chair_ES104_Root` och `Chair_ES108_Root` är root-noder utan egen mesh och fungerar som föräldrar för respektive modell.

---

## 4. Viktiga objekt

| Objekt                         | Typ       | Parent             | Beskrivning                                | Avsedd webbstyrning      |
| ------------------------------ | --------- | ------------------ | ------------------------------------------ | ------------------------ |
| `Chair_ES104_Root`             | Node/Root | Scene              | Root för hela ES104                        | Visa/dölj hela modellen  |
| `01_Base_metal_W_wheels_ES104` | Mesh      | `Chair_ES104_Root` | ES104-underrede med hjul                   | Normalt synlig för ES104 |
| `02_Armrest_Metal_ES104`       | Mesh      | `Chair_ES104_Root` | Standard armstöds-/metallvariant           | Visa/dölj                |
| `03_Singel_Armrest_ES104`      | Mesh      | `Chair_ES104_Root` | Alternativ armstödsvariant                 | Visa/dölj                |
| `04_Singel_NOarmrest_ES104`    | Mesh      | `Chair_ES104_Root` | Variant utan armstöd                       | Visa/dölj                |
| `05_Body_ES104`                | Mesh      | `Chair_ES104_Root` | Sätet för stolen                           | Visa/dölj                |
| `06_Metal_Cushion_ES104`       | Mesh      | `Chair_ES104_Root` | Kudde för standard armstöds-/metallvariant | Visa/dölj                |
| `07_Singel_Cushion_ES104`      | Mesh      | `Chair_ES104_Root` | Kudde för alternativ armstödsvariant       | Visa/dölj                |
| `Chair_ES108_Root`             | Node/Root | Scene              | Root för hela ES108                        | Visa/dölj hela modellen  |
| `01_Base_metal_ES108`          | Mesh      | `Chair_ES108_Root` | ES108-underrede utan hjul                  | Normalt synlig för ES108 |
| `02_Armrest_Metal_ES108`       | Mesh      | `Chair_ES108_Root` | Standard armstöds-/metallvariant           | Visa/dölj                |
| `03_Singel_Armrest_ES108`      | Mesh      | `Chair_ES108_Root` | Alternativ armstödsvariant                 | Visa/dölj                |
| `04_Singel_NOarmrest_ES108`    | Mesh      | `Chair_ES108_Root` | Variant utan armstöd                       | Visa/dölj                |
| `05_Body_ES108`                | Mesh      | `Chair_ES108_Root` | Sätet för stolen                           | Visa/dölj                |
| `06_Metal_Cushion_ES108`       | Mesh      | `Chair_ES108_Root` | Kudde för standard armstöds-/metallvariant | Visa/dölj                |
| `07_Singel_Cushion_ES108`      | Mesh      | `Chair_ES108_Root` | Kudde för alternativ armstödsvariant       | Visa/dölj                |

---

## 5. Rekommenderad toggle-logik

### Växla huvudmodell

Endast en huvudmodell bör normalt vara synlig åt gången:

```js
const es104 = model.getObjectByName("Chair_ES104_Root");
const es108 = model.getObjectByName("Chair_ES108_Root");

es104.visible = true;
es108.visible = false;
```

För ES108 görs motsatsen.

### Armstödsalternativ

Exempel för ES108:

```js
const standardArmrest = model.getObjectByName("02_Armrest_Metal_ES108");
const singleArmrest = model.getObjectByName("03_Singel_Armrest_ES108");
const noArmrest = model.getObjectByName("04_Singel_NOarmrest_ES108");

// Exempel: standard
standardArmrest.visible = true;
singleArmrest.visible = false;
noArmrest.visible = false;
```

Samma princip kan användas för ES104.

---

## 6. Material och texturer

Följande material identifierades i GLB-filen:

- `metal_chrome.001`
- `metal_asphalt`
- `metal_chrome.002`
- `Black_plastic_Wheels.001`
- `metal_chrome.004`
- `metal_chrome.005`
- `velvet_green`
- `velvet_cream`
- `velvet_earth`
- `fabric_green`
- `fabric_cream`
- `fabric_earth`
- `leather_green`
- `leather_cream`
- `leather_earth`

Följande material varianter finns för `05_Body_ES104`, `06_Metal_Cushion_ES104`, `07_Singel_Cushion_ES104`, `05_Body_ES108`, `06_Metal_Cushion_ES108` och `07_Singel_Cushion_ES108`:

- `velvet_green`
- `velvet_cream`
- `velvet_earth`
- `fabric_green`
- `fabric_cream`
- `fabric_earth`
- `leather_green`
- `leather_cream`
- `leather_earth`

och anger material med samma namn.

Filen använder PBR-material enligt glTF-formatet.

Identifierade inbäddade texturer:

- `DefaultMaterial_Normal`
- `DefaultMaterial_Metallic.png-DefaultMaterial_Roughness.png`

`Black_plastic_Wheels.001` använder normal texture samt metallic/roughness-textur.

GLB-filen använder bland annat glTF-extensionerna:

- `KHR_materials_clearcoat`
- `KHR_materials_specular`
- `KHR_texture_transform`
- `KHR_materials_variants`

`KHR_texture_transform` och `KHR_materials_variants` är markerad som required i filen och bör därför stödjas av den renderer som används.

---

## 7. Animationer

Inga animationer identifierades i GLB-filen.

**Antal animationer:** 0

Det finns därför inga NLA-animationer eller animation clips som webbutvecklaren behöver trigga i denna version.

---

## 8. Kameror och ljus

Inga exporterade kameror eller ljus identifierades i GLB-filen.

Webbapplikationen behöver därför själv sätta upp:

- kamera
- ljussättning
- HDRI/environment om det används
- exposure och eventuell tone mapping

---

## 9. Interaktiva objekt

Följande interaktivitet är avsedd enligt projektets konfiguratorlogik:

1. `Chair_ES104_Root` och `Chair_ES108_Root` ska kunna togglas.
2. Armstödsvarianter ska kunna visas/döljas inom vald huvudmodell.
3. Endast relevant variant ska vara synlig åt gången.

Ingen klick-, rotations- eller animationsinteraktion är inbyggd direkt i GLB-filen. Den logiken implementeras i webbkoden.

---

## 10. Filinformation

| Egenskap                        |                    Värde |
| ------------------------------- | -----------------------: |
| Filformat                       | glTF 2.0 Binary (`.glb`) |
| Filstorlek                      |             ca 114.2 MiB |
| Scener                          |                        1 |
| Noder                           |                       10 |
| Meshes                          |                       16 |
| Material                        |                       15 |
| Texturer                        |                       ?? |
| Images                          |                        2 |
| Animationer                     |                        0 |
| Root-noder för produktvarianter |                        2 |
| Trianglar totalt                |                  259 828 |

GLB-filen skapades med Blender glTF-exporter (`Khronos glTF Blender I/O v5.0.21`).

---

## 11. Test och kontroll

GLB-filen har kontrollerats utanför Blender i webbaserad viewer.

Vid test visas båda modellerna samtidigt som standard eftersom båda root-noderna finns i filen och är synliga. Detta är förväntat. Webbimplementeringen ska styra vilken root och vilka alternativ som är synliga.

Hierarkin `Chair_ES104_Root` och `Chair_ES108_Root` har verifierats i Scene Explorer.

---

## 12. Viktigt för webbutvecklaren

- Använd de **exakta nodnamnen** när objekt hämtas via JavaScript.
- `Chair_ES104_Root` och `Chair_ES108_Root` är de viktigaste toppnoderna.
- De två huvudmodellerna ligger i samma GLB för att kunna togglas.
- ES104 och ES108 har olika underrede och ska inte behandlas som enbart materialvariationer.
- Sitt- och ryggdynor är inte slutliga delar av denna GLB-leverans.
- Variantobjekten ligger kvar som separata meshes för att kunna visas/döljas.
- Renderern bör stödja `KHR_texture_transform` och `KHR_materials_variants`, eftersom extensionen krävs av filen.
- Kamera, ljus och environment behöver hanteras i webbapplikationen.

---

## Sammanfattning för webbutvecklaren

`chair.glb` innehåller två produktvarianter under separata root-noder: `Chair_ES104_Root` och `Chair_ES108_Root`. Dessa är avsedda att togglas från webben. Inom respektive modell finns en bas samt tre armstöds-/konfigurationsobjekt som kan visas och döljas beroende på användarens val. ES104 använder underrede med hjul medan ES108 använder underrede utan hjul. Filen innehåller inga animationer, kameror eller ljus; dessa funktioner hanteras i webbapplikationen.
