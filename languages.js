let languagesList = [];
const LAZY_BATCH = 200;
const proficiencyOptions = [
  "Básico","Intermediário","Avançado","Fluente","Nativo"
];

async function loadLanguages() {
  try {
    // Fetches the list of languages from a text file
    const response = await fetch('languages.txt');
    const text = await response.text();
    // Splits text by line, trims spaces, and filters out empty lines
    languagesList = text.split('\n').map(l => l.trim()).filter(l => l);
  } catch(e) {
    console.error('Could not load languages.txt', e);
  }
}

function addLanguage() {
  const languagesContainer = document.getElementById('languagesContainer');

  // Creates container for language input and proficiency select
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.gap = '10px';
  container.style.position = 'relative';
  container.style.marginTop = '8px';

  // Creates input field for typing/searching language
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Idiomas';
  input.style.flex = '2';
  container.appendChild(input);

  // Creates proficiency dropdown select
  const profSelect = document.createElement('select');
  profSelect.style.flex = '1';
  proficiencyOptions.forEach(opt => {
    const option = document.createElement('option');
    option.value = opt;
    option.text = opt;
    profSelect.appendChild(option);
  });
  container.appendChild(profSelect);

  // Creates custom dropdown for filtered language results
  const dropdown = document.createElement('div');
  dropdown.style.position = 'absolute';
  dropdown.style.top = '100%';
  dropdown.style.left = '0';
  dropdown.style.right = '0';
  dropdown.style.maxHeight = '200px';
  dropdown.style.overflowY = 'auto';
  dropdown.style.border = '1px solid #ccc';
  dropdown.style.background = '#fff';
  dropdown.style.display = 'none';
  dropdown.style.zIndex = '999';
  container.appendChild(dropdown);

  let currentFiltered = [];
  let renderedCount = 0;

  // Renders a batch of language options (lazy loading for performance)
  function renderBatch() {
    const batch =
      currentFiltered.slice(renderedCount, renderedCount + LAZY_BATCH);

    batch.forEach(lang => {
      const opt = document.createElement('div');
      opt.textContent = lang;
      opt.style.padding = '4px 8px';
      opt.style.cursor = 'pointer';
      opt.addEventListener('mouseenter', ()=> opt.style.background='#f0f0f0');
      opt.addEventListener('mouseleave', ()=> opt.style.background='#fff');
      opt.addEventListener('click', ()=>{
        input.value = lang;
        dropdown.style.display='none';
      });
      dropdown.appendChild(opt);
    });
    renderedCount += batch.length;
  }

  // Filters languages based on input text and shows them in dropdown
  function filterAndRender() {
    dropdown.innerHTML = '';
    renderedCount = 0;
    const filterText = input.value.toLowerCase();
    currentFiltered = languagesList.filter(
      lang => lang.toLowerCase().includes(filterText)
    );
    renderBatch();
    dropdown.style.display = currentFiltered.length ? 'block' : 'none';
  }

  // Triggers filter when input gains focus or changes
  input.addEventListener('focus', filterAndRender);
  input.addEventListener('input', filterAndRender);

  // Loads more options when scrolling reaches bottom of dropdown
  dropdown.addEventListener('scroll', () => {
    if(dropdown.scrollTop + dropdown.clientHeight >= dropdown.scrollHeight - 5){
      renderBatch();
    }
  });

  // Closes dropdown when clicking outside the container
  document.addEventListener('click', (e) => {
    if(!container.contains(e.target)) dropdown.style.display='none';
  });

  // Appends the full language + proficiency block to container
  languagesContainer.appendChild(container);
}
