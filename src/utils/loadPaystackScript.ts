// Helper to load Paystack script
export function loadPaystackScript() {
  if (document.getElementById('paystack-script')) return;
  const script = document.createElement('script');
  script.id = 'paystack-script';
  script.src = 'https://js.paystack.co/v1/inline.js';
  script.async = true;
  document.body.appendChild(script);
}