export interface WordExportOptions {
  proposalRef: string;
  proposalDate: string;
  clientName: string;
  clientLogo: string;
  finalPrice: number;
  formatCurrency: (n: number) => string;
  isCpmChillerManagement: boolean;
  origin: string;
  fallbackPages?: string[];
  costingSheet?: any;
  projectName?: string;
}

/* ── tiny helpers ── */
const sH = (t: string) =>
  `<h3 style="font-size:11pt;font-weight:800;color:#0f172a;border-bottom:1.5pt solid #0f172a;padding-bottom:3pt;margin:10pt 0 6pt 0;">${t}</h3>`;
const aH = (t: string) =>
  `<p style="font-size:9.5pt;font-weight:700;color:#0f172a;margin:7pt 0 2pt 0;">${t}</p>`;
const aP = (t: string) =>
  `<p style="font-size:9pt;color:#334155;margin:0 0 5pt 0;line-height:1.5;">${t}</p>`;
const bl = (t: string) =>
  `<p style="font-size:9pt;color:#334155;margin:0 0 3pt 0;padding-left:14pt;text-indent:-7pt;">&#9642;&nbsp;${t}</p>`;
const dt = (t: string) =>
  `<p style="font-size:9pt;color:#334155;margin:0 0 3pt 0;padding-left:14pt;text-indent:-7pt;">&#8226;&nbsp;${t}</p>`;
const hr = () =>
  `<table width="100%" cellpadding="0" cellspacing="0" style="margin:6pt 0;"><tr><td style="border-top:1pt solid #e2e8f0;font-size:0;">&nbsp;</td></tr></table>`;

/* ── page shell (header + body + footer, NO outer border) ── */
function pgWrap(pn: number, tp: number, ref: string, pd: string, cn: string, sub: string, org: string, body: string): string {
  return `
<div style="page-break-after:always;font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;">

  <!-- HEADER -->
  <table width="100%" cellpadding="0" cellspacing="0"
    style="width:100%;border-bottom:2pt solid #0f172a;padding-bottom:6pt;margin-bottom:10pt;">
    <tr>
      <td style="vertical-align:bottom;">
        <p style="font-size:7.5pt;color:#94a3b8;text-transform:uppercase;letter-spacing:1pt;margin:0 0 2pt 0;">${sub}</p>
        <p style="font-size:12pt;font-weight:900;color:#0f172a;margin:0 0 2pt 0;">${cn} &mdash; Central Plant Monitoring (CPM)</p>
        <p style="font-size:8.5pt;color:#64748b;margin:0;font-family:'Courier New',monospace;">
          Ref:&nbsp;<strong style="color:#334155;">${ref}</strong>&nbsp;&nbsp;&bull;&nbsp;&nbsp;Date:&nbsp;<strong style="color:#334155;">${pd}</strong>
        </p>
      </td>
      <td style="vertical-align:bottom;text-align:right;width:110pt;">
        <img src="${org}/Company-Logo-Light.png" alt="Sustainabyte" width="100" style="max-width:100pt;height:auto;display:block;margin-left:auto;"/>
      </td>
    </tr>
  </table>

  <!-- BODY -->
  ${body}

  <!-- FOOTER -->
  <table width="100%" cellpadding="0" cellspacing="0"
    style="width:100%;border-top:1pt solid #cbd5e1;margin-top:12pt;">
    <tr>
      <td style="font-size:7.5pt;color:#94a3b8;padding:3pt 0;width:33%;">Quotation No:&nbsp;<strong style="color:#475569;">${ref}</strong></td>
      <td style="font-size:7.5pt;color:#64748b;text-align:center;padding:3pt 0;width:34%;">Confidential &mdash; Sustainabyte Technologies Pvt Ltd</td>
      <td style="font-size:7.5pt;color:#334155;font-weight:700;text-align:right;padding:3pt 0;width:33%;">Page ${pn} of ${tp}</td>
    </tr>
  </table>

</div>`;
}

/* ── full document shell ── */
function buildDoc(ref: string, cn: string, pages: string): string {
  return `<html xmlns:o='urn:schemas-microsoft-com:office:office'
       xmlns:w='urn:schemas-microsoft-com:office:word'
       xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${ref} &mdash; ${cn}</title>
  <!--[if gte mso 9]><xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml><![endif]-->
  <style>
    @page { size:A4 portrait; margin:15mm 18mm 15mm 18mm; }
    body { font-family:'Segoe UI',Arial,Calibri,sans-serif; font-size:9.5pt; line-height:1.4; color:#1e293b; background:#fff; margin:0; padding:0; }
    h1,h2,h3,h4 { font-family:'Segoe UI',Arial,sans-serif; color:#0f172a; margin:0; }
    p { margin:0 0 4pt 0; }
    table { border-collapse:collapse; }
    img { max-width:100%; height:auto; }
    strong { font-weight:700; }
  </style>
</head>
<body>${pages}</body>
</html>`;
}

