function maskCEP(e) { 
  // Keeps only digits and limits to 8 characters
  let value = e.target.value.replace(/\D/g,'').slice(0,8); 
  // Adds dash after 5 digits if length is greater than 5
  if (value.length>5) value = value.slice(0,5)+'-'+value.slice(5); 
  // Updates input value with masked format
  e.target.value = value; 
}

function maskTelephone(e) { 
  // Keeps only digits and limits to 11 characters
  let value = e.target.value.replace(/\D/g,'').slice(0,11); 
  if (value.length>6)
    // Formats as (XX) XXXXX-XXXX when more than 6 digits
    value = `(${value.slice(0,2)}) ${value.slice(2,7)}-${value.slice(7)}`; 
  else if (value.length>2) 
    // Formats as (XX) XXXX... when more than 2 digits
    value = `(${value.slice(0,2)}) ${value.slice(2)}`; 
  else if (value.length>0) 
    // Formats as (X when less than 2 digits
    value = `(${value}`; 
  // Updates input value with masked format
  e.target.value = value; 
}

function maskDate(e) { 
  // Keeps only digits and limits to 6 characters (ddMMyy)
  let value = e.target.value.replace(/\D/g, '').slice(0, 6);
  // Adds slash after day if more than 2 digits
  if (value.length > 2) value = value.slice(0, 2) + '/' + value.slice(2);
  // Updates input value with masked format
  e.target.value = value;
}
