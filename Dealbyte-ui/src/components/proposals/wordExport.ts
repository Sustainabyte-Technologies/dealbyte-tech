export interface WordExportOptions {
  proposalRef: string;
  proposalDate: string;
  clientName: string;
  clientLogo?: string;
  serviceName?: string;
  scopeOfWork?: string;
  commercialRows?: Array<{ sl?: number | string; name: string; desc?: string; price: number; isRecurring?: boolean }>;
  finalPrice: number;
  formatCurrency: (n: number) => string;
  isCpmChillerManagement?: boolean;
  origin: string;
  fallbackPages?: string[];
  costingSheet?: any;
  projectName?: string;
  totalPages?: number;
}

/* ── Wrap each page in a clean outer border box with header logo and 3-column footer ── */
function wrapWordPage(
  pageNum: number,
  totalPages: number,
  ref: string,
  origin: string,
  contentHtml: string
): string {
  return `
<div style="page-break-after: ${pageNum < totalPages ? 'always' : 'auto'}; margin-bottom: 24pt; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="border: 2pt solid #0f172a; width: 100%; border-collapse: collapse; background-color: #ffffff;">
    <tr>
      <td style="padding: 20pt 24pt 10pt 24pt; vertical-align: top; min-height: 720pt;">
        <!-- Top Header with Right Aligned Logo -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom: 1pt solid #e2e8f0; padding-bottom: 8pt; margin-bottom: 14pt;">
          <tr>
            <td align="right" style="vertical-align: middle; text-align: right;">
              <img src="${origin}/Company-Logo-Light.png" alt="Sustainabyte Technologies Logo" width="135" style="width: 135pt; max-width: 135pt; height: auto; display: block; margin-left: auto;" />
            </td>
          </tr>
        </table>

        <!-- Page Content -->
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #0f172a;">
          ${contentHtml}
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 24pt 14pt 24pt; vertical-align: bottom;">
        <!-- Footer Table (3-column layout) -->
        <table width="100%" cellpadding="0" cellspacing="0" style="border-top: 1pt solid #cbd5e1; padding-top: 6pt; margin-top: 14pt; width: 100%;">
          <tr>
            <td align="left" style="font-size: 8pt; color: #64748b; font-family: 'Segoe UI', Arial, sans-serif; width: 33%; text-align: left;">
              Ref: <strong style="color: #334155;">${ref}</strong>
            </td>
            <td align="center" style="font-size: 8pt; color: #64748b; font-family: 'Segoe UI', Arial, sans-serif; width: 34%; text-align: center;">
              Confidential &mdash; Sustainabyte Technologies Pvt Ltd
            </td>
            <td align="right" style="font-size: 8pt; color: #334155; font-weight: bold; font-family: 'Segoe UI', Arial, sans-serif; width: 33%; text-align: right;">
              Page ${pageNum} of ${totalPages}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</div>`;
}

/* ── Full HTML Document Wrapper for Word (.doc) ── */
function wrapDocumentShell(ref: string, clientName: string, bodyPagesHtml: string): string {
  return `<html xmlns:o='urn:schemas-microsoft-com:office:office'
        xmlns:w='urn:schemas-microsoft-com:office:word'
        xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset='utf-8'>
  <title>${ref} — ${clientName}</title>
  <!--[if gte mso 9]><xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml><![endif]-->
  <style>
    @page { size: A4 portrait; margin: 12mm 15mm 12mm 15mm; }
    body { font-family: 'Segoe UI', Arial, Calibri, sans-serif; font-size: 12pt; line-height: 1.65; color: #1e293b; background: #ffffff; margin: 0; padding: 0; }
    h1, h2, h3, h4 { font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 0 0 8pt 0; }
    p { font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; margin: 0 0 8pt 0; line-height: 1.65; }
    table { border-collapse: collapse; }
    img { max-width: 100%; height: auto; }
    strong { font-weight: 700; }
  </style>
</head>
<body>
  ${bodyPagesHtml}
</body>
</html>`;
}