export function generateWordDocument(opts: WordExportOptions): string {
  const {
    proposalRef: ref, proposalDate, clientName, clientLogo,
    finalPrice, formatCurrency, isCpmChillerManagement, origin,
    fallbackPages = []
  } = opts;

  const tp = isCpmChillerManagement ? 8 : fallbackPages.length;
  const wrap = (pn: number, sub: string, body: string) =>
    pgWrap(pn, tp, ref, proposalDate, clientName, sub, origin, body);

  /* fallback for non-CPM proposals */
  if (!isCpmChillerManagement) {
    const all = fallbackPages
      .map(html => `<div style="page-break-after:always;">${html}</div>`)
      .join('\n');
    return buildDoc(ref, clientName, all);
  }

  /* ───────────────────────────── CLIENT LOGO ───────────────────────────── */
  const clH = clientLogo
    ? `<td style="vertical-align:middle;text-align:right;width:90pt;padding-left:10pt;">
         <img src="${clientLogo.startsWith('http') ? clientLogo : origin + clientLogo}"
           alt="${clientName}" width="75"
           style="max-width:75pt;max-height:36pt;height:auto;display:block;margin-left:auto;"/>
       </td>`
    : '<td style="width:10pt;"></td>';

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 1 — Cover & About Sustainabyte
  ═══════════════════════════════════════════════════════════════════════ */
  const p1 = `
<!-- Cover badge + title -->
<table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:10pt;">
  <tr>
    <td style="vertical-align:middle;">
      <span style="font-size:8pt;font-weight:700;text-transform:uppercase;letter-spacing:0.5pt;
        color:#047857;background:#ecfdf5;border:1pt solid #a7f3d0;padding:2pt 8pt;border-radius:20pt;">
        Official Commercial Proposal
      </span>
      <h1 style="font-size:17pt;font-weight:900;color:#0f172a;text-transform:uppercase;
        margin:6pt 0 2pt 0;letter-spacing:-0.3pt;line-height:1.15;">
        Central Plant Monitoring<br/>(CPM) System
      </h1>
      <p style="font-size:8.5pt;color:#64748b;margin:0;font-family:'Courier New',monospace;">
        Ref:&nbsp;<strong style="color:#334155;">${ref}</strong>
        &nbsp;&bull;&nbsp;Date:&nbsp;<strong style="color:#334155;">${proposalDate}</strong>
      </p>
    </td>
    ${clH}
  </tr>
</table>

<!-- Prepared for -->
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#f8fafc;padding:8pt 10pt;margin-bottom:10pt;border-left:3pt solid #0f172a;">
  <tr>
    <td>
      <p style="font-size:7.5pt;color:#94a3b8;text-transform:uppercase;letter-spacing:1pt;margin:0 0 2pt 0;">Proposal Prepared For:</p>
      <p style="font-size:13pt;font-weight:900;color:#0f172a;margin:0 0 2pt 0;">${clientName}</p>
      <p style="font-size:9pt;color:#475569;margin:0;">
        Service Scope:&nbsp;<strong style="color:#0f172a;">Chiller Management / CPM (Central Plant Monitoring)</strong>
      </p>
    </td>
  </tr>
</table>

${sH('About Sustainabyte:')}
<p style="font-size:9pt;color:#1e293b;margin:0 0 5pt 0;line-height:1.55;">Sustainabyte is a private limited company, based out in Chennai, with client base spreading across 3 countries. It is a climate-tech start-up, predominantly focusing on energy conservation methodologies across Industries, Commercial building and residential complexes. Sustainabyte.ai is dedicated to leveraging advanced technology for global sustainability.</p>
<p style="font-size:9pt;color:#1e293b;margin:0 0 5pt 0;line-height:1.55;">Our mission is to minimize environmental impact while enhancing operational efficiency through innovative solutions. Sustainabyte is a technology-driven sustainability company, providing cutting-edge solutions for enterprises to identify, plan and operationalize their Net Zero Carbon ambitions through proprietary machine-learning algorithms that provide measurable outcomes.</p>
<p style="font-size:9pt;color:#1e293b;margin:0 0 5pt 0;line-height:1.55;">Our goal is to collaborate with companies and help them work smarter, make critical decisions more quickly and consume less. As a first step, we provide expert advisory to create a blueprint for sustainability roadmap and Net Zero Carbon Goals.</p>
<p style="font-size:9pt;color:#1e293b;margin:0;line-height:1.55;">We implement our flagship IoT solution &mdash; OptiByte &mdash; as an overlay on the client&apos;s existing systems, connecting data points to provide a bird&apos;s-eye view. Our reporting module presents ESG scores, operational efficiency KPIs and compares against milestones. We pride in delivering results as early as 30&ndash;60 days.</p>`;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 2 — CPM Architecture
  ═══════════════════════════════════════════════════════════════════════ */
  const p2 = `
${sH('Central Plant Monitoring (CPM) System Architecture:')}
<p style="text-align:center;margin:8pt 0;">
  <img src="${origin}/cpm-architecture.png" alt="CPM Architecture"
    width="490" style="max-width:100%;height:auto;display:block;margin:0 auto;"/>
</p>
<table width="100%" cellpadding="0" cellspacing="0"
  style="background:#f8fafc;border-left:3pt solid #0f172a;padding:8pt 10pt;margin-top:8pt;">
  <tr><td>
    <p style="font-size:9pt;font-weight:700;color:#0f172a;margin:0 0 5pt 0;">Key System Architecture Specifications:</p>
    ${bl('<strong>Field Equipment Integration:</strong> All field devices (water cooled chillers, primary/secondary pumps, condenser water pumps, cooling tower fans, makeup pump) connect to the DDC Panel using hardwired I/O.')}
    ${bl('<strong>Energy Meters (Soft Integration):</strong> Energy meters connected directly to DDC Panel via Modbus RTU (RS485) network for power monitoring and telemetry.')}
    ${bl('<strong>DDC Panel &amp; Local Server:</strong> DDC Panel publishes data to Local Server / Workstation (MQTT Broker) over the local LAN switch for local visualization (Web HMI).')}
    ${bl('<strong>Cloud Uplink:</strong> Local server securely forwards telemetry to the Sustainabyte Cloud Platform through HTTPS (REST API) for real-time dashboarding and AI-driven chiller optimization.')}
  </td></tr>
</table>`;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 3 — Commercial Investment
  ═══════════════════════════════════════════════════════════════════════ */
  const cs = opts.costingSheet || {};
  const calcRowPrice = (unitCost: number, marginPct: number = 40): number => {
    if (marginPct >= 100) return unitCost * 2;
    return Math.round(unitCost / Math.max(0.01, (100 - marginPct) / 100));
  };

  const rawHwRows: any[] = cs.cpmHardwareRows || cs.instrumentRows?.cpmHardwareRows || [];
  const activeHwRows = rawHwRows.filter((r) => Number(r.qty || 0) > 0);

  const rawElecRows: any[] = cs.cpmElectricalRows || cs.instrumentRows?.cpmElectricalRows || [];
  const activeElecRows = rawElecRows.filter((r) => Number(r.qty || 0) > 0);

  const instPrice = Number(cs.cpmInstManpowerTotalPrice || cs.cpmInstallationTotalPrice || cs.cpmInstManpowerTotalCost || 0);
  const commPrice = Number(cs.cpmCommissioningTotalPrice || cs.cpmCommissioningTotalCost || 0);
  const rawCloudRows: any[] = cs.cpmCloudChargeRows || cs.cpmCloudRows || [];
  const activeCloudRows = rawCloudRows.filter((r) => Number(r.qty || 0) > 0);
  const cloudPrice = Number(cs.cpmCloudChargeTotalPrice || cs.cpmCloudTotalPrice || 0);
  const rawOnPremiseRows: any[] = cs.cpmOnPremiseRows || [];
  const activeOnPremiseRows = rawOnPremiseRows.filter((r) => Number(r.qty || 0) > 0);
  const onPremisePrice = Number(cs.cpmOnPremiseTotalPrice || 0);

  interface CommercialRowDocx {
    desc: string;
    count: string | number;
    unit: string;
    cost: number;
  }

  const cRows: CommercialRowDocx[] = [];
  activeHwRows.forEach((r) => {
    const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
    cRows.push({
      desc: r.brand ? `${r.itemDescription} (${r.brand})` : r.itemDescription,
      count: r.qty,
      unit: r.uom || 'Nos',
      cost: Math.round(Number(r.qty || 1) * unitPrice),
    });
  });

  activeElecRows.forEach((r) => {
    const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
    cRows.push({
      desc: r.brand ? `${r.itemDescription} (${r.brand})` : r.itemDescription,
      count: r.qty,
      unit: r.uom || 'Mtr',
      cost: Math.round(Number(r.qty || 1) * unitPrice),
    });
  });

  if (instPrice > 0) cRows.push({ desc: 'Installation Charges', count: '', unit: '', cost: instPrice });
  if (commPrice > 0) cRows.push({ desc: 'Testing & Commissioning', count: '', unit: '', cost: commPrice });

  if (activeCloudRows.length > 0) {
    activeCloudRows.forEach((r) => {
      const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
      cRows.push({
        desc: r.basis ? `Cloud & Software Subscription (${r.basis})` : (r.component || 'Software cost / Cloud Charges'),
        count: r.qty || '',
        unit: r.uom || '',
        cost: Math.round(Number(r.qty || 1) * unitPrice),
      });
    });
  } else if (cloudPrice > 0) {
    cRows.push({ desc: 'Software cost', count: '', unit: '', cost: cloudPrice });
  }

  if (activeOnPremiseRows.length > 0) {
    activeOnPremiseRows.forEach((r) => {
      const unitPrice = r.unitPrice ? Number(r.unitPrice) : calcRowPrice(Number(r.unitCost || 0), Number(r.marginPct ?? 40));
      cRows.push({
        desc: r.commercialLayer || 'Application / Configuration Cost',
        count: r.qty || '',
        unit: r.uom || '',
        cost: Math.round(Number(r.qty || 1) * unitPrice),
      });
    });
  } else if (onPremisePrice > 0) {
    cRows.push({ desc: 'Application Cost', count: '', unit: '', cost: onPremisePrice });
  }

  const cpmHardware3PctPrice = Number(cs.cpmHardware3PctPrice || 0);
  if (cpmHardware3PctPrice > 0) {
    cRows.push({ desc: 'Packaging Charges (3% of Total Hardware & Consumables)', count: 1, unit: 'Lot', cost: cpmHardware3PctPrice });
  }
  const cpmBufferAmount = Number(cs.cpmBufferAmount || 0);
  if (cpmBufferAmount > 0) {
    cRows.push({ desc: `Negotiation & Contingency Buffer (${cs.bufferPct || 10}%)`, count: '', unit: '', cost: cpmBufferAmount });
  }

  const fallbackCRows: CommercialRowDocx[] = [
    { desc: 'Server PC / Workstation', count: 1, unit: 'Nos', cost: 150000 },
    { desc: '21" Colour Monitor', count: 1, unit: 'Nos', cost: 28000 },
    { desc: 'Sensor cost (RTD, Pressure transmitter, Flow Switch, etc.)', count: 1, unit: 'Lot', cost: 470000 },
    { desc: 'DDC Panel With Controller (Sustainabyte Controller with I/O modules)', count: 1, unit: 'Lot', cost: 330000 },
    { desc: 'Shielded twisted-pair RS-485 cable, per meter', count: 4300, unit: 'Mtr', cost: 390000 },
    { desc: '300mm width X 50mm Height - GI tray', count: 50, unit: 'Mtr', cost: 46000 },
    { desc: '100mm width X 50mm Height - GI tray', count: 150, unit: 'Mtr', cost: 55000 },
    { desc: 'PVC Conduit pipe and flexible hose', count: 2000, unit: 'Mtr', cost: 93000 },
    { desc: 'Other accessories', count: 1, unit: 'Lot', cost: 23000 },
    { desc: 'Installation Charges', count: '', unit: '', cost: 45000 },
    { desc: 'Testing & Commissioning', count: '', unit: '', cost: 120000 },
    { desc: 'Software cost', count: '', unit: '', cost: 434000 },
    { desc: 'Application Cost', count: '', unit: '', cost: 700000 },
  ];

  const displayCRows = cRows.length > 0 ? cRows : fallbackCRows;
  const calculatedTotal = displayCRows.reduce((sum, r) => sum + r.cost, 0);
  const docxFinalTotal = finalPrice && finalPrice > 0 ? finalPrice : calculatedTotal;
  const plantTitle = opts.projectName || opts.clientName || 'Plant 1';

  const p3 = `
${sH('Annexure &ndash; I: Commercial Investment (Current CPM Cost)')}
<table width="100%" cellpadding="0" cellspacing="0"
  style="width:100%;border-collapse:collapse;margin-bottom:0;border:1.5pt solid #0f172a;">
  <thead>
    <tr style="background:#f1f5f9;color:#0f172a;">
      <th colspan="4" style="padding:6pt 8pt;font-size:10pt;text-align:center;border:1pt solid #0f172a;font-weight:900;text-transform:uppercase;">${plantTitle}</th>
    </tr>
    <tr style="background:#ffffff;color:#0f172a;">
      <th width="58%" style="padding:5pt 8pt;font-size:9pt;text-align:left;border:1pt solid #0f172a;font-weight:800;">Description</th>
      <th width="12%" style="padding:5pt 8pt;font-size:9pt;text-align:center;border:1pt solid #0f172a;font-weight:800;">Count</th>
      <th width="12%" style="padding:5pt 8pt;font-size:9pt;text-align:center;border:1pt solid #0f172a;font-weight:800;">Unit</th>
      <th width="18%" style="padding:5pt 8pt;font-size:9pt;text-align:right;border:1pt solid #0f172a;font-weight:800;">Cost</th>
    </tr>
  </thead>
  <tbody>
    ${displayCRows
      .map(
        (r) => `
    <tr>
      <td style="padding:4.5pt 8pt;font-size:8.5pt;border:1pt solid #cbd5e1;vertical-align:middle;color:#0f172a;font-weight:500;">${r.desc}</td>
      <td style="padding:4.5pt 8pt;font-size:8.5pt;text-align:center;border:1pt solid #cbd5e1;vertical-align:middle;font-weight:700;">${r.count !== undefined && r.count !== null && r.count !== 0 ? r.count : ''}</td>
      <td style="padding:4.5pt 8pt;font-size:8.5pt;text-align:center;border:1pt solid #cbd5e1;vertical-align:middle;color:#475569;">${r.unit || ''}</td>
      <td style="padding:4.5pt 8pt;font-size:8.5pt;font-weight:700;text-align:right;border:1pt solid #cbd5e1;vertical-align:middle;color:#0f172a;font-family:'Courier New',monospace;">${formatCurrency(r.cost).replace('₹', '').trim()}</td>
    </tr>`
      )
      .join('')}
    <tr style="background:#f8fafc;font-weight:900;">
      <td colspan="3" style="padding:6pt 10pt;font-size:9.5pt;font-weight:900;text-transform:uppercase;letter-spacing:0.5pt;border:1.5pt solid #0f172a;text-align:center;">Total</td>
      <td style="padding:6pt 10pt;font-size:10.5pt;font-weight:900;text-align:right;color:#0f172a;border:1.5pt solid #0f172a;font-family:'Courier New',monospace;">${formatCurrency(docxFinalTotal).replace('₹', '').trim()}</td>
    </tr>
  </tbody>
</table>

${hr()}
<p style="font-size:9.5pt;font-weight:700;color:#0f172a;margin:6pt 0 4pt 0;">Notes &amp; Assumptions:</p>
${bl('Cabling quantity as per BOQ/Thumb-rule Basis. Any increase/decrease billed against consumed quantity after complete execution.')}
${bl('Controller quantity as per IO summary/equipment quantity; changes will have price impact.')}
${bl("Mod-bus card for VFD/chiller in client's scope.")}
${bl('Installation of Sensors, Valves, BTU meters, Flow meters, VFD etc. not in our scope.')}
${bl('Civil work and electrical works not in our scope.')}
${bl('Water, Power &amp; Scaffolding at FOC at site unless otherwise agreed mutually.')}
${bl('Adapter box &amp; Network Switch not in our scope of supply/installation.')}
${bl('Field devices as per standard design/BOQ. Changes in quantity will have price impact.')}
${bl('Drawings to be shared for optimization of the project.')}`;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 4 — Terms & Conditions
  ═══════════════════════════════════════════════════════════════════════ */
  const p4 = `
${sH('Annexure &ndash; III: Terms &amp; Conditions:')}
<div style="font-size:9pt;color:#1e293b;line-height:1.6;margin-bottom:10pt;">
  <p style="margin:0 0 4pt 0;">1) Offer Validity: One Month (30 Days)</p>
  <p style="margin:0 0 2pt 0;">2) Payment Terms:</p>
  <p style="margin:0 0 2pt 0;padding-left:14pt;">&bull; 50% advance against Pro-Forma Invoice</p>
  <p style="margin:0 0 2pt 0;padding-left:14pt;">&bull; 40% against Supply within 15 days</p>
  <p style="margin:0 0 4pt 0;padding-left:14pt;">&bull; 10% after completion of the project</p>
  <p style="margin:0 0 4pt 0;">3) Taxes: As per GST @ 18% (Material Packing &amp; Forwarding / Transport: Inclusive).</p>
  <p style="margin:0 0 4pt 0;">4) Delivery: 10 to 12 Weeks from the approved date of PO and Design Document by Customer as per site requirement.</p>
  <p style="margin:0 0 4pt 0;">5) Warranty for Supply: 1 year from the date of Delivery of the material at site.</p>
  <p style="margin:0 0 4pt 0;">6) If any Power fluctuations / variations for input voltage to Field devices / controllers, device failure is in customer scope.</p>
  <p style="margin:0 0 4pt 0;">7) For any environmental effects, damages of devices / controller failure customer is responsible.</p>
  <p style="margin:0 0 4pt 0;">8) 5 to 6 weeks after receiving the materials at site Installation &amp; Commissioning will be completed.</p>
</div>

${hr()}
<p style="font-size:9.5pt;font-weight:700;color:#0f172a;margin:6pt 0 4pt 0;">Limitation to Liability:</p>
${aP('The maximum liability of the Seller for any and all claims, losses, damages, costs and expenses arising from or in connection with this Agreement shall not exceed the amounts actually received by the Seller under this Agreement.')}`;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 5 — Articles 1–10
  ═══════════════════════════════════════════════════════════════════════ */
  const p5 = `
${sH('Contractual Articles &mdash; Scope, Approvals &amp; Financial Terms')}
${aH('Article 1: Scope of Work')}
${aP('Restricted to supply, packing, forwarding, transportation, erection, testing, and commissioning of equipment as per agreed BOQ, drawings, and technical specifications.')}
${aH('Article 2: Priority of Documents')}
${aP('Sequence: a) Contract Agreement, b) Letter of Award, c) Minutes of Meeting, d) Seller&apos;s Offer, e) General Conditions, f) Schedules &amp; Annexures, g) Technical Specifications.')}
${aH('Article 3: Drawings / Dimension Sheets')}
${aP('Drawings submitted for Buyer approval within 5 days. Basic SLD and layout submitted within 10 days of Contract coming into force.')}
${aH('Article 4: Coming into Force')}
${aP('Contract comes into force when signed, 50% advance received, full site access granted, kick-off meeting held, and drawings approved.')}
${aH('Article 5: Offer Validity &amp; Article 6: Contract Price')}
${aP('Offer valid for 30 days. Price inclusive of freight up to site, exclusive of taxes. Payments in INR.')}
${aH('Article 7: Transfer of Risk &amp; Title')}
${aP('Ownership and title retained by Seller until entire purchase price is fully paid.')}
${aH('Article 8: Taxes, Duties &amp; Statutory Variations')}
${aP('Taxes as per GST. Any statutory variation, new levies shall be to Buyer&apos;s account.')}
${aH('Article 9: Terms of Payment')}
${aP('Payments released within 7 days of invoice. Overdue payments accrue interest @ 18% p.a.')}
${aH('Article 10: Variation / Change Management')}
${aP('RFC evaluated within 7 days. Changes up to &plusmn;10% at agreed rates; beyond 10% subject to revised prices.')}`;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 6 — Articles 11–20
  ═══════════════════════════════════════════════════════════════════════ */
  const p6 = `
${sH('Contractual Articles &mdash; Testing, Warranty, Liability &amp; IP')}
${aH('Article 11: Testing Charges &amp; Inspection')}
${aP('Routine/acceptance tests per IS standards. Dispatch authorization within 2 days of test clearance.')}
${aH('Article 12: Goods Receipts and Storage')}
${aP('Goods Receipt within 48 hours of delivery. Storage due to Buyer delay charged at 0.5% per week.')}
${aH('Article 13: Completion Period')}
${aP('Delivery timeline extended for payment delays, scope changes, or Force Majeure without penalty to Seller.')}
${aH('Article 15: Overall Limitation to Liability')}
${aP('Maximum total liability of Seller shall not exceed amounts actually received under this Agreement.')}
${aH('Article 16: Warranty (Products &amp; Services)')}
${aP('<strong>Products:</strong> 1 Year from handover. Repair/replacement of faulty parts. Misuse/voltage spikes excluded. <strong>Services:</strong> 30-day notification for remedial service at no additional cost.')}
${aH("Article 17: Buyer's Obligations")}
${aP('Buyer provides electricity, water, gas, site office, storage sheds, and site security free of cost throughout execution.')}
${aH('Article 18: Assignment &amp; Sub-Contract')}
${aP('Seller permitted to engage specialized subcontractors without absolving overall obligations.')}
${aH('Article 19: Intellectual Property &amp; Software License')}
${aP('Single, non-exclusive software license for the specified site. All IPR remain exclusive property of Sustainabyte.')}
${aH('Article 20: IP Indemnification &amp; Liquidated Damages')}
${aP('Liquidated damages capped at 0.25% per week up to a maximum of 2.5% of unexecuted contract value.')}`;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 7 — Articles 21–31
  ═══════════════════════════════════════════════════════════════════════ */
  const p7 = `
${sH('Contractual Articles &mdash; Termination, Acceptance, Insurance &amp; Legal')}
${aH('Article 21: Communication &amp; Article 22: Suspension')}
${aP('Written notice via email/letter valid. Idle resource costs during suspension payable by Buyer.')}
${aH('Article 23: Termination / Cancellation')}
${aP('30 days written notice for insolvency or persistent non-performance. In event of Buyer cancellation, Seller entitled to full payment for work done plus 10% termination fee.')}
${aH('Article 24: Force Majeure')}
${aP('Events beyond reasonable control (natural disasters, war, government orders) extend performance timelines without breach.')}
${aH('Article 25: Applicable Law &amp; Dispute Resolution')}
${aP('Governed by laws of India. Disputes resolved by 3-arbitrator panel under Arbitration and Conciliation Act 1996 in English.')}
${aH('Article 26: Provisional Acceptance (PAC) &amp; Article 27: Final Acceptance (FAC)')}
${aP('PAC issued upon equipment installation/testing. FAC issued after material reconciliation and handover. Commercial use constitutes deemed acceptance.')}
${aH('Article 28: General Indemnification &amp; Article 29: Insurance')}
${aP('Seller maintains Transit &amp; EAR Policy; Buyer maintains premises insurance.')}
${aH('Article 30: Confidentiality / Do Not Disclose (DND)')}
${aP('Strict non-disclosure obligations for proprietary software, pricing, algorithms, and technical documentation.')}
${aH('Article 31: Miscellaneous')}
${aP('No set-off rights. Overrun charges: INR 10,000 per man-day/month for client-caused commissioning delays. Water &amp; electricity provided free by Purchaser.')}`;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 8 — Clients & Authorization
  ═══════════════════════════════════════════════════════════════════════ */
  const clients = [
    'Mazaya Business Avenue, Dubai',
    'ASHRAE Level 2 audit at 6 Commercial Buildings, Dubai',
    'Danat Al Emarat Hospital, Dubai by Aatral',
    'Suzlon Energy Pvt Ltd',
    'Velmurugan Industries Ltd',
    'Capital Land by Orien Energy',
    'Casagrand Eco Tech, Sholinganallur',
    'Tidal Park, Pattabiram',
    'TNQ Software, Tharamani',
    'Embassy Tech Village, Kadubisenahalli, Bengaluru',
    'Embassy ETZ, Pune',
    'Firstsource Limited, Vijayawada',
    'Firstsource Limited, Hyderabad',
    'Firstsource Limited, Chennai',
    'Valeo Software, Sholinganallur',
    'Solidpro, Chennai',
    'SRM University, Chennai',
    'Development Environergy Services Limited - IIT Hyderabad',
    'Aatral Engineering',
    'Velmurugan Heavy Engineering Industries Pvt Ltd',
    '20cube Logistics Solutions Pvt Ltd',
    'Danfoss Industries Pvt Ltd',
    'Knowledge Bridge',
    'S G Snacks India Pvt Ltd',
    'Parekhplast India Limited',
    'PMEL Oragadam Pvt Ltd - Unit 3 &amp; 4',
    'Lucas TVS Limited - Padi',
    'Visalam Technologies LLP',
    'Adspaas Polymer Solutions Limited',
    'Wheels India Limited',
    'India Metal One Steel Plate Processing Pvt Ltd',
    'Aisan Auto Parts India Pvt Ltd',
    'Whirlpool of India Limited',
    'ITC - Medak Ltd',
    'Kone Elevator India Pvt Ltd',
    'KPR Mill Limited',
    'Concorde Textiles Ltd',
    'Arni Engineering Tech Pvt Ltd',
    'Growserve Enterprises - Ashirwad',
    'Vashi Integrated Solutions Limited',
    'Ahlstrom Fiber Composite Pvt Ltd',
  ];

  let rows = '';
  for (let i = 0; i < clients.length; i += 3) {
    const cell = (j: number) => {
      const c = clients[i + j];
      return c
        ? `<td width="33%" style="padding:3pt 5pt;vertical-align:top;border:1pt solid #e2e8f0;">
             <span style="font-size:8pt;font-weight:700;color:#047857;">${i + j + 1}.&nbsp;</span>
             <span style="font-size:8pt;color:#1e293b;">${c}</span>
           </td>`
        : '<td width="33%"></td>';
    };
    rows += `<tr>${cell(0)}${cell(1)}${cell(2)}</tr>`;
  }

  const p8 = `
${sH('Team Expertise &amp; Enterprise Clients (42 References):')}
<table width="100%" cellpadding="0" cellspacing="0"
  style="width:100%;border-collapse:collapse;margin-bottom:12pt;">
  ${rows}
</table>

${hr()}
<table width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
  <tr>
    <td width="50%" style="vertical-align:top;padding-right:16pt;">
      <p style="font-size:9pt;font-weight:700;color:#0f172a;margin:0 0 5pt 0;">Submitted by,</p>
      <img src="${origin}/Company-Logo-Light.png" alt="Sustainabyte" width="85"
        style="max-width:85pt;height:auto;display:block;margin-bottom:5pt;"/>
      <p style="font-size:10pt;font-weight:900;color:#0f172a;margin:0 0 1pt 0;">Thanakarthik</p>
      <p style="font-size:9pt;color:#475569;margin:0 0 1pt 0;">Founder &amp; CEO</p>
      <p style="font-size:9pt;font-family:'Courier New',monospace;color:#1e293b;margin:0 0 1pt 0;">+91-8377007638</p>
      <p style="font-size:9pt;font-family:'Courier New',monospace;color:#475569;margin:0;">thanakarthik@sustainabyte.ai</p>
    </td>
    <td width="50%" style="vertical-align:top;padding-left:16pt;border-left:1pt solid #e2e8f0;">
      <p style="font-size:9pt;font-weight:700;color:#0f172a;text-decoration:underline;margin:0 0 5pt 0;">Bank Account Details:</p>
      <p style="font-size:8.5pt;font-family:'Courier New',monospace;color:#1e293b;margin:0 0 2pt 0;"><strong>Name:</strong>&nbsp;SUSTAINABYTE TECHNOLOGIES PRIVATE LIMITED</p>
      <p style="font-size:8.5pt;font-family:'Courier New',monospace;color:#1e293b;margin:0 0 2pt 0;"><strong>Bank:</strong>&nbsp;Bank of Baroda</p>
      <p style="font-size:8.5pt;font-family:'Courier New',monospace;color:#1e293b;margin:0 0 2pt 0;"><strong>Account No:</strong>&nbsp;35860200000750</p>
      <p style="font-size:8.5pt;font-family:'Courier New',monospace;color:#1e293b;margin:0 0 2pt 0;"><strong>IFSC:</strong>&nbsp;BARB0VELACH (fifth letter is ZERO)</p>
      <p style="font-size:8.5pt;font-family:'Courier New',monospace;color:#1e293b;margin:0;"><strong>Branch:</strong>&nbsp;VELACHERY BRANCH</p>
    </td>
  </tr>
</table>
<p style="font-size:14pt;font-weight:900;text-transform:uppercase;letter-spacing:4pt;
  color:#0f172a;text-align:center;margin:14pt 0 0 0;border-top:1pt solid #e2e8f0;padding-top:10pt;">
  THANK YOU
</p>`;

  /* ═══════════════════════════════ ASSEMBLE ══════════════════════════════ */
  const allPages = [
    wrap(1, 'Official Commercial Proposal &ndash; CPM System', p1),
    wrap(2, 'Annexure &ndash; II: CPM System Architecture', p2),
    wrap(3, 'Annexure &ndash; I: Commercial Investment &amp; Bill of Quantities', p3),
    wrap(4, 'Annexure &ndash; III: Terms, Commercial Conditions &amp; Basis of Offer', p4),
    wrap(5, 'Contractual Articles &ndash; Scope, Approvals &amp; Financial Terms', p5),
    wrap(6, 'Contractual Articles &ndash; Testing, Warranty, Liability &amp; IP', p6),
    wrap(7, 'Contractual Articles &ndash; Termination, Acceptance, Insurance &amp; Legal', p7),
    wrap(8, 'Team Expertise, Client Track Record &amp; Authorization', p8),
  ].join('\n');

  return buildDoc(ref, clientName, allPages);
}
