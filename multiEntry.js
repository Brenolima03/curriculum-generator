function moveAddButtonToEnd(containerId, addFnName){
  // Moves '+' button to the end of the container
  const container = document.getElementById(containerId);
  const addButton =
    container.parentNode.querySelector(`button[onclick="${addFnName}()"]`);
  if (addButton) container.after(addButton);
}

function addMultiEntry(containerId){
  const container = document.getElementById(containerId);
  const div = document.createElement('div'); 
  div.className = 'multi-entry';

  const input = document.createElement('input'); 
  input.type = 'text';
  div.appendChild(input); 

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '-';
  removeBtn.type = 'button';
  removeBtn.className = 'add-button';
  removeBtn.onclick = () => div.remove();
  div.appendChild(removeBtn);

  container.appendChild(div);
  moveAddButtonToEnd(
    containerId, `add${containerId.replace('Container','')
      .charAt(0).toUpperCase()}${containerId.replace('Container','').slice(1)}`
  );
}

function addQualification() {
  const qualificationsContainer =
    document.getElementById('qualificationsContainer');

  const container = document.createElement('div');
  container.classList.add('multi-entry');

  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Nome da Qualificação';
  input.style.flex = '2';
  container.appendChild(input);

  const select = document.createElement('select');
  const levels = ['Básico','Intermediário','Avançado','Especialista'];
  levels.forEach(level => {
    const option = document.createElement('option');
    option.value = level;
    option.textContent = level;
    select.appendChild(option);
  });
  container.appendChild(select);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '-';
  removeBtn.type = 'button';
  removeBtn.className = 'add-button';
  removeBtn.onclick = () => container.remove();
  container.appendChild(removeBtn);

  qualificationsContainer.appendChild(container);
  moveAddButtonToEnd('qualificationsContainer', 'addQualification');
}

function addEducation() {
  const container = document.getElementById('educationContainer');

  const entry = document.createElement('div');
  entry.classList.add('multi-entry');

  const institution = document.createElement('input');
  institution.type = 'text';
  institution.placeholder = 'Instituição';
  institution.style.flex = '2';
  entry.appendChild(institution);

  const course = document.createElement('input');
  course.type = 'text';
  course.placeholder = 'Curso';
  course.style.flex = '2';
  entry.appendChild(course);

  const startDate = document.createElement('input');
  startDate.type = 'text';
  startDate.placeholder = 'Início (MM/AAAA)';
  startDate.addEventListener('input', maskDate);
  entry.appendChild(startDate);

  const endDate = document.createElement('input');
  endDate.type = 'text';
  endDate.placeholder = 'Fim (MM/AAAA)';
  endDate.addEventListener('input', maskDate);
  entry.appendChild(endDate);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '-';
  removeBtn.type = 'button';
  removeBtn.className = 'add-button';
  removeBtn.onclick = () => entry.remove();
  entry.appendChild(removeBtn);

  container.appendChild(entry);
  moveAddButtonToEnd('educationContainer', 'addEducation');
}

function addExperience() {
  const container = document.getElementById('experienceContainer');

  const entry = document.createElement('div');
  entry.classList.add('multi-entry');

  const company = document.createElement('input');
  company.type = 'text';
  company.placeholder = 'Empresa';
  company.style.flex = '2';
  entry.appendChild(company);

  const role = document.createElement('input');
  role.type = 'text';
  role.placeholder = 'Cargo';
  role.style.flex = '2';
  entry.appendChild(role);

  const startDate = document.createElement('input');
  startDate.type = 'text';
  startDate.placeholder = 'Início (MM/AAAA)';
  startDate.addEventListener('input', maskDate);
  entry.appendChild(startDate);

  const endDate = document.createElement('input');
  endDate.type = 'text';
  endDate.placeholder = 'Fim (MM/AAAA)';
  endDate.addEventListener('input', maskDate);
  entry.appendChild(endDate);

  const removeBtn = document.createElement('button');
  removeBtn.textContent = '-';
  removeBtn.type = 'button';
  removeBtn.className = 'add-button';
  removeBtn.onclick = () => entry.remove();
  entry.appendChild(removeBtn);

  container.appendChild(entry);
  moveAddButtonToEnd('experienceContainer', 'addExperience');
}
