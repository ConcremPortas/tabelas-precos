// ── CHANNELS ──────────────────────────────────────────────────
const CHANNELS = {
  fabrica:       { label: 'Fábrica',                 mult: 1.00, cls: 'ch-fabrica' },
  distribuidora: { label: 'Distribuidora (15%)',  mult: 1.15, cls: 'ch-distribuidora' },
  dag:           { label: 'DAG (30%)',                     mult: 1.30, cls: 'ch-dag' },
  elo:           { label: 'ELO Distribuidora',        mult: 1.00, cls: 'ch-elo' },
  suframa:       { label: 'ELO Suframa',              mult: 1.024, cls: 'ch-suframa' },
};

// ── PORTAS LACCA DATA ─────────────────────────────────────────
const portasLaccaData = {
  fabrica: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [194.58, 223.04, 251.51, 313.14, 396.37] },
            { linha: 'SARRAFO 6mm',           p: [205.15, 235.39, 265.62, 330.8, 418.78] },
            { linha: 'SÓLIDA',                p: [294.85, 323.31, 351.78, 413.42, 496.64] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [223.43, 256.11, 288.8, 359.58, 455.16] },
            { linha: 'SARRAFO 6mm',           p: [235.56, 270.3, 305.01, 379.86, 480.88] },
            { linha: 'SÓLIDA',                p: [323.71, 356.38, 389.07, 459.85, 555.43] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [233.49, 267.63, 301.15, 375.77, 475.63] },
            { linha: 'SARRAFO 6mm',           p: [246.16, 282.46, 318.73, 396.94, 502.52] },
            { linha: 'SÓLIDA',                p: [333.76, 367.9, 401.42, 476.04, 575.9] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [215.31, 247.24, 279.18, 347.73, 440.3] },
            { linha: 'SARRAFO 6mm',           p: [225.88, 259.58, 293.3, 365.37, 462.7] },
            { linha: 'SÓLIDA',                p: [315.58, 347.52, 379.45, 448, 540.57] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [247.22, 283.92, 320.57, 399.3, 505.58] },
            { linha: 'SARRAFO 6mm',           p: [259.36, 298.07, 336.79, 419.56, 531.32] },
            { linha: 'SÓLIDA',                p: [347.5, 384.19, 420.85, 499.58, 605.86] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [258.34, 296.68, 334.99, 417.27, 528.33] },
            { linha: 'SARRAFO 6mm',           p: [271.04, 311.49, 351.94, 438.43, 555.22] },
            { linha: 'SÓLIDA',                p: [358.61, 396.96, 435.27, 517.55, 628.6] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'SARRAFO 6mm', p: [329.63, 380.34, 431.07, 537.48, 681.17] },
            { linha: 'SÓLIDA',     p: [429.9, 480.62, 531.34, 637.75, 781.44] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'SARRAFO 6mm', p: [346.98, 400.36, 453.76, 565.77, 717.02] },
            { linha: 'SÓLIDA',     p: [447.25, 500.63, 554.03, 666.04, 817.29] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'SARRAFO 6mm', p: [364.33, 420.38, 476.44, 594.06, 752.87] },
            { linha: 'SÓLIDA',     p: [464.6, 520.65, 576.72, 694.33, 853.15] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 87.08 },
      { item: 'Borracha',            p: 22.00 },
      { item: 'Frizos nas Portas',   p: 26.59 },
      { item: 'Furo Universal',      p: 26.00 },
      { item: 'Fechadura Soprano',   p: 42.00 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',          p:   5.68 },
      { item: 'Dob. Sobrepor',             p:   8.33 },
      { item: 'Dob. Pado Rolamento',       p:  11.11 },
      { item: 'Visor / Veneziana',         p: 135.00 },
      { item: 'Painel 1 Lado / Bandeira',  p: 118.00 },
    ]
  },
  distribuidora: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [223.77, 256.5, 289.24, 360.11, 455.83] },
            { linha: 'SARRAFO 6mm',           p: [235.92, 270.7, 305.46, 380.42, 481.6] },
            { linha: 'SÓLIDA',                p: [339.08, 371.81, 404.55, 475.43, 571.14] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / CAPUCCINO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [256.94, 294.53, 332.12, 413.52, 523.43] },
            { linha: 'SARRAFO 6mm',           p: [270.89, 310.84, 350.76, 436.84, 553.01] },
            { linha: 'SÓLIDA',                p: [372.27, 409.84, 447.43, 528.83, 638.74] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [268.51, 307.77, 346.32, 432.14, 546.97] },
            { linha: 'SARRAFO 6mm',           p: [283.08, 324.83, 366.54, 456.48, 577.9] },
            { linha: 'SÓLIDA',                p: [383.82, 423.08, 461.63, 547.45, 662.29] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [247.61, 284.33, 321.06, 399.89, 506.35] },
            { linha: 'SARRAFO 6mm',           p: [259.76, 298.52, 337.29, 420.18, 532.1] },
            { linha: 'SÓLIDA',                p: [362.92, 399.65, 436.37, 515.2, 621.66] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [284.3, 326.51, 368.66, 459.2, 581.42] },
            { linha: 'SARRAFO 6mm',           p: [298.26, 342.78, 387.31, 482.49, 611.02] },
            { linha: 'SÓLIDA',                p: [399.62, 441.82, 483.98, 574.52, 696.74] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [297.09, 341.18, 385.24, 479.86, 607.58] },
            { linha: 'SARRAFO 6mm',           p: [311.7, 358.21, 404.73, 504.19, 638.5] },
            { linha: 'SÓLIDA',                p: [412.4, 456.5, 500.56, 595.18, 722.89] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MEL LACCA BIANCO', tipo: 'bianco', itens: [
            { linha: 'SARRAFO 6mm', p: [379.07, 437.39, 495.73, 618.1, 783.35] },
            { linha: 'SÓLIDA',     p: [494.38, 552.71, 611.04, 733.41, 898.66] },
          ]},
          { nome: 'MEL LACCA FENDI / GRAFITE / NERO / BLUE E GREEN', tipo: 'multi', itens: [
            { linha: 'SARRAFO 6mm', p: [399.03, 460.41, 521.82, 650.64, 824.57] },
            { linha: 'SÓLIDA',     p: [514.34, 575.72, 637.13, 765.95, 939.88] },
          ]},
          { nome: 'LACCA PET BLANCO', tipo: 'pet', itens: [
            { linha: 'SARRAFO 6mm', p: [418.98, 483.44, 547.91, 683.17, 865.8] },
            { linha: 'SÓLIDA',     p: [534.29, 598.75, 663.23, 798.48, 981.12] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 113.20 },
      { item: 'Borracha',            p:  28.60 },
      { item: 'Frizos nas Portas',   p:  34.57 },
      { item: 'Furo Universal',      p:  33.80 },
      { item: 'Fechadura Soprano',   p:  54.60 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',          p:   7.38 },
      { item: 'Dob. Sobrepor',             p:  10.83 },
      { item: 'Dob. Pado Rolamento',       p:  14.44 },
      { item: 'Visor / Veneziana',         p: 175.50 },
      { item: 'Painel 1 Lado / Bandeira',  p: 153.40 },
    ]
  },
};
portasLaccaData.dag = {
  colecoes: portasLaccaData.fabrica.colecoes.map(function (c) {
    return { nome: c.nome, sub: c.sub, grupos: c.grupos.map(function (g) {
      return { nome: g.nome, tipo: g.tipo, itens: g.itens.map(function (it) {
        return { linha: it.linha, p: it.p.map(function (v) { return +(v * 1.30).toFixed(2); }) };
      }) };
    }) };
  }),
  adicionais: portasLaccaData.distribuidora.adicionais,
  ferragens: portasLaccaData.distribuidora.ferragens,
};

