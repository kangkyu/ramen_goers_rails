import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["form", "submitBtn"]
  
  submit(e) {
    e.preventDefault()
    this.submitBtnTarget.disabled = true
    this.submitBtnTarget.textContent = "Checking in..."
    this.formTarget.requestSubmit()
  }
  
  reset() {
    this.submitBtnTarget.disabled = false
    this.submitBtnTarget.textContent = "Check In"
  }
}
