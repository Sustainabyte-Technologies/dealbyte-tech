import * as XLSX from 'xlsx';

// ─── Helpers ───
function num(val: any): number {
  return Number(val || 0);
}

/** Convert 0-based column index → Excel letter (0=A, 1=B, …, 25=Z, 26=AA) */
function colLetter(c: number): string {
  let s = '';
  c++;
  while (c > 0) {
    c--;
    s = String.fromCharCode(65 + (c % 26)) + s;
    c = Math.floor(c / 26);
  }
  return s;
}

/** Shorthand: cell reference like "G5" */
function cell(col: number, row: number): string {
  return `${colLetter(col)}${row}`;
}

/** Create a worksheet from data, set column widths, inject formulas, then append to workbook */
function addSheet(
  wb: XLSX.WorkBook,
  data: any[][],
  name: string,
  formulas?: Record<string, string>, // e.g. { "G4": "C4*F4" }
  merges?: XLSX.Range[],
) {
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Column widths
  const colCount = Math.max(...data.map((r) => r.length));
  const widths: { wch: number }[] = [];
  for (let c = 0; c < colCount; c++) {
    let maxLen = 12;
    for (const row of data) {
      const v = row[c];
      const len = v !== undefined && v !== null ? String(v).length : 0;
      if (len > maxLen) maxLen = len;
    }
    widths.push({ wch: Math.min(maxLen + 3, 55) });
  }
  ws['!cols'] = widths;

  // Inject formulas
  if (formulas) {
    for (const [ref, formula] of Object.entries(formulas)) {
      ws[ref] = { t: 'n', f: formula };
    }
  }

  // Merges
  if (merges && merges.length) {
    ws['!merges'] = merges;
  }

  XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 31));
}