// ── PORTAS ELO DATA (estrutura PDF: COLMEIA, CURUPIXA/BRANCO · ELO Distribuidora base) ──
const portasELOData = {
  colecoes: [
    {
      nome: 'ELO / SUFRAMA', sub: 'COLMEIA — Sarrafo 3mm · HDF Superflora',
      grupos: [
        { nome: 'ELO CURUPIXA', tipo: 'curupixa', itens: [
          { linha: 'COLMEIA — SARRAFO 3mm', p: [215.04, 215.04, 215.04, 261.37, 330.58, 380.18] },
        ]},
        { nome: 'ELO BRANCO', tipo: 'bianco', itens: [
          { linha: 'COLMEIA — SARRAFO 3mm', p: [221.49, 221.49, 221.49, 269.21, 340.50, 391.58] },
        ]},
      ]
    },
  ],
  adicionais: [
    { item: 'Montagem / Usinagem', p:  84.00 },
    { item: 'Borracha',            p:  10.47 },
    { item: 'Frizos nas Portas',   p:  29.32 },
    { item: 'Furo Universal',      p:  28.67 },
    { item: 'Fechadura Soprano',   p:  44.10 },
  ],
  ferragens: [
    { item: 'Dobradiça Comum',         p:   5.96 },
    { item: 'Dob. Sobrepor',            p:   6.30 },
    { item: 'Dob. Pado Rolamento',      p:  11.67 },
    { item: 'Visor / Veneziana',        p: 148.84 },
    { item: 'Painel 1 Lado / Bandeira', p: 130.10 },
  ],
};

