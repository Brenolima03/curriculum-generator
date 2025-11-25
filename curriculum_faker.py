from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support import expected_conditions as EC
import time
import os

# ---------- CONFIGURATION ----------
PERSONAL_DATA = {
  "fullname": "Breno Cordeiro de Souza Lima",
  "city": "Campo Grande",
  "state": "MS",
  "cep": "79012110",
  "telephone": "(67) 99824-8393",
  "email": "brenoclima@hotmail.com",
  "nationality": "Brasileiro",
  "civil_state": "Solteiro(a)",
  "has_children": "Não",
  "age": "28",
  "gender": "Masculino",
  "objective": "Desenvolvedor de software jr"
}

# ---------- SETUP BROWSER ----------
chrome_options = Options()
chrome_options.binary_location = r"C:\Program Files\BraveSoftware\Brave-Browser\Application\brave.exe"
chrome_options.add_argument("--start-maximized")
chrome_options.add_argument("--allow-file-access-from-files")
chrome_service = Service("chromedriver.exe")

# ---------- DEBUG ----------
def debug(message):
  print(f"[DEBUG] {message}")

# ---------- LAUNCH ----------
debug("Launching browser...")
driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
wait = WebDriverWait(driver, 10)

# ---------- OPEN LOCAL HTML ----------
html_full_path = os.path.abspath("index.html")
debug(f"Opening local HTML: {html_full_path}")
driver.get(f"file:///{html_full_path}")
time.sleep(1)

# ---------- FILL PERSONAL INFO ----------
debug("Filling personal information...")
driver.find_element(By.ID, "fullname").send_keys(PERSONAL_DATA["fullname"])
driver.find_element(By.ID, "city").send_keys(PERSONAL_DATA["city"])
Select(driver.find_element(By.ID, "state")).select_by_value(PERSONAL_DATA["state"])
driver.find_element(By.ID, "cep").send_keys(PERSONAL_DATA["cep"])
driver.find_element(By.ID, "telephone").send_keys(PERSONAL_DATA["telephone"])
driver.find_element(By.ID, "email").send_keys(PERSONAL_DATA["email"])
driver.find_element(By.ID, "nationality").send_keys(PERSONAL_DATA["nationality"])
Select(driver.find_element(By.ID, "civilState")).select_by_visible_text(PERSONAL_DATA["civil_state"])
Select(driver.find_element(By.ID, "hasChildren")).select_by_visible_text(PERSONAL_DATA["has_children"])
driver.find_element(By.ID, "age").send_keys(PERSONAL_DATA["age"])
Select(driver.find_element(By.ID, "gender")).select_by_visible_text(PERSONAL_DATA["gender"])
driver.find_element(By.ID, "objective").send_keys(PERSONAL_DATA["objective"])

# ---------- MULTI-ENTRY HELPERS ----------
def add_multi_entry(container_id, entry_values_list):
  # Adds multiple entries into a container
  container_element = driver.find_element(By.ID, container_id)

  for entry_values in entry_values_list:
    existing_entries = container_element.find_elements(By.CSS_SELECTOR, ".multi-entry")
    target_entry = None

    for entry in existing_entries:
      inputs = entry.find_elements(By.TAG_NAME, "input")
      if all(inp.get_attribute("value").strip() == "" for inp in inputs):
        target_entry = entry
        break

    if not target_entry:
      add_button = driver.find_element(
        By.CSS_SELECTOR, f"#{container_id} + button.add-button"
      )
      before_count = len(existing_entries)
      driver.execute_script("arguments[0].scrollIntoView(true);", add_button)
      driver.execute_script("arguments[0].click();", add_button)

      wait.until(lambda d:
        len(d.find_element(By.ID, container_id)
        .find_elements(By.CSS_SELECTOR, ".multi-entry")) > before_count)

      existing_entries = container_element.find_elements(By.CSS_SELECTOR, ".multi-entry")
      target_entry = existing_entries[-1]

    inputs = target_entry.find_elements(By.TAG_NAME, "input")
    for input_element, value in zip(inputs, entry_values):
      input_element.clear()
      input_element.send_keys(value)

def add_language(container_id, language_name, proficiency_level):
  # Adds a language with its proficiency level
  container_element = driver.find_element(By.ID, container_id)
  inputs = container_element.find_elements(By.CSS_SELECTOR, "input")
  empty_input = next((inp for inp in inputs if inp.get_attribute("value").strip() == ""), None)

  if not empty_input:
    add_button = driver.find_element(
      By.CSS_SELECTOR, f"#{container_id} + button.add-button"
    )
    driver.execute_script("arguments[0].scrollIntoView(true);", add_button)
    driver.execute_script("arguments[0].click();", add_button)

    wait.until(lambda d: len(container_element.find_elements(By.CSS_SELECTOR, "input")) > len(inputs))
    inputs = container_element.find_elements(By.CSS_SELECTOR, "input")
    empty_input = inputs[-1]

  empty_input.clear()
  empty_input.send_keys(language_name)
  select_element = container_element.find_elements(By.TAG_NAME, "select")[-1]
  Select(select_element).select_by_visible_text(proficiency_level)

# ---------- FILL SECTIONS ----------
debug("Filling Education...")
add_multi_entry("educationContainer", [
  ["Unigran Capital", "Análise e desenvolvimento de sistemas", "01/2022", "06/2024"]
])

debug("Filling Experiences...")
add_multi_entry("experienceContainer", [
  ["Grupo Card", "Estagiário", "04/2022", "04/2023"]
])

debug("Filling Languages...")
add_language("languagesContainer", "Inglês", "Fluente")
add_language("languagesContainer", "Português", "Nativo")

debug("Filling Courses...")
add_multi_entry("coursesContainer", [
  ["Javascript"],
  ["Java"],
  ["Python"]
])

debug("Filling Additional Information...")
add_multi_entry("additionalContainer", [
  ["Disponibilidade de horário total"]
])

# ---------- GENERATE PDF ----------
debug("Clicking Generate PDF button...")
wait.until(EC.element_to_be_clickable((By.CLASS_NAME, "generate"))).click()
time.sleep(5)

# ---------- CLOSE ----------
debug("Closing browser...")
time.sleep(10)
driver.quit()
debug("Script finished successfully!")