export function generateWordDocument(opts: WordExportOptions): string {
  const {
    proposalRef: ref,
    proposalDate,
    clientName,
    clientLogo,
    serviceName = 'Energy Management Solution',
    scopeOfWork = '',
    commercialRows = [],
    finalPrice,
    formatCurrency,
    origin,
    totalPages = 5,
  } = opts;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 1: COVER PAGE
  ═══════════════════════════════════════════════════════════════════════ */
  const clientLogoHtml = clientLogo
    ? `<div style="text-align: center; margin: 24pt 0;">
         <img src="${clientLogo.startsWith('http') ? clientLogo : origin + (clientLogo.startsWith('/') ? '' : '/') + clientLogo}" alt="${clientName} Logo" width="160" style="max-width: 160pt; max-height: 80pt; height: auto; display: block; margin: 0 auto;" />
       </div>`
    : `<table width="100%" cellpadding="10" cellspacing="0" style="margin: 24pt 0; text-align: center;">
         <tr>
           <td align="center" style="background-color: #f8fafc; border: 1pt solid #e2e8f0; border-radius: 8pt;">
             <strong style="font-size: 14pt; color: #0f172a; font-family: 'Segoe UI', Arial, sans-serif;">${clientName}</strong>
           </td>
         </tr>
       </table>`;

  const p1Content = `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30pt 0 20pt 0;">
      <tr>
        <td align="center" style="text-align: center;">
          <h1 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; line-height: 1.4; margin: 0 0 18pt 0;">
            Techno Commercial Proposal for<br/>${serviceName}
          </h1>

          ${clientLogoHtml}

          <div style="margin-top: 24pt;">
            <p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; color: #334155; margin: 0 0 6pt 0;">
              Quotation No: <strong style="font-family: 'Courier New', monospace; color: #0f172a;">${ref}</strong>
            </p>
            <p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; color: #334155; margin: 0;">
              Date: <strong style="color: #0f172a;">${proposalDate}</strong>
            </p>
          </div>
        </td>
      </tr>
    </table>

    <table width="100%" cellpadding="8" cellspacing="0" style="border-top: 1pt solid #cbd5e1; margin-top: 50pt; font-family: 'Segoe UI', Arial, sans-serif; font-size: 9pt; line-height: 1.5; color: #334155;">
      <tr>
        <td width="50%" style="vertical-align: top; padding-right: 10pt;">
          <p style="font-weight: bold; color: #0f172a; text-transform: uppercase; margin: 0 0 3pt 0; font-size: 9.5pt;">COPYRIGHT</p>
          <p style="margin: 0;">&copy; This Report is the copyright of <strong><u>Sustainabyte Technologies Pvt Ltd</u></strong>. Any unauthorised reproduction or usage by any person other than the addressee is strictly prohibited.</p>
        </td>
        <td width="50%" style="vertical-align: top; padding-left: 10pt;">
          <p style="font-weight: bold; color: #0f172a; text-transform: uppercase; margin: 0 0 3pt 0; font-size: 9.5pt;">CONFIDENTIAL</p>
          <p style="margin: 0;">All reasonable precautionary methods in handling the document and the information contained herein should be taken to prevent any third party from obtaining access. No responsibility is taken by <u>Sustainabyte Technologies Pvt Ltd</u> for the use of this document by any third party.</p>
        </td>
      </tr>
    </table>
  `;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 2: ABOUT SUSTAINABYTE
  ═══════════════════════════════════════════════════════════════════════ */
  const p2Content = `
    <h2 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 0 0 14pt 0;">
      About Sustainabyte:
    </h2>
    <p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 0 0 12pt 0;">
      Sustainabyte is a private limited company, based out in Chennai, with client base spreading across 3 countries. It is a climate-tech start-up, predominantly focussing on energy conservation methodologies across Industries, Commercial building and residential complexes.<br/>
      Sustainabyte.ai is dedicated to leveraging advanced technology for global sustainability. Our mission is to minimize environmental impact while enhancing operational efficiency through innovative solutions.
    </p>
    <p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 0 0 12pt 0;">
      Sustainabyte is a technology-driven sustainability company, providing cutting-edge solutions for enterprises, to identify, plan and operationalize their Net Zero Carbon ambitions.<br/>
      Our mission is to deliver sustainable prosperity for companies, by balancing people, planet and profit. We demonstrate this by leveraging proprietary machine-learning algorithms, which provide measurable outcomes.
    </p>
    <p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 0 0 12pt 0;">
      Our goal is to collaborate with companies and help them to work smarter, make critical decisions more quickly and consume less. In addition, by doing this at scale, we will make a significant impact on the carbon footprint of commercial and industrial assets, globally.<br/>
      At Sustainabyte, we understand how important it is to be productive and sustainable. As a first step, we provide expert advisory to create a blueprint for sustainability roadmap and Net Zero Carbon Goals.
    </p>
    <p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 0 0 12pt 0;">
      We implement our flagship IoT solution — OptiByte — our technology platform, as an overlay on the client&apos;s existing systems, connecting data points to provide a bird&apos;s eye view, which, really is making the invisible, visible. Our reporting module then presents the ESG scores, operational efficiency KPI has and compares it against the milestones. This drives a program of continuous improvement by identifying improvement opportunities and recommended changes to deliver empirical and tangible sustainability goals. We pride in delivering results as early as in 30-60 days.
    </p>
  `;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 3: SCOPE OF WORK
  ═══════════════════════════════════════════════════════════════════════ */
  const scopeLines = (scopeOfWork || '').split('\n').map(l => l.trim()).filter(Boolean);
  let formattedScopeHtml = '';
  let inUl = false;

  scopeLines.forEach(line => {
    const isBullet = line.startsWith('•') || line.startsWith('●') || line.startsWith('-') || line.startsWith('*');
    const isHeader = (line.endsWith(':') || line === line.toUpperCase()) && !isBullet && line.length < 60;

    if (isHeader) {
      if (inUl) {
        formattedScopeHtml += '</ul>';
        inUl = false;
      }
      formattedScopeHtml += `<h3 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 16pt 0 6pt 0;">${line}</h3>`;
    } else if (isBullet) {
      if (!inUl) {
        formattedScopeHtml += `<ul style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 4pt 0 10pt 20pt; padding: 0;">`;
        inUl = true;
      }
      formattedScopeHtml += `<li style="margin-bottom: 4pt;">${line.replace(/^[•●\-*]\s*/, '')}</li>`;
    } else {
      if (inUl) {
        formattedScopeHtml += '</ul>';
        inUl = false;
      }
      formattedScopeHtml += `<p style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 0 0 8pt 0;">${line}</p>`;
    }
  });

  if (inUl) {
    formattedScopeHtml += '</ul>';
  }

  const p3Content = `
    <h2 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 0 0 12pt 0;">
      Scope of Work:
    </h2>
    <div style="font-family: 'Segoe UI', Arial, sans-serif;">
      ${formattedScopeHtml || '<p style="font-size: 12pt; color: #475569;">Detailed scope as specified in the agreed project specifications.</p>'}
    </div>
  `;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 4: COMMERCIAL BREAKDOWN
  ═══════════════════════════════════════════════════════════════════════ */
  const defaultCommercialRows = commercialRows.length > 0
    ? commercialRows
    : [
        {
          sl: 1,
          name: serviceName,
          desc: 'End-to-end scope of work, implementation, deliverables, validation and technical support as detailed in the scope of work.',
          price: finalPrice,
          isRecurring: false,
        },
      ];

  const rowsHtml = defaultCommercialRows
    .map(
      (r, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        <td style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; text-align: center; font-weight: bold; color: #475569; font-size: 11pt;">${r.sl || idx + 1}</td>
        <td style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; font-weight: bold; color: #0f172a; font-size: 12pt;">${r.name}</td>
        <td style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; color: #334155; font-size: 11pt;">${r.desc || '-'}</td>
        <td style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; text-align: right; font-weight: bold; color: #0f172a; font-size: 12pt;">${formatCurrency(r.price)} ${r.isRecurring ? '<span style="font-size: 9pt; color: #64748b;">/ yr</span>' : ''}</td>
      </tr>
    `
    )
    .join('');

  const p4Content = `
    <h2 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 0 0 12pt 0;">
      Commercial Investment &amp; Pricing Breakdown:
    </h2>
    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1pt solid #cbd5e1; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; margin-bottom: 16pt;">
      <thead>
        <tr style="background-color: #f1f5f9; border-bottom: 1.5pt solid #cbd5e1; font-weight: bold; color: #0f172a;">
          <th style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; text-align: center; width: 35pt; font-size: 11pt;">Sl</th>
          <th style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; text-align: left; width: 140pt; font-size: 11pt;">Deliverable Item / Scope</th>
          <th style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; text-align: left; font-size: 11pt;">Description &amp; Deliverables</th>
          <th style="padding: 8pt 10pt; border: 1pt solid #cbd5e1; text-align: right; width: 100pt; font-size: 11pt;">Total Price</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
      <tfoot>
        <tr style="background-color: #0f172a; color: #ffffff; font-weight: bold;">
          <td colspan="3" style="padding: 10pt 12pt; text-align: left; font-size: 11pt; text-transform: uppercase;">
            TOTAL COMMERCIAL INVESTMENT (INCL. ALL EXPENSES)
          </td>
          <td style="padding: 10pt 12pt; text-align: right; font-size: 13pt; color: #34d399; font-weight: bold;">
            ${formatCurrency(finalPrice)}
          </td>
        </tr>
      </tfoot>
    </table>
  `;

  /* ═══════════════════════════════════════════════════════════════════════
     PAGE 5: TERMS & CONDITIONS & SIGN-OFF
  ═══════════════════════════════════════════════════════════════════════ */
  const p5Content = `
    <h2 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 0 0 10pt 0;">
      NOTE:
    </h2>
    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1pt solid #cbd5e1; font-family: 'Segoe UI', Arial, sans-serif; font-size: 10.5pt; margin-bottom: 12pt;">
      <tr style="background-color: #f1f5f9; font-weight: bold; color: #0f172a;">
        <td style="border: 1pt solid #cbd5e1; width: 35pt; text-align: center;">S No</td>
        <td style="border: 1pt solid #cbd5e1;">Description</td>
        <td style="border: 1pt solid #cbd5e1; width: 90pt; text-align: right;">Scope</td>
      </tr>
      <tr>
        <td style="border: 1pt solid #cbd5e1; text-align: center; font-weight: bold;">1</td>
        <td style="border: 1pt solid #cbd5e1; color: #1e293b;">From Chennai to Site up and down, local transport, food and accommodation charges will be under client scope.</td>
        <td style="border: 1pt solid #cbd5e1; text-align: right; font-weight: bold; color: #0f172a;">At Actual</td>
      </tr>
    </table>

    <h2 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 14pt 0 6pt 0;">
      Support required from the client:
    </h2>
    <ul style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 0 0 12pt 20pt; padding: 0;">
      <li style="margin-bottom: 4pt;">SPOC (Single point of Contact) from the client’s team is required to coordinate and facilitate smooth implementation, testing, and ongoing support for the system.</li>
      <li style="margin-bottom: 4pt;">Necessary site clearances, power, and safe access during the execution period.</li>
    </ul>

    <h2 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 14pt 0 6pt 0;">
      Terms of Payment:
    </h2>
    <ul style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 12pt; line-height: 1.7; color: #1e293b; margin: 0 0 12pt 20pt; padding: 0;">
      <li style="margin-bottom: 4pt;">100% advance against Proforma Invoice before commencement of work.</li>
      <li style="margin-bottom: 4pt;">Taxes: GST @ 18% extra as applicable.</li>
      <li style="margin-bottom: 4pt;">Validity: 30 Days from date of proposal.</li>
    </ul>

    <h2 style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 20pt; font-weight: bold; color: #0f172a; text-decoration: underline; margin: 14pt 0 6pt 0;">
      Bank Account Details &amp; Commercial Authorization:
    </h2>
    <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%; border: 1pt solid #cbd5e1; font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt;">
      <tr>
        <td width="35%" style="border: 1pt solid #cbd5e1; font-weight: bold; background-color: #f8fafc; color: #334155;">Account Name</td>
        <td style="border: 1pt solid #cbd5e1; font-weight: bold; color: #0f172a;">Sustainabyte Technologies Pvt Ltd</td>
      </tr>
      <tr>
        <td style="border: 1pt solid #cbd5e1; font-weight: bold; background-color: #f8fafc; color: #334155;">Bank Name</td>
        <td style="border: 1pt solid #cbd5e1;">HDFC Bank</td>
      </tr>
      <tr>
        <td style="border: 1pt solid #cbd5e1; font-weight: bold; background-color: #f8fafc; color: #334155;">Account Number</td>
        <td style="border: 1pt solid #cbd5e1; font-family: 'Courier New', monospace; font-weight: bold; color: #0f172a;">50200086754321</td>
      </tr>
      <tr>
        <td style="border: 1pt solid #cbd5e1; font-weight: bold; background-color: #f8fafc; color: #334155;">IFSC Code</td>
        <td style="border: 1pt solid #cbd5e1; font-family: 'Courier New', monospace; font-weight: bold; color: #0f172a;">HDFC0001234</td>
      </tr>
    </table>
  `;

  /* ═══════════════════════════════════════════════════════════════════════
     ASSEMBLE ALL PAGES INTO WORD XML SHELL
  ═══════════════════════════════════════════════════════════════════════ */
  const p1 = wrapWordPage(1, totalPages, ref, origin, p1Content);
  const p2 = wrapWordPage(2, totalPages, ref, origin, p2Content);
  const p3 = wrapWordPage(3, totalPages, ref, origin, p3Content);
  const p4 = wrapWordPage(4, totalPages, ref, origin, p4Content);
  const p5 = wrapWordPage(5, totalPages, ref, origin, p5Content);

  const allPages = [p1, p2, p3, p4, p5].join('\n');
  return wrapDocumentShell(ref, clientName, allPages);
}