// ── BATENTE / ALIZAR / KIT ELO DATA (ELO Distribuidora base · mult do canal no render) ──
const eloAcabBase = {
  batente: {
    title: 'Batente ELO', subtitle: '30mm MDF Superflora',
    grupos: [
      { label: '5,5 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 101.94, protect: 123.49 },
        { acab: 'ELO CURUPIXÁ', preco: 105.00, protect: 126.55 },
      ]},
      { label: '6,5 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 114.17, protect: 135.73 },
        { acab: 'ELO CURUPIXÁ', preco: 117.59, protect: 139.15 },
      ]},
      { label: '7,5 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 127.87, protect: 149.43 },
        { acab: 'ELO CURUPIXÁ', preco: 131.71, protect: 153.26 },
      ]},
      { label: '8,5 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 143.21, protect: 183.79 },
        { acab: 'ELO CURUPIXÁ', preco: 147.51, protect: 188.08 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 160.40, protect: 200.97 },
        { acab: 'ELO CURUPIXÁ', preco: 165.21, protect: 205.78 },
      ]},
      { label: '12 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 179.65, protect: 232.90 },
        { acab: 'ELO CURUPIXÁ', preco: 185.04, protect: 238.29 },
      ]},
      { label: '14/15 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 224.56, protect: 277.82 },
        { acab: 'ELO CURUPIXÁ', preco: 231.30, protect: 284.55 },
      ]},
      { label: '18 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 251.51, protect: 317.44 },
        { acab: 'ELO CURUPIXÁ', preco: 259.05, protect: 324.98 },
      ]},
      { label: '21 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 281.69, protect: 347.62 },
        { acab: 'ELO CURUPIXÁ', preco: 290.14, protect: 356.07 },
      ]},
    ]
  },
  alizar9: {
    title: 'Alizar ELO — 9mm', subtitle: 'Lamela 3mm MDF Superflora',
    grupos: [
      { label: '5×5',  itens: [
        { acab: 'ELO BRANCO',   preco:  97.19, protect: 120.00 },
        { acab: 'ELO CURUPIXÁ', preco: 100.10, protect: 122.92 },
      ]},
      { label: '5×7',  itens: [
        { acab: 'ELO BRANCO',   preco: 103.02, protect: 125.83 },
        { acab: 'ELO CURUPIXÁ', preco: 106.11, protect: 128.92 },
      ]},
      { label: '5×10', itens: [
        { acab: 'ELO BRANCO',   preco: 114.66, protect: 137.48 },
        { acab: 'ELO CURUPIXÁ', preco: 118.10, protect: 140.92 },
      ]},
      { label: '7×5',  itens: [
        { acab: 'ELO BRANCO',   preco: 115.75, protect: 138.57 },
        { acab: 'ELO CURUPIXÁ', preco: 119.22, protect: 142.04 },
      ]},
      { label: '7×10', itens: [
        { acab: 'ELO BRANCO',   preco: 128.82, protect: 151.64 },
        { acab: 'ELO CURUPIXÁ', preco: 132.69, protect: 155.51 },
      ]},
      { label: '10×5', itens: [
        { acab: 'ELO BRANCO',   preco: 130.05, protect: 152.87 },
        { acab: 'ELO CURUPIXÁ', preco: 133.95, protect: 156.77 },
      ]},
    ]
  },
  alizar15: {
    title: 'Alizar ELO — 15mm', subtitle: 'Lamela 3mm MDF Superflora',
    grupos: [
      { label: '5,5 cm', itens: [
        { acab: 'ELO BRANCO',   preco: 129.26, protect: 152.07 },
        { acab: 'ELO CURUPIXÁ', preco: 133.13, protect: 155.95 },
      ]},
      { label: '5×10', itens: [
        { acab: 'ELO BRANCO',   preco: 145.23, protect: 168.04 },
        { acab: 'ELO CURUPIXÁ', preco: 149.58, protect: 172.40 },
      ]},
      { label: '7×5',  itens: [
        { acab: 'ELO BRANCO',   preco: 147.99, protect: 170.80 },
        { acab: 'ELO CURUPIXÁ', preco: 152.43, protect: 175.24 },
      ]},
      { label: '7×10', itens: [
        { acab: 'ELO BRANCO',   preco: 166.26, protect: 189.07 },
        { acab: 'ELO CURUPIXÁ', preco: 171.24, protect: 194.06 },
      ]},
      { label: '10×5', itens: [
        { acab: 'ELO BRANCO',   preco: 169.43, protect: 192.24 },
        { acab: 'ELO CURUPIXÁ', preco: 174.51, protect: 197.33 },
      ]},
      { label: '10×10', itens: [
        { acab: 'ELO BRANCO',   preco: 231.27, protect: 254.09 },
        { acab: 'ELO CURUPIXÁ', preco: 238.21, protect: 261.03 },
      ]},
    ]
  },
  kitCorrer: {
    title: 'Kit Porta de Correr ELO',
    itens: [
      { item: 'Suporte Correr + Vista — Todos os padrões', preco: 350.96 },
      { item: 'Trilho, Roldana e Guia',                     preco: 162.19 },
      { item: 'Usinagem',                                   preco:  68.42 },
      { item: 'Caixa',                                      preco:  16.54 },
    ]
  },
};

