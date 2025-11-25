function generatePdf() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPos = 20;
  const pageMargin = 15;
  const lineSpacing = 8;
  const dataOffset = 40;

  // --------- COLLECT FORM DATA ---------
  const personalInfo = {
    fullName: document.getElementById('fullname').value,
    objective: document.getElementById('objective').value,
    city: document.getElementById('city').value,
    state: document.getElementById('state').value,
    postalCode: document.getElementById('cep').value,
    telephone: document.getElementById('telephone').value,
    email: document.getElementById('email').value,
    nationality: document.getElementById('nationality').value,
    civilStatus: document.getElementById('civilState').value,
    hasChildren: document.getElementById('hasChildren').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value
  };

  // --------- HELPERS ---------
  // Checks if content will overflow the page and creates a new page if needed
  function checkPageBreak(extra = 0) {
    if (yPos + extra > pageHeight - pageMargin) {
      pdf.addPage();
      yPos = pageMargin;
    }
  }

  // Draws a horizontal line separator
  function setLine(color = [200, 200, 200]) { // default light gray
    pdf.setLineWidth(0.3);
    pdf.setDrawColor(...color); // spreads the RGB array
    pdf.line(pageMargin, yPos, pageWidth - pageMargin, yPos);
  }

  // Adds a section title with spacing and underline
  function addSectionTitle(
    title, spacingBefore = 4, spacingAfter = 4, fontSize = 12
  ) {
    checkPageBreak(spacingBefore + spacingAfter);
    yPos += spacingBefore;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(fontSize);
    pdf.text(title, pageMargin, yPos);
    yPos += 5;

    setLine();
    yPos += spacingAfter + 8;
    pdf.setFont('helvetica', 'normal');
  }

  // Adds a label + value in one line
  function addLabeledLine(label, text, offset = dataOffset) {
    if (!text) return;
    checkPageBreak(lineSpacing + 2);
    pdf.setFont('helvetica', 'bold');
    pdf.text(label + ':', pageMargin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(text, pageMargin + offset, yPos);
    yPos += lineSpacing;
  }

  // Collects values from a container (input/select children)
  function collectItems(containerId) {
    const container = document.getElementById(containerId);
    return Array.from(container.children).map(entry =>
      Array.from(entry.querySelectorAll('input, select'))
           .map(el => el.value.trim())
           .filter(Boolean)
    );
  }

  // --------- BLOCK-AWARE FUNCTIONS ---------
  // Adds a detailed section (label + values) with page-break awareness
  function addDetailedSection(title, items, labels) {
    if (!items.length) return;

    // Calculates block height to avoid breaking across pages
    let blockHeight = items.reduce((total, values) => {
      return total + labels.length * lineSpacing + 6;
    }, 0);
    blockHeight += 12; // section title height

    if (yPos + blockHeight > pageHeight - pageMargin) {
      pdf.addPage();
      yPos = pageMargin;
    }

    addSectionTitle(title);

    items.forEach(values => {
      labels.forEach(([label, index]) => {
        let text = '';

        if (Array.isArray(index))
          if (values[index[0]] && values[index[1]])
            text = `${values[index[0]]} - ${values[index[1]]}`;
          else text = values[index[0]] || values[index[1]] || '';
        else text = values[index] || '';

        addLabeledLine(label, text);
      });
      yPos += 2; // spacing between entries
    });

    yPos += 8; // spacing after block
  }

  // Adds a bullet-point section (e.g. skills, languages) with page-break awareness
  function addBulletSection(title, items, formatFn) {
    if (!items.length) return;

    // Calculates block height to avoid breaking across pages
    let blockHeight = items.reduce((total, values) => {
      let lines =
        pdf.splitTextToSize(formatFn(values), pageWidth - pageMargin * 2 - 5);

      return total + lines.length * lineSpacing + 6;
    }, 0);
    blockHeight += 12; // section title height

    if (yPos + blockHeight > pageHeight - pageMargin) {
      pdf.addPage();
      yPos = pageMargin;
    }

    addSectionTitle(title);

    items.forEach(values => {
      let lines =
        pdf.splitTextToSize(formatFn(values), pageWidth - pageMargin * 2 - 5);

      lines.forEach(line => {
        pdf.text(`• ${line}`, pageMargin + 5, yPos);
        yPos += lineSpacing;
      });
      yPos += 2; // spacing between bullets
    });

    yPos += 8; // spacing after block
  }

  // --------- NAME ---------
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  checkPageBreak(10);
  pdf.text(personalInfo.fullName || '', pageMargin, yPos);
  yPos += 8;

  setLine([173, 212, 230]); // custom color for main separator

  yPos += 12;

  // --------- PERSONAL INFO ---------
  const personalInfoEntries = [
    ["Cidade / Estado",
      personalInfo.city && personalInfo.state ?
      `${personalInfo.city} - ${personalInfo.state}` :
      personalInfo.city || personalInfo.state || ''
    ],
    ["CEP", personalInfo.postalCode],
    ["Telefone", personalInfo.telephone],
    ["Email", personalInfo.email],
    ["Nacionalidade", personalInfo.nationality],
    ["Estado Civil", personalInfo.civilStatus],
    ["Filhos", personalInfo.hasChildren],
    ["Idade", personalInfo.age],
    ["Gênero", personalInfo.gender]
  ];
  pdf.setFontSize(12);
  personalInfoEntries.forEach(([label, value]) => addLabeledLine(label, value));
  yPos += 6;

  // --------- OBJECTIVE ---------
  if (personalInfo.objective) {
    addSectionTitle("Objetivo:");
    pdf.setFontSize(12);
    pdf.splitTextToSize(personalInfo.objective, pageWidth - pageMargin * 2 - 5)
       .forEach(line => {
         checkPageBreak(lineSpacing);
         pdf.text(line, pageMargin, yPos);
         yPos += lineSpacing;
       });
    yPos += 8;
  }

  // --------- GENERATE SECTIONS ---------
  addDetailedSection(
    'Formação Acadêmica', collectItems('educationContainer'),
    [['Instituição', 1], ['Curso', 0], ['Período', [2, 3]]]
  );

  addDetailedSection(
    'Experiências Profissionais', collectItems('experienceContainer'),
    [['Empresa', 1], ['Cargo', 0], ['Período', [2, 3]]]
  );

  addBulletSection(
    'Idiomas', collectItems('languagesContainer'),
    values => values[0] + (values[1] ? ` (${values[1]})` : '')
  );

  addBulletSection(
    'Cursos Extracurriculares', collectItems('coursesContainer'),
    values => values[0]
  );

  addBulletSection(
    'Informações Adicionais', collectItems('additionalContainer'),
    values => values.join(" | ")
  );

  // Saves PDF file with the first name or fallback name
  pdf.save(
    `Curriculo_${personalInfo.fullName.split(' ')[0] || 'Curriculo'}.pdf`
  );
}