// ──────────────────────────────────────────────
// Main Export
// ──────────────────────────────────────────────
export function exportCostingSheetToExcel(sheet: any) {
  const wb = XLSX.utils.book_new();
  const today = new Date().toLocaleDateString('en-IN');

  const sheetMargin =
    sheet.marginPct !== undefined && sheet.marginPct !== null
      ? Number(sheet.marginPct)
      : sheet.profitPct !== undefined
      ? Number(sheet.profitPct)
      : 40;

  const sheetBuffer =
    sheet.bufferPct !== undefined && sheet.bufferPct !== null ? Number(sheet.bufferPct) : 0;

  const subtotalCost = num(sheet.subtotalCost || sheet.totalCost || sheet.costTotal);
  const finalQuote = num(sheet.finalQuote || sheet.ourQuoteAmount);

  // ─── Detect sheet type ───
  const isCpm =
    sheet.instrumentRows?.isCpm ||
    Boolean(sheet.isCpm) ||
    sheet.subService?.toLowerCase().includes('cpm') ||
    sheet.subService?.toLowerCase().includes('chiller') ||
    sheet.serviceCategory?.toLowerCase().includes('chiller');

  const isCompressedAir =
    sheet.subService?.toLowerCase().includes('compressed air') ||
    sheet.subService?.toLowerCase().includes('air automation');

  const isEms =
    sheet.instrumentRows?.isEms ||
    Boolean(sheet.isEms) ||
    sheet.subService?.toLowerCase().includes('ems') ||
    sheet.subService?.toLowerCase().includes('compressed air') ||
    sheet.subService?.toLowerCase().includes('automation') ||
    sheet.serviceCategory?.toLowerCase().includes('automation') ||
    sheet.serviceCategory?.toLowerCase().includes('iot');

  const isWelding =
    Boolean(sheet.isWeldingIot) ||
    sheet.subService?.toLowerCase().includes('welding') ||
    sheet.subService?.toLowerCase().includes('digiweld') ||
    sheet.subService?.toLowerCase().includes('weld data') ||
    sheet.serviceCategory?.toLowerCase().includes('welding') ||
    Boolean(sheet.weldingSoftwareRows?.length) ||
    Boolean(sheet.weldingHardwareRows?.length) ||
    Boolean(sheet.weldingCloudRows?.length);

  const instObj =
    sheet.instrumentRows && typeof sheet.instrumentRows === 'object' && !Array.isArray(sheet.instrumentRows)
      ? sheet.instrumentRows
      : {};

  const isDigiweld =
    sheet.subService?.toLowerCase().includes('digiweld') ||
    sheet.subService?.toLowerCase().includes('weld data');

  const sheetTypeLabel = isCpm
    ? 'CPM Costing Sheet'
    : isDigiweld
    ? 'Digiweld Costing Sheet'
    : isWelding
    ? 'Welding IoT Costing Sheet'
    : isEms
    ? 'EMS Costing Sheet'
    : `${sheet.subService || 'Costing'} Sheet`;

  const summaryData: any[][] = [
    [`${sheetTypeLabel} — ${sheet.clientName} (${sheet.subService || sheet.serviceCategory || 'Service'})`],
    [`Date: ${today}`],
    [],
  ];
  if (sheet.projectName) summaryData.push(['Project Name', sheet.projectName]);
  if (sheet.siteName) summaryData.push(['Site Location', sheet.siteName]);
  if (sheet.stationType) summaryData.push(['Station Type', sheet.stationType]);
  summaryData.push([]);

  let stepNumber = 1;

  // ══════════════════════════════════════════════
  //  CPM SHEETS
  // ══════════════════════════════════════════════
  if (isCpm) {
    const hwRows = (Array.isArray(sheet.cpmHardwareRows) ? sheet.cpmHardwareRows : Array.isArray(instObj.cpmHardwareRows) ? instObj.cpmHardwareRows : []).filter((r: any) => num(r.qty) > 0);
    const elecRows = (Array.isArray(sheet.cpmElectricalRows) ? sheet.cpmElectricalRows : Array.isArray(instObj.cpmElectricalRows) ? instObj.cpmElectricalRows : []).filter((r: any) => num(r.qty) > 0);
    const commRows = (Array.isArray(sheet.cpmCommissioningManpowerRows) ? sheet.cpmCommissioningManpowerRows : Array.isArray(instObj.cpmCommissioningManpowerRows) ? instObj.cpmCommissioningManpowerRows : Array.isArray(sheet.manpowerRows) ? sheet.manpowerRows : []).filter((r: any) => num(r.siteWorkingDays) > 0 || num(r.reportWorkingDays) > 0);
    const instManRows = (Array.isArray(sheet.cpmInstallationManpowerRows) ? sheet.cpmInstallationManpowerRows : Array.isArray(instObj.cpmInstallationManpowerRows) ? instObj.cpmInstallationManpowerRows : []).filter((r: any) => num(r.siteWorkingDays) > 0 || num(r.reportWorkingDays) > 0);
    const cloudRows = (Array.isArray(sheet.cpmCloudRows) ? sheet.cpmCloudRows : Array.isArray(instObj.cpmCloudRows) ? instObj.cpmCloudRows : []).filter((r: any) => num(r.qty) > 0);

    // ── Step: Hardware Capex ──
    if (hwRows.length > 0) {
      // Cols: A=Sl, B=Brand/Model, C=Item Description, D=Qty, E=UoM, F=Unit Cost, G=Unit Price, H=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Hardware Capex Matrix`],
        [],
        ['Sl', 'Brand / Model', 'Item Description', 'Qty', 'UoM', 'Unit Cost (₹)', 'Unit Price (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      hwRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty);
        const unitCost = num(r.unitCost);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const unitPrice = r.unitPrice !== undefined ? num(r.unitPrice) : Math.round(unitCost / Math.max(0.01, (100 - margin) / 100));
        const row = firstDataRow + idx;
        d.push([r.slNo || idx + 1, `${r.brand || ''} ${r.modelNo ? `(${r.modelNo})` : ''}`.trim(), r.itemDescription, qty, r.uom, unitCost, unitPrice, null]);
        // H = D * G  (Total Price = Qty × Unit Price)
        formulas[cell(7, row)] = `${cell(3, row)}*${cell(6, row)}`;
      });

      const totalRow = firstDataRow + hwRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', '', '', 'TOTAL', null]);
      formulas[cell(7, totalRow)] = `SUM(${cell(7, firstDataRow)}:${cell(7, firstDataRow + hwRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Hardware`, formulas);
      summaryData.push([`Total Hardware Costing (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Electrical Consumables ──
    if (elecRows.length > 0) {
      // Cols: A=Sl, B=Item, C=Qty, D=UoM, E=Unit Cost, F=Total Cost, G=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Electrical Hardware & Consumables`],
        [],
        ['Sl', 'Item Description', 'Qty', 'UoM', 'Unit Cost (₹)', 'Total Cost (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      elecRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty);
        const unitCost = num(r.unitCost);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const totalCost = qty * unitCost;
        const totalPrice = Math.round(totalCost / Math.max(0.01, (100 - margin) / 100));
        const row = firstDataRow + idx;
        d.push([r.slNo || idx + 1, r.itemDescription, qty, r.uom, unitCost, null, totalPrice]);
        // F = C * E  (Total Cost = Qty × Unit Cost)
        formulas[cell(5, row)] = `${cell(2, row)}*${cell(4, row)}`;
      });

      const totalRow = firstDataRow + elecRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', '', 'TOTAL', null]);
      formulas[cell(6, totalRow)] = `SUM(${cell(6, firstDataRow)}:${cell(6, firstDataRow + elecRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Electrical`, formulas);
      summaryData.push([`Total Electrical (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Commissioning Manpower ──
    if (commRows.length > 0) {
      buildManpowerTab(wb, commRows, `Step ${stepNumber}`, 'Testing & Commissioning Manpower', 'Engineer');
      summaryData.push([`Commissioning Manpower (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Installation Manpower ──
    if (instManRows.length > 0) {
      buildManpowerTab(wb, instManRows, `Step ${stepNumber}`, 'Installation Mandays & Field Crew', 'Technician');
      summaryData.push([`Installation Manpower (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Cloud / Software ──
    if (cloudRows.length > 0) {
      // Cols: A=Module, B=Qty, C=UoM, D=Unit Cost, E=Unit Price, F=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Software & Cloud Platform`],
        [],
        ['Module Description', 'Qty', 'UoM', 'Unit Cost (₹)', 'Unit Price (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      cloudRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty);
        const unitCost = num(r.unitCost);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const unitPrice = Math.round(unitCost / Math.max(0.01, (100 - margin) / 100));
        const row = firstDataRow + idx;
        d.push([r.itemDescription, qty, r.uom, unitCost, unitPrice, null]);
        // F = B * E  (Total Price = Qty × Unit Price)
        formulas[cell(5, row)] = `${cell(1, row)}*${cell(4, row)}`;
      });

      const totalRow = firstDataRow + cloudRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', 'TOTAL', null]);
      formulas[cell(5, totalRow)] = `SUM(${cell(5, firstDataRow)}:${cell(5, firstDataRow + cloudRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Cloud`, formulas);
      summaryData.push([`Cloud / Platform (₹)`, null]);
      stepNumber++;
    }
  }

  // ══════════════════════════════════════════════
  //  EMS / COMPRESSED AIR SHEETS
  // ══════════════════════════════════════════════
  else if (isEms) {
    const hwRows = (Array.isArray(sheet.emsHardwareRows) ? sheet.emsHardwareRows : Array.isArray(instObj.emsHardwareRows) ? instObj.emsHardwareRows : []).filter((r: any) => num(r.qty) > 0);
    const caaAutoRows = (Array.isArray(sheet.caaAutoManpowerRows) ? sheet.caaAutoManpowerRows : Array.isArray(instObj.caaAutoManpowerRows) ? instObj.caaAutoManpowerRows : []).filter((r: any) => num(r.siteWorkingDays) > 0 || num(r.reportWorkingDays) > 0);
    const caaInstRows = (Array.isArray(sheet.caaInstManpowerRows) ? sheet.caaInstManpowerRows : Array.isArray(instObj.caaInstManpowerRows) ? instObj.caaInstManpowerRows : []).filter((r: any) => num(r.siteWorkingDays) > 0 || num(r.reportWorkingDays) > 0);
    const mpRows = (Array.isArray(sheet.manpowerRows) ? sheet.manpowerRows : Array.isArray(instObj.emsManpowerRows) ? instObj.emsManpowerRows : []).filter((r: any) => num(r.siteWorkingDays) > 0 || num(r.reportWorkingDays) > 0);
    const pfRows = (Array.isArray(sheet.emsPlatformRows) ? sheet.emsPlatformRows : Array.isArray(instObj.emsPlatformRows) ? instObj.emsPlatformRows : []).filter((r: any) => num(r.qty) > 0);
    const rcRows = (Array.isArray(sheet.emsRecurringRows) ? sheet.emsRecurringRows : Array.isArray(instObj.emsRecurringRows) ? instObj.emsRecurringRows : []).filter((r: any) => num(r.qty) > 0);

    // ── Step: Hardware Supply ──
    if (hwRows.length > 0) {
      // Cols: A=No, B=Description, C=Qty, D=UoM, E=Unit Cost, F=Unit Price, G=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Hardware Supply Matrix`],
        [],
        ['No', 'Description / Scope', 'Qty', 'UoM', 'Unit Cost (₹)', 'Unit Price (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      hwRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty);
        const unitCost = num(r.unitCost);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const unitPrice = r.unitPrice !== undefined ? num(r.unitPrice) : Math.round(unitCost / Math.max(0.01, (100 - margin) / 100));
        const row = firstDataRow + idx;
        d.push([r.code || idx + 1, r.description, qty, r.uom, unitCost, unitPrice, null]);
        // G = C * F
        formulas[cell(6, row)] = `${cell(2, row)}*${cell(5, row)}`;
      });

      const totalRow = firstDataRow + hwRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', '', 'TOTAL', null]);
      formulas[cell(6, totalRow)] = `SUM(${cell(6, firstDataRow)}:${cell(6, firstDataRow + hwRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Hardware`, formulas);
      summaryData.push([`Total Hardware Costing (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Automation Manpower (compressed air) ──
    if (isCompressedAir && caaAutoRows.length > 0) {
      buildManpowerTab(wb, caaAutoRows, `Step ${stepNumber}`, 'Automation & Commissioning Engineering', 'Engineer');
      summaryData.push([`Automation Engineering (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Installation Manpower (compressed air) ──
    if (isCompressedAir && caaInstRows.length > 0) {
      buildManpowerTab(wb, caaInstRows, `Step ${stepNumber}`, 'Installation & Site Engineering', 'Technician');
      summaryData.push([`Installation Total (₹)`, null]);
      stepNumber++;
    }

    // ── Standard EMS Manpower (non-compressed air) ──
    if (!isCompressedAir && mpRows.length > 0) {
      buildManpowerTab(wb, mpRows, `Step ${stepNumber}`, 'Manpower & Engineering Expenses', 'Engineer');
      summaryData.push([`Manpower Total Price (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Platform Setup ──
    if (pfRows.length > 0) {
      // Cols: A=Description, B=Qty, C=UoM, D=Unit Cost, E=Unit Price, F=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: IoT Platform Setup & Cloud Configuration`],
        [],
        ['Platform Description', 'Qty', 'UoM', 'Unit Cost (₹)', 'Unit Price (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      pfRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty);
        const unitCost = num(r.unitCost);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const unitPrice = Math.round(unitCost / Math.max(0.01, (100 - margin) / 100));
        const row = firstDataRow + idx;
        d.push([r.description, qty, r.uom, unitCost, unitPrice, null]);
        // F = B * E
        formulas[cell(5, row)] = `${cell(1, row)}*${cell(4, row)}`;
      });

      const totalRow = firstDataRow + pfRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', 'TOTAL', null]);
      formulas[cell(5, totalRow)] = `SUM(${cell(5, firstDataRow)}:${cell(5, firstDataRow + pfRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Platform`, formulas);
      summaryData.push([`Platform Setup Price (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Recurring / Cloud ──
    if (rcRows.length > 0) {
      // Cols: A=Description, B=Qty, C=UoM, D=Monthly Cost, E=Monthly Price, F=Yearly Total
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Subscription & Cloud Charges (Yearly)`],
        [],
        ['Description', 'Qty', 'UoM', 'Monthly Cost (₹)', 'Monthly Price (₹)', 'Yearly Total (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      rcRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty);
        const monthlyCost = num(r.unitCostPerMonth || r.monthlyCost);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const monthlyPrice = r.monthlyPrice !== undefined ? num(r.monthlyPrice) : Math.round(monthlyCost / Math.max(0.01, (100 - margin) / 100));
        const row = firstDataRow + idx;
        d.push([r.description, qty, r.uom, monthlyCost, monthlyPrice, null]);
        // F = E * 12 * B  (Yearly = Monthly Price × 12 × Qty)
        formulas[cell(5, row)] = `${cell(4, row)}*12*${cell(1, row)}`;
      });

      const totalRow = firstDataRow + rcRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', 'TOTAL', null]);
      formulas[cell(5, totalRow)] = `SUM(${cell(5, firstDataRow)}:${cell(5, firstDataRow + rcRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Recurring`, formulas);
      summaryData.push([`Recurring Cloud Price/Yr (₹)`, null]);
      stepNumber++;
    }
  }

  // ══════════════════════════════════════════════
  //  WELDING / DIGIWELD SHEETS
  // ══════════════════════════════════════════════
  else if (isWelding) {
    const isDigiweld =
      sheet.subService?.toLowerCase().includes('digiweld') ||
      sheet.subService?.toLowerCase().includes('weld data');

    const swRows = (Array.isArray(sheet.weldingSoftwareRows) ? sheet.weldingSoftwareRows : []).filter(
      (r: any) => num(r.price) > 0 || (num(r.qty) > 0 && num(r.unitPrice) > 0),
    );
    const hwRows = (Array.isArray(sheet.weldingHardwareRows) ? sheet.weldingHardwareRows : []).filter(
      (r: any) => num(r.qty) > 0,
    );
    const cloudRows = (Array.isArray(sheet.weldingCloudRows) ? sheet.weldingCloudRows : []).filter(
      (r: any) => num(r.monthlyPrice) > 0 || num(r.yearlyPrice) > 0,
    );
    const instRows = (Array.isArray(sheet.weldingInstallationRows) ? sheet.weldingInstallationRows : []).filter(
      (r: any) => num(r.qty) > 0 || num(r.unitPrice) > 0,
    );

    // ── Welding IoT Only: Step 1 Hardware (NOT shown for Digiweld) ──
    if (!isDigiweld && hwRows.length > 0) {
      // Cols: A=Sl, B=Component, C=Qty, D=Unit Cost, E=Unit Price, F=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Hardware and Development Charges`],
        [],
        ['Sl No', 'Component Name', 'Qty', 'Unit Cost (₹)', 'Unit Price (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      hwRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty);
        const unitCost = num(r.unitCost);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const unitPrice = r.unitPrice !== undefined ? num(r.unitPrice) : Math.round(unitCost / Math.max(0.01, (100 - margin) / 100));
        const row = firstDataRow + idx;
        d.push([r.slNo || idx + 1, r.componentName || r.component || r.name, qty, unitCost, unitPrice, null]);
        // F = C * E
        formulas[cell(5, row)] = `${cell(2, row)}*${cell(4, row)}`;
      });

      const totalRow = firstDataRow + hwRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', 'TOTAL', null]);
      formulas[cell(5, totalRow)] = `SUM(${cell(5, firstDataRow)}:${cell(5, firstDataRow + hwRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Hardware`, formulas);
      summaryData.push([`Hardware Total (₹)`, null]);
      stepNumber++;
    }

    // ── Software / One-Time Cost (Digiweld Step 1 / Welding Step 2) ──
    if (swRows.length > 0) {
      const stepTitle = isDigiweld ? 'One Time Cost' : 'Software Development';
      // Cols: A=Sl, B=Scope Item, C=Description, D=Qty, E=Unit Cost, F=Unit Price, G=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: ${stepTitle}`],
        [],
        ['Sl', 'Scope Item / Component', 'Description & Deliverables', 'Qty', 'Unit Cost (₹)', 'Unit Price (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      swRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty !== undefined ? r.qty : 1);
        const unitPrice = num(r.unitPrice || r.price);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const unitCost = r.unitCost !== undefined ? num(r.unitCost) : Math.round(unitPrice * (1 - margin / 100));
        const row = firstDataRow + idx;
        d.push([idx + 1, r.item || '', r.description || '', qty, unitCost, unitPrice, null]);
        // G = D * F  (Total = Qty × Unit Price)
        formulas[cell(6, row)] = `${cell(3, row)}*${cell(5, row)}`;
      });

      const totalRow = firstDataRow + swRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', '', 'TOTAL', null]);
      formulas[cell(6, totalRow)] = `SUM(${cell(6, firstDataRow)}:${cell(6, firstDataRow + swRows.length - 1)})`;

      const tabLabel = isDigiweld ? 'One Time Cost' : 'Software';
      addSheet(wb, d, `Step ${stepNumber} - ${tabLabel}`, formulas);
      summaryData.push([isDigiweld ? `One Time Cost (₹)` : `Software Total (₹)`, null]);
      stepNumber++;
    }

    // ── Cloud Recurring (Digiweld Step 2 / Welding Step 3) ──
    if (cloudRows.length > 0) {
      const stepTitle = isDigiweld
        ? 'Recurring Cloud Infrastructure'
        : 'Cloud Charges';
      // Cols: A=Sl, B=Component, C=Description, D=Type, E=Monthly Cost, F=Monthly Price, G=Yearly Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: ${stepTitle}`],
        [],
        ['Sl', 'Component', 'Description', 'Type', 'Monthly Cost (₹)', 'Monthly Price (₹)', 'Yearly Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      cloudRows.forEach((r: any, idx: number) => {
        const monthlyPrice = num(r.monthlyPrice);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const monthlyCost = r.monthlyCost !== undefined ? num(r.monthlyCost) : (r.unitMonthlyCost !== undefined ? num(r.unitMonthlyCost) : Math.round(monthlyPrice * (1 - margin / 100)));
        const row = firstDataRow + idx;
        d.push([idx + 1, r.component || '', r.description || '', r.type || '', monthlyCost, monthlyPrice, null]);
        // G = F * 12  (Yearly = Monthly Price × 12)
        formulas[cell(6, row)] = `${cell(5, row)}*12`;
      });

      const totalRow = firstDataRow + cloudRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', '', 'TOTAL', null]);
      formulas[cell(6, totalRow)] = `SUM(${cell(6, firstDataRow)}:${cell(6, firstDataRow + cloudRows.length - 1)})`;

      const tabLabel = isDigiweld ? 'Cloud Recurring' : 'Cloud';
      addSheet(wb, d, `Step ${stepNumber} - ${tabLabel}`, formulas);
      summaryData.push([`Cloud Yearly Total (₹)`, null]);
      stepNumber++;
    }

    // ── Welding IoT Only: Installation (NOT shown for Digiweld) ──
    if (!isDigiweld && instRows.length > 0) {
      // Cols: A=Sl, B=Item, C=Qty, D=Unit Cost, E=Unit Price, F=Total Price
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Installation & Commissioning Charges`],
        [],
        ['Sl', 'Item / Scope', 'Qty', 'Unit Cost (₹)', 'Unit Price (₹)', 'Total Price (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      instRows.forEach((r: any, idx: number) => {
        const qty = num(r.qty || 1);
        const unitPrice = num(r.unitPrice || r.price);
        const margin = r.marginPct !== undefined ? num(r.marginPct) : sheetMargin;
        const unitCost = r.unitCost !== undefined ? num(r.unitCost) : Math.round(unitPrice * (1 - margin / 100));
        const row = firstDataRow + idx;
        d.push([idx + 1, r.item || r.scope || r.description, qty, unitCost, unitPrice, null]);
        // F = C * E
        formulas[cell(5, row)] = `${cell(2, row)}*${cell(4, row)}`;
      });

      const totalRow = firstDataRow + instRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', 'TOTAL', null]);
      formulas[cell(5, totalRow)] = `SUM(${cell(5, firstDataRow)}:${cell(5, firstDataRow + instRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Installation`, formulas);
      summaryData.push([`Installation Total (₹)`, null]);
      stepNumber++;
    }
  }

  // ══════════════════════════════════════════════
  //  GENERAL AUDIT SHEETS
  // ══════════════════════════════════════════════
  else {
    const rawMp = Array.isArray(sheet.manpowerRows) ? sheet.manpowerRows : [];
    const rawInst = Array.isArray(sheet.instrumentRows) ? sheet.instrumentRows : [];
    const rawExtra = Array.isArray(sheet.extraExpenseRows) ? sheet.extraExpenseRows : [];

    const mpRows = rawMp.filter((r: any) => num(r.siteWorkingDays) > 0 || num(r.reportWorkingDays) > 0);
    const instRows = rawInst.filter((r: any) => num(r.sets) > 0 && num(r.siteWorkingDays) > 0 && num(r.rentalCost) > 0);
    const extraRows = rawExtra.filter((r: any) => num(r.qty) > 0 && num(r.rate) > 0);

    // ── Step: Manpower ──
    if (mpRows.length > 0) {
      buildManpowerTab(wb, mpRows, `Step ${stepNumber}`, 'Manpower Resource Allocation & Mandays', 'Auditor');
      summaryData.push([`Manpower Total (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Instruments ──
    if (instRows.length > 0) {
      // Cols: A=Instrument, B=Sets, C=Site Days, D=Day Rate, E=Total Cost
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Rental Instruments`],
        [],
        ['Instrument', 'Sets', 'Site Days', 'Day Rate (₹)', 'Total Cost (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      instRows.forEach((r: any, idx: number) => {
        const row = firstDataRow + idx;
        d.push([r.instrumentName || r.name, num(r.sets), num(r.siteWorkingDays), num(r.rentalCost), null]);
        // E = B * C * D  (Total = Sets × Days × Rate)
        formulas[cell(4, row)] = `${cell(1, row)}*${cell(2, row)}*${cell(3, row)}`;
      });

      const totalRow = firstDataRow + instRows.length + 1;
      d.push([]);
      d.push(['', '', '', 'TOTAL', null]);
      formulas[cell(4, totalRow)] = `SUM(${cell(4, firstDataRow)}:${cell(4, firstDataRow + instRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Instruments`, formulas);
      summaryData.push([`Instruments Total (₹)`, null]);
      stepNumber++;
    }

    // ── Step: Extra Expenses ──
    if (extraRows.length > 0) {
      // Cols: A=Description, B=Category, C=Qty, D=Days, E=Rate, F=Total Cost
      const hdrRow = 3;
      const d: any[][] = [
        [`Step ${stepNumber}: Extra Logistics & Travel Expenses`],
        [],
        ['Expense / Description', 'Category', 'Qty', 'Days', 'Rate (₹)', 'Total Cost (₹)'],
      ];
      const formulas: Record<string, string> = {};
      const firstDataRow = hdrRow + 1;

      extraRows.forEach((r: any, idx: number) => {
        const row = firstDataRow + idx;
        d.push([r.description, r.category, num(r.qty), num(r.days || 1), num(r.rate), null]);
        // F = C * D * E  (Total = Qty × Days × Rate)
        formulas[cell(5, row)] = `${cell(2, row)}*${cell(3, row)}*${cell(4, row)}`;
      });

      const totalRow = firstDataRow + extraRows.length + 1;
      d.push([]);
      d.push(['', '', '', '', 'TOTAL', null]);
      formulas[cell(5, totalRow)] = `SUM(${cell(5, firstDataRow)}:${cell(5, firstDataRow + extraRows.length - 1)})`;

      addSheet(wb, d, `Step ${stepNumber} - Expenses`, formulas);
      summaryData.push([`Extra Expenses Total (₹)`, null]);
      stepNumber++;
    }
  }

  // ══════════════════════════════════════════════
  //  SUMMARY TAB  (insert as first sheet)
  // ══════════════════════════════════════════════
  summaryData.push([]);
  summaryData.push(['Final Customer Quotation (₹)', finalQuote]);
  summaryData.push(['Sustainabyte Base Cost (₹)', subtotalCost]);
  if (sheetBuffer) summaryData.push(['Buffer / Contingency %', `${sheetBuffer}%`]);

  // Now fill in summary row values by referencing step tab totals
  const summaryFormulas: Record<string, string> = {};
  const stepSheetNames = wb.SheetNames; // all step tabs added so far
  let summaryRowIdx = 0;

  for (let i = 0; i < summaryData.length; i++) {
    const row = summaryData[i];
    if (row.length >= 2 && row[1] === null) {
      // This is a step total row — link to the corresponding step tab's total
      if (summaryRowIdx < stepSheetNames.length) {
        const tabName = stepSheetNames[summaryRowIdx];
        const tabWs = wb.Sheets[tabName];
        // Find the TOTAL cell in that sheet (last column of last used row)
        if (tabWs && tabWs['!ref']) {
          const range = XLSX.utils.decode_range(tabWs['!ref']);
          const lastRow = range.e.r + 1; // 1-indexed
          const lastCol = range.e.c;
          const totalCellRef = cell(lastCol, lastRow);
          // Cross-sheet reference formula
          summaryFormulas[cell(1, i + 1)] = `'${tabName}'!${totalCellRef}`;
        }
        summaryRowIdx++;
      }
    }
  }

  addSheet(wb, summaryData, 'Summary', summaryFormulas);

  // Move Summary to first position
  const allNames = wb.SheetNames;
  const summaryIdx = allNames.indexOf('Summary');
  if (summaryIdx > 0) {
    allNames.splice(summaryIdx, 1);
    allNames.unshift('Summary');
    wb.SheetNames = allNames;
  }

  // ──────────────────────────────────────────────
  // Download
  // ──────────────────────────────────────────────
  const fileName = `${(sheet.clientName || 'Costing').replace(/[^a-zA-Z0-9 ]/g, '')}_${(sheet.subService || 'Sheet').replace(/[^a-zA-Z0-9 ]/g, '')}_Costing.xlsx`;
  XLSX.writeFile(wb, fileName);
}

// ══════════════════════════════════════════════
//  Shared: Manpower tab builder (reused across CPM, EMS, General)
// ══════════════════════════════════════════════
function buildManpowerTab(
  wb: XLSX.WorkBook,
  rows: any[],
  stepLabel: string,
  title: string,
  defaultRole: string,
) {
  // Cols: A=Member/Role, B=Site Days, C=Report Days, D=Site Rate, E=Report Rate, F=Food/Day, G=Total Cost
  const hdrRow = 3;
  const d: any[][] = [
    [`${stepLabel}: ${title}`],
    [],
    ['Member / Role', 'Site Days', 'Report Days', 'Site Rate (₹)', 'Report Rate (₹)', 'Food / Day (₹)', 'Total Cost (₹)'],
  ];
  const formulas: Record<string, string> = {};
  const firstDataRow = hdrRow + 1;

  rows.forEach((r: any, idx: number) => {
    const row = firstDataRow + idx;
    d.push([
      r.name
        ? `${r.name} — ${r.roleLevel?.replace('_', ' ') || r.role || defaultRole}`
        : r.roleLevel?.replace('_', ' ') || r.role || defaultRole,
      num(r.siteWorkingDays),
      num(r.reportWorkingDays),
      num(r.siteWorkCost),
      num(r.reportWorkCost),
      num(r.foodRatePerDay),
      null,
    ]);
    // G = (D + F) * B + E * C   →   Total = (SiteRate + Food) × SiteDays + ReportRate × ReportDays
    formulas[cell(6, row)] = `(${cell(3, row)}+${cell(5, row)})*${cell(1, row)}+${cell(4, row)}*${cell(2, row)}`;
  });

  const totalRow = firstDataRow + rows.length + 1;
  d.push([]);
  d.push(['', '', '', '', '', 'TOTAL', null]);
  formulas[cell(6, totalRow)] = `SUM(${cell(6, firstDataRow)}:${cell(6, firstDataRow + rows.length - 1)})`;

  const tabName = `${stepLabel} - ${title.split(' ')[0]}`;
  addSheet(wb, d, tabName.substring(0, 31), formulas);
}