// ── BAT. / ALIZAR / RODAPÉ LACCA DATA (base Fábrica — mult aplicado no render) ──
const laccaAcabBase = {
  batente: {
    title: 'Batente LACCA', subtitle: '30mm MDF Superflora',
    grupos: [
      { label: '5,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco:  109.08, protect: 127.82 },
        { acab: 'LACCA PET BLANCO',                      preco: 113.98, protect: 132.72 },
      ]},
      { label: '6,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 120.94, protect: 139.69 },
        { acab: 'LACCA PET BLANCO',                      preco: 126.38, protect: 145.12 },
      ]},
      { label: '7,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 132.73, protect: 151.47 },
        { acab: 'LACCA PET BLANCO',                      preco: 138.69, protect: 157.44 },
      ]},
      { label: '8,5 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 148.96, protect: 184.24 },
        { acab: 'LACCA PET BLANCO',                      preco: 155.65, protect: 190.93 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 165.2, protect: 200.48 },
        { acab: 'LACCA PET BLANCO',                      preco: 172.62, protect: 207.9 },
      ]},
      { label: '12 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 196.25, protect: 242.55 },
        { acab: 'LACCA PET BLANCO',                      preco: 205.08, protect: 251.38 },
      ]},
      { label: '14 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 247.02, protect: 293.32 },
        { acab: 'LACCA PET BLANCO',                      preco: 258.13, protect: 304.43 },
      ]},
      { label: '18 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 301.15, protect: 358.48 },
        { acab: 'LACCA PET BLANCO',                      preco: 314.7, protect: 372.03 },
      ]},
      { label: '21 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 381.35, protect: 438.68 },
        { acab: 'LACCA PET BLANCO',                      preco: 398.51, protect: 455.84 },
      ]},
    ]
  },
  alizar9: {
    title: 'Alizar LACCA — 9mm', subtitle: 'Lamela 3mm MDF Superflora',
    grupos: [
      { label: '5×5',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 124.85, protect: 144.69 },
        { acab: 'LACCA PET BLANCO',                      preco: 130.45, protect: 150.29 },
      ]},
      { label: '5×7',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 133.24, protect: 153.08 },
        { acab: 'LACCA PET BLANCO',                      preco: 139.23, protect: 159.08 },
      ]},
      { label: '5×10',         itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 148.71, protect: 168.55 },
        { acab: 'LACCA PET BLANCO',                      preco: 155.4, protect: 175.24 },
      ]},
      { label: '7×5',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 150.91, protect: 170.76 },
        { acab: 'LACCA PET BLANCO',                      preco: 157.7, protect: 177.55 },
      ]},
      { label: '7×7',          itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 158.11, protect: 177.95 },
        { acab: 'LACCA PET BLANCO',                      preco: 165.22, protect: 185.07 },
      ]},
      { label: '7×10',         itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 173.92, protect: 193.77 },
        { acab: 'LACCA PET BLANCO',                      preco: 181.74, protect: 201.59 },
      ]},
      { label: '10×5',         itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 173.32, protect: 191.32 },
        { acab: 'LACCA PET BLANCO',                      preco: 181.11, protect: 199.11 },
      ]},
      { label: '3cm Pinado',   itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco:  65.27, protect:  83.27 },
        { acab: 'LACCA PET BLANCO',                      preco:  92.02, protect: 110.02 },
      ]},
      { label: '5×2 (Drywall)', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco:  92.02, protect: 110.02 },
        { acab: 'LACCA PET BLANCO',                      preco:  92.02, protect: 110.02 },
      ]},
      { label: '10×10',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 236.58, protect: 254.58 },
        { acab: 'LACCA PET BLANCO',                      preco: 247.22, protect: 265.22 },
      ]},
    ]
  },
  alizar15: {
    title: 'Alizar LACCA — 15mm', subtitle: 'Lamela 3mm MDF Superflora',
    grupos: [
      { label: '5×5',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 166.98, protect: 186.83 },
        { acab: 'LACCA PET BLANCO',                      preco: 174.49, protect: 194.34 },
      ]},
      { label: '5×7',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 173.72, protect: 193.57 },
        { acab: 'LACCA PET BLANCO',                      preco: 181.54, protect: 201.38 },
      ]},
      { label: '5×10',       itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 189.48, protect: 209.33 },
        { acab: 'LACCA PET BLANCO',                      preco: 198, protect: 217.85 },
      ]},
      { label: '7×5',        itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 184.3, protect: 204.15 },
        { acab: 'LACCA PET BLANCO',                      preco: 192.6, protect: 212.44 },
      ]},
      { label: '7×10',       itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 209.28, protect: 229.12 },
        { acab: 'LACCA PET BLANCO',                      preco: 218.69, protect: 238.53 },
      ]},
      { label: '10×5',       itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 231.77, protect: 251.61 },
        { acab: 'LACCA PET BLANCO',                      preco: 242.19, protect: 262.03 },
      ]},
      { label: '10×10',      itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 316.36, protect: 336.21 },
        { acab: 'LACCA PET BLANCO',                      preco: 330.58, protect: 350.43 },
      ]},
      { label: '3cm Pinado', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 110.56, protect: 130.4 },
      ]},
      { label: '7 Plus',     itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', preco: 240.67, protect: 260.51 },
        { acab: 'LACCA PET BLANCO',                      preco: 251.49, protect: 271.33 },
      ]},
    ]
  },
  rodape: {
    title: 'Rodapé LACCA', subtitle: '15mm × 2,40m MDF Superflora',
    grupos: [
      { label: '5 cm',  itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 29.65, precoMl: 12.35 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 30.98, precoMl: 12.91 },
      ]},
      { label: '7 cm',  itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 36.76, precoMl: 15.32 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 38.4, precoMl: 16 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 52.07, precoMl: 21.7 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 54.41, precoMl: 22.67 },
      ]},
      { label: '15 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 61.88, precoMl: 25.78 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 64.66, precoMl: 26.94 },
      ]},
      { label: '20 cm', itens: [
        { acab: 'FENDI / GRAFITE / NERO / BLUE E GREEN', precoRegua: 94.8, precoMl: 39.5 },
        { acab: 'LACCA PET BLANCO',                      precoRegua: 99.07, precoMl: 41.28 },
      ]},
    ]
  },
  kitCorrer: {
    title: 'Kit Porta de Correr LACCA',
    itens: [
      { item: 'Suporte Correr + Vista (5×3 — 2,40m) Semi Montado — Melamínico todos padrões', preco: 368.41 },
      { item: 'Trilho, Roldana e Guia',                                                         preco: 141.03 },
    ]
  },
};

