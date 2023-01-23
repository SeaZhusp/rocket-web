export function resetForm(form) {
  for (const key in form) {
    form[key] = ''
  }
  return form
}