// ── BAT. / ALIZAR / RODAPÉ MELAMÍNICO DATA (base Fábrica — mult aplicado no render) ──
const melamAcabBase = {
  batente: {
    title: 'Batente Melamínico', subtitle: '30mm MDF Superflora',
    grupos: [
      { label: '5,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco:  97.26, protect: 116.01 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco:  104.34, protect: 123.08 },
      ]},
      { label: '6,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco:  107.85, protect: 126.59 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 115.61, protect: 134.35 },
      ]},
      { label: '7,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 118.34, protect: 137.08 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 126.85, protect: 145.6 },
      ]},
      { label: '8,5 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 132.83, protect: 168.11 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 143.82, protect: 179.1 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 147.31, protect: 182.59 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 160.79, protect: 196.07 },
      ]},
      { label: '12 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 174.99, protect: 221.29 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 187.14, protect: 233.44 },
      ]},
      { label: '14 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 220.26, protect: 266.56 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 235.42, protect: 281.72 },
      ]},
      { label: '18 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 268.52, protect: 325.85 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 286.45, protect: 343.78 },
      ]},
      { label: '21 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 340.06, protect: 397.39 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 363.1, protect: 420.43 },
      ]},
    ]
  },
  alizar9: {
    title: 'Alizar Melamínico — 9mm', subtitle: 'MDF Superflora',
    grupos: [
      { label: '5×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 111.33, protect: 131.18 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 118.78, protect: 138.63 },
      ]},
      { label: '5×7', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 118.81, protect: 138.65 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 128.31, protect: 148.15 },
      ]},
      { label: '5×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 132.61, protect: 152.45 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 144.71, protect: 164.56 },
      ]},
      { label: '7×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 134.56, protect: 154.41 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 146.86, protect: 166.71 },
      ]},
      { label: '7×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 154.79, protect: 174.64 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 173.97, protect: 193.82 },
      ]},
      { label: '10×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 170.38, protect: 190.23 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 186.73, protect: 206.58 },
      ]},
      { label: '10×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 232.57, protect: 252.42 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 242.75, protect: 262.6 },
      ]},
      { label: '3cm Pinado', itens: [
        { acab: 'ML TODOS OS PADRÕES', preco: 68.82, protect: 88.66 },
      ]},
      { label: '5×2 (Drywall)', itens: [
        { acab: 'ML TODOS OS PADRÕES', preco: 97.95, protect: 117.79 },
      ]},
      { label: '7 Plus', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 178.01, protect: 197.85 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 200.07, protect: 219.92 },
      ]},
    ]
  },
  alizar15: {
    title: 'Alizar Melamínico — 15mm', subtitle: 'MDF Superflora',
    grupos: [
      { label: '5×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 148.9, protect: 168.75 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 163.35, protect: 183.19 },
      ]},
      { label: '5×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 168.96, protect: 188.8 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 185.13, protect: 204.98 },
      ]},
      { label: '7×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 164.34, protect: 184.18 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 178.13, protect: 197.98 },
      ]},
      { label: '7×10', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 186.62, protect: 206.47 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 204.18, protect: 224.03 },
      ]},
      { label: '10×5', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO', preco: 187.45, protect: 205.45 },
      ]},
      { label: '5×2 (Drywall)', itens: [
        { acab: 'ML TODOS OS PADRÕES', preco: 115.58, protect: 135.42 },
      ]},
      { label: '7 Plus', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              preco: 194.66, protect: 212.66 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   preco: 212.98, protect: 230.98 },
      ]},
    ]
  },
  rodape: {
    title: 'Rodapé Melamínico', subtitle: '15mm × 2,40m MDF Superflora',
    grupos: [
      { label: '5 cm',  itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 26.44, precoMl:  11.02 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 29.9, precoMl: 12.46 },
      ]},
      { label: '7 cm',  itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 32.79, precoMl: 13.66 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 35.32, precoMl: 14.72 },
      ]},
      { label: '10 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 46.44, precoMl: 19.35 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 50.31, precoMl: 20.96 },
      ]},
      { label: '15 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 55.17, precoMl: 22.99 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 59.7, precoMl: 24.88 },
      ]},
      { label: '20 cm', itens: [
        { acab: 'MTX / ML CURUPIXA / LACCA BIANCO',                              precoRegua: 84.54, precoMl: 35.22 },
        { acab: 'ITALY / MOCACCINO / MARFIM / CARVALHO / ML IMBUIA / FREIJÓ',   precoRegua: 91.98, precoMl: 38.33 },
      ]},
    ]
  },
  kitCorrer: {
    title: 'Kit Porta de Correr Melamínico',
    itens: [
      { item: 'Melamínico — todos os padrões', preco: 305.18 },
      { item: 'Trilho, Roldana e Guia',        preco: 141.03 },
    ]
  },
};

// ── PORTAS UV / MELAMÍNICO DATA ───────────────────────────────
const portasUVData = {
  fabrica: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [183.21, 209.32, 235.42, 291.74, 369.04] },
            { linha: 'SARRAFO 6mm',           p: [194.98, 223.02, 251.12, 312.51, 395.41] },
            { linha: 'SÓLIDA',                p: [283.49, 309.59, 335.69, 392.02, 469.31] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [199.23, 228.37, 257.52, 320.64, 405.85] },
            { linha: 'SARRAFO 6mm',           p: [210.05, 241.02, 271.98, 338.72, 428.8] },
            { linha: 'SÓLIDA',                p: [299.51, 328.64, 357.79, 420.91, 506.12] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [220.29, 252.76, 285.21, 355.18, 449.64] },
            { linha: 'SARRAFO 6mm',           p: [231.66, 266.02, 300.39, 374.14, 473.73] },
            { linha: 'SÓLIDA',                p: [320.56, 353.03, 385.48, 455.45, 549.92] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [206.26, 236.21, 266.17, 331.33, 419.34] },
            { linha: 'SARRAFO 6mm',           p: [218.01, 249.94, 281.84, 350.96, 444.23] },
            { linha: 'SÓLIDA',                p: [306.53, 336.48, 366.44, 431.61, 519.61] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [220.46, 253.16, 285.86, 356.05, 450.82] },
            { linha: 'SARRAFO 6mm',           p: [231.27, 265.79, 300.31, 374.11, 473.77] },
            { linha: 'SÓLIDA',                p: [320.73, 353.43, 386.13, 456.32, 551.1] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [242.58, 278.77, 314.95, 392.37, 496.87] },
            { linha: 'SARRAFO 6mm',           p: [253.94, 292.03, 330.14, 411.33, 520.98] },
            { linha: 'SÓLIDA',                p: [342.86, 379.04, 415.22, 492.64, 597.15] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'SARRAFO 6mm', p: [309.39, 357, 404.61, 504.5, 639.36] },
            { linha: 'SÓLIDA',     p: [409.67, 457.27, 504.88, 604.78, 739.63] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'SARRAFO 6mm', p: [324.86, 374.85, 424.84, 529.73, 671.32] },
            { linha: 'SÓLIDA',     p: [430.15, 480.14, 530.12, 635.02, 776.62] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p:  87.08 },
      { item: 'Borracha',            p:  22.00 },
      { item: 'Frizos nas Portas',   p:  26.59 },
      { item: 'Furo Universal',      p:  26.00 },
      { item: 'Fechadura Soprano',   p:  42.00 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',         p:   5.68 },
      { item: 'Dob. Sobrepor',            p:   8.33 },
      { item: 'Dob. Pado Rolamento',      p:  11.11 },
      { item: 'Visor / Veneziana',        p: 135.00 },
      { item: 'Painel 1 Lado / Bandeira', p: 118.00 },
    ]
  },
  distribuidora: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [210.69, 240.72, 270.73, 335.5, 424.4] },
            { linha: 'SARRAFO 6mm',           p: [224.23, 256.47, 288.79, 359.39, 454.72] },
            { linha: 'SÓLIDA',                p: [326.01, 356.03, 386.04, 450.82, 539.71] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [229.11, 262.63, 296.15, 368.74, 466.73] },
            { linha: 'SARRAFO 6mm',           p: [241.56, 277.17, 312.78, 389.53, 493.12] },
            { linha: 'SÓLIDA',                p: [344.44, 377.94, 411.46, 484.05, 582.04] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [253.33, 290.67, 327.99, 408.46, 517.09] },
            { linha: 'SARRAFO 6mm',           p: [266.41, 305.92, 345.45, 430.26, 544.79] },
            { linha: 'SÓLIDA',                p: [368.64, 405.98, 443.3, 523.77, 632.41] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [237.2, 271.64, 306.1, 381.03, 482.24] },
            { linha: 'SARRAFO 6mm',           p: [250.71, 287.43, 324.12, 403.6, 510.86] },
            { linha: 'SÓLIDA',                p: [352.51, 386.95, 421.41, 496.35, 597.55] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [253.53, 291.13, 328.74, 409.46, 518.44] },
            { linha: 'SARRAFO 6mm',           p: [265.96, 305.66, 345.36, 430.23, 544.84] },
            { linha: 'SÓLIDA',                p: [368.84, 406.44, 444.05, 524.77, 633.77] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [278.97, 320.59, 362.19, 451.23, 571.4] },
            { linha: 'SARRAFO 6mm',           p: [292.03, 335.83, 379.66, 473.03, 599.13] },
            { linha: 'SÓLIDA',                p: [394.29, 435.9, 477.5, 566.54, 686.72] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'SARRAFO 6mm', p: [355.8, 410.55, 465.3, 580.17, 735.26] },
            { linha: 'SÓLIDA',     p: [471.12, 525.86, 580.61, 695.5, 850.57] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'SARRAFO 6mm', p: [373.59, 431.08, 488.57, 609.19, 772.02] },
            { linha: 'SÓLIDA',     p: [494.67, 552.16, 609.64, 730.27, 893.11] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 118.86 },
      { item: 'Borracha',            p:  30.03 },
      { item: 'Frizos nas Portas',   p:  36.30 },
      { item: 'Furo Universal',      p:  35.49 },
      { item: 'Fechadura Soprano',   p:  54.60 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',         p:   7.38 },
      { item: 'Dob. Sobrepor',            p:  10.83 },
      { item: 'Dob. Pado Rolamento',      p:  14.44 },
      { item: 'Visor / Veneziana',        p: 184.28 },
      { item: 'Painel 1 Lado / Bandeira', p: 161.07 },
    ]
  },
  dag: {
    colecoes: [
      {
        nome: 'ESSENZIALE', sub: 'HDF 3mm · 35mm espessura',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [238.17, 272.12, 306.05, 379.26, 479.75] },
            { linha: 'SARRAFO 6mm',           p: [253.47, 289.93, 326.46, 406.26, 514.03] },
            { linha: 'SÓLIDA',                p: [368.54, 402.47, 436.4, 509.63, 610.1] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [259, 296.88, 334.78, 416.83, 527.61] },
            { linha: 'SARRAFO 6mm',           p: [273.07, 313.33, 353.57, 440.34, 557.44] },
            { linha: 'SÓLIDA',                p: [389.36, 427.23, 465.13, 547.18, 657.96] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [286.38, 328.59, 370.77, 461.73, 584.53] },
            { linha: 'SARRAFO 6mm',           p: [301.16, 345.83, 390.51, 486.38, 615.85] },
            { linha: 'SÓLIDA',                p: [416.73, 458.94, 501.12, 592.09, 714.9] },
          ]},
        ]
      },
      {
        nome: 'INNOVAZIONE', sub: 'HDF Superflora 3mm · 35mm',
        grupos: [
          { nome: 'PINTURA UV (BRA / CUR / IMB / FRE)', tipo: 'uv', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [268.14, 307.07, 346.02, 430.73, 545.14] },
            { linha: 'SARRAFO 6mm',           p: [283.41, 324.92, 366.39, 456.25, 577.5] },
            { linha: 'SÓLIDA',                p: [398.49, 437.42, 476.37, 561.09, 675.49] },
          ]},
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [286.6, 329.11, 371.62, 462.87, 586.07] },
            { linha: 'SARRAFO 6mm',           p: [300.65, 345.53, 390.4, 486.34, 615.9] },
            { linha: 'SÓLIDA',                p: [416.95, 459.46, 501.97, 593.22, 716.43] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'COLMEIA — SARRAFO 3mm', p: [315.35, 362.4, 409.44, 510.08, 645.93] },
            { linha: 'SARRAFO 6mm',           p: [330.12, 379.64, 429.18, 534.73, 677.27] },
            { linha: 'SÓLIDA',                p: [445.72, 492.75, 539.79, 640.43, 776.3] },
          ]},
        ]
      },
      {
        nome: 'SOFISTICATO', sub: 'HDF Superflora 3mm · 40mm',
        grupos: [
          { nome: 'MELAMÍNICO CURUPIXA', tipo: 'curupixa', itens: [
            { linha: 'SARRAFO 6mm', p: [402.21, 464.1, 525.99, 655.85, 831.17] },
            { linha: 'SÓLIDA',     p: [532.57, 594.45, 656.34, 786.21, 961.52] },
          ]},
          { nome: 'MELAMÍNICO ITALY / MOCACCINO / MARFIM / CARVALHO / IMBUIA / FREIJO', tipo: 'italy', itens: [
            { linha: 'SARRAFO 6mm', p: [422.32, 487.31, 552.29, 688.65, 872.72] },
            { linha: 'SÓLIDA',     p: [559.19, 624.18, 689.16, 825.53, 1009.61] },
          ]},
        ]
      },
    ],
    adicionais: [
      { item: 'Montagem / Usinagem', p: 113.20 },
      { item: 'Borracha',            p:  28.60 },
      { item: 'Frizos nas Portas',   p:  34.57 },
      { item: 'Furo Universal',      p:  33.80 },
      { item: 'Fechadura Soprano',   p:  54.60 },
    ],
    ferragens: [
      { item: 'Dobradiça Comum',         p:   7.38 },
      { item: 'Dob. Sobrepor',            p:  10.83 },
      { item: 'Dob. Pado Rolamento',      p:  14.44 },
      { item: 'Visor / Veneziana',        p: 175.50 },
      { item: 'Painel 1 Lado / Bandeira', p: 153.40 },
    ]
  },
};

const DATA = {
  portasLacca: { type: 'portasLacca' },
  portasUV: { type: 'portasUV' },
  portasELO: { type: 'portasELO' },
  laccaAcab: { type: 'laccaAcab' },
  melamAcab: { type: 'melamAcab' },
  batenteELO: { type: 'batenteELO' },
};

// ── STATE ────────────────────────────────────────────
let currentSection = 'portasLacca';
let currentChannel = 'fabrica';
const subTabState = {};
let searchTerm = '';
