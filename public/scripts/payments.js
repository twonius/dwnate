/**
 * payments.js
 * Stripe Payments Demo. Created by Romain Huet (@romainhuet).
 *
 * This modern JavaScript file handles the checkout process using Stripe.
 *
 * 1. It shows how to accept card payments with the `card` Element, and
 * the `paymentRequestButton` Element for Payment Request and Apple Pay.
 * 2. It shows how to use the Stripe Sources API to accept non-card payments,
 * such as iDEAL, SOFORT, SEPA Direct Debit, and more.
 */



(async () => {
  'use strict';
  console.log('running payments')
  // Retrieve the configuration for the store.
  //const config = await store.getConfig();

  // Create references to the main form and its submit button.
  // const form = document.getElementById('payment-form');
  // const submitButton = form.querySelector('button[type=submit]');

  /**
   * Setup Stripe Elements.
   */

  // Create a Stripe client.
  const stripe = Stripe('pk_test_VAVUbzp5BgDbYerjEq2l7j9X');
  console.log('created stripe')

  // Create an instance of Elements.
  const elements = stripe.elements();

  // Prepare the styles for Elements.
  const style = {
    base: {
      iconColor: '#666ee8',
      color: '#31325f',
      fontWeight: 400,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#666ee8',
      },
    },
  };

  /**
   * Implement a Stripe Card Element that matches the look-and-feel of the app.
   *
   * This makes it easy to collect debit and credit card payments information.
   */

  // Create a Card Element and pass some custom styles to it.


  // Mount the Card Element on the page.


  // Monitor change events on the Card Element to display any errors.


  /**
   * Implement a Stripe IBAN Element that matches the look-and-feel of the app.
   *
   * This makes it easy to collect bank account information.
   */

  // Create a IBAN Element and pass the right options for styles and supported countries.


  /**
   * Add an iDEAL Bank selection Element that matches the look-and-feel of the app.
   *
   * This allows you to send the customer directly to their iDEAL enabled bank.
   */

  // Create a iDEAL Bank Element and pass the style options, along with an extra `padding` property.

  /**
   * Implement a Stripe Payment Request Button Element.
   *
   * This automatically supports the Payment Request API (already live on Chrome),
   * as well as Apple Pay on the Web on Safari, Google Pay, and Microsoft Pay.
   * When of these two options is available, this element adds a “Pay” button on top
   * of the page to let users pay in just a click (or a tap on mobile).
   */





  // Make sure all data is loaded from the store to compute the order amount.
  //await store.loadProducts();

  // Create the payment request.
  const paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
      label: 'Total',
      amount: document.getElementById("amount-box").value*100,
    },

    requestPayerEmail: true,

  });

  const style_card = {
    base: {
      iconColor: '#666ee8',
      color: '#31325f',
      fontWeight: 400,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '15px',
      '::placeholder': {
        color: '#aab7c4',
      },
      ':-webkit-autofill': {
        color: '#666ee8',
      },
    },
  };


// Code for ccard view
  // Create an instance of the card Element.
  var card = elements.create('card', {style: style_card});

  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#card-element');

  // Handle real-time validation errors from the card Element.
  card.addEventListener('change', function(event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = '';
    }
  });

  // Handle form submission.
  var form = document.getElementById('payment-form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    stripe.createToken(card).then(function(result) {
      if (result.error) {
        // Inform the user if there was an error.
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
        console.log(errorElement.textContent)
      } else {
        // Send the token to your server.
        stripeTokenHandler(result.token);
      }
    });
  });


  function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    // Submit the form
    form.submit();
  }

  // Callback when a source is created.
  paymentRequest.on('source', async event => {
    try {
      // Create the order using the email and shipping information from the Payment Request callback.
      const order = await store.createOrder(
        'usd',
        store.getOrderItems(),
          store.getUserID()

      );
      console.log(order);
      console.log(event.source);
      // Complete the order using the payment source generated by Payment Request.
      await handleOrder(order, event.source);
      event.complete('success');
    } catch (error) {
      event.complete('fail');
      console.log(error)
    }
  });

  // Callback when the shipping address is updated.
  paymentRequest.on('shippingaddresschange', event => {
    event.updateWith({status: 'success'});
  });

  // Create the Payment Request Button.
  const paymentRequestButton = elements.create('paymentRequestButton', {
    paymentRequest: paymentRequest,
  });

  // Check if the Payment Request is available (or Apple Pay on the Web).
  const paymentRequestSupport = await paymentRequest.canMakePayment();

  if (paymentRequestSupport) {

    // Display the Pay button by mounting the Element in the DOM.
    paymentRequestButton.mount('#payment-request-button');

    // Show the payment request section.
    document.getElementById('payment-request').classList.add('visible');
  }else{
    console.log('cannot make payment')
  }



  //Handle the order and source activation if required
  const handleOrder = async (order, source, error = null) => {
    const mainElement = document.getElementById('main');
    const confirmationElement = document.getElementById('confirmation');
    if (error) {
      mainElement.classList.remove('processing');
      mainElement.classList.remove('receiver');
      confirmationElement.querySelector('.error-message').innerText =
        error.message;
      mainElement.classList.add('error');
      console.log(error.message)
    }
    switch (order.metadata.status) {
      case 'created':
        switch (source.status) {
          case 'chargeable':
            submitButton.textContent = 'Processing Payment…';
            const response = await store.payOrder(order, source);
            await handleOrder(response.order, response.source);
            break;
          case 'pending':
            switch (source.flow) {
              case 'none':
                // Normally, sources with a `flow` value of `none` are chargeable right away,
                // but there are exceptions, for instance for WeChat QR codes just below.
                if (source.type === 'wechat') {
                  // Display the QR code.
                  const qrCode = new QRCode('wechat-qrcode', {
                    text: source.wechat.qr_code_url,
                    width: 128,
                    height: 128,
                    colorDark: '#424770',
                    colorLight: '#f8fbfd',
                    correctLevel: QRCode.CorrectLevel.H,
                  });
                  // Hide the previous text and update the call to action.
                  form.querySelector('.payment-info.wechat p').style.display =
                    'none';
                  let amount = store.formatPrice(
                    store.getOrderTotal(),
                    'usd'
                  );
                  submitButton.textContent = `Scan this QR code on WeChat to pay ${amount}`;
                  // Start polling the order status.
                  pollOrderStatus(order.id, 300000);
                } else {
                  console.log('Unhandled none flow.', source);
                }
                break;
              case 'redirect':
                // Immediately redirect the customer.
                submitButton.textContent = 'Redirecting…';
                window.location.replace(source.redirect.url);
                break;
              case 'code_verification':
                // Display a code verification input to verify the source.
                break;
              case 'receiver':
                // Display the receiver address to send the funds to.
                mainElement.classList.add('success', 'receiver');
                const receiverInfo = confirmationElement.querySelector(
                  '.receiver .info'
                );
                let amount = store.formatPrice(source.amount, 'usd');
                switch (source.type) {
                  case 'ach_credit_transfer':
                    // Display the ACH Bank Transfer information to the user.
                    const ach = source.ach_credit_transfer;
                    receiverInfo.innerHTML = `
                      <ul>
                        <li>
                          Amount:
                          <strong>${amount}</strong>
                        </li>
                        <li>
                          Bank Name:
                          <strong>${ach.bank_name}</strong>
                        </li>
                        <li>
                          Account Number:
                          <strong>${ach.account_number}</strong>
                        </li>
                        <li>
                          Routing Number:
                          <strong>${ach.routing_number}</strong>
                        </li>
                      </ul>`;
                    break;
                  case 'multibanco':
                    // Display the Multibanco payment information to the user.
                    const multibanco = source.multibanco;
                    receiverInfo.innerHTML = `
                      <ul>
                        <li>
                          Amount (Montante):
                          <strong>${amount}</strong>
                        </li>
                        <li>
                          Entity (Entidade):
                          <strong>${multibanco.entity}</strong>
                        </li>
                        <li>
                          Reference (Referencia):
                          <strong>${multibanco.reference}</strong>
                        </li>
                      </ul>`;
                    break;
                  default:
                    console.log('Unhandled receiver flow.', source);
                }
                // Poll the backend and check for an order status.
                // The backend updates the status upon receiving webhooks,
                // specifically the `source.chargeable` and `charge.succeeded` events.
                pollOrderStatus(order.id);
                break;
              default:
                // Order is received, pending payment confirmation.
                break;
            }
            break;
          case 'failed':
          case 'canceled':
            // Authentication failed, offer to select another payment method.
            break;
          default:
            // Order is received, pending payment confirmation.
            break;
        }
        break;

      case 'pending':
        // Success! Now waiting for payment confirmation. Update the interface to display the confirmation screen.
        mainElement.classList.remove('processing');
        // Update the note about receipt and shipping (the payment is not yet confirmed by the bank).
        confirmationElement.querySelector('.note').innerText =
          'We’ll send your receipt and ship your items as soon as your payment is confirmed.';
        mainElement.classList.add('success');
        break;

      case 'failed':
        // Payment for the order has failed.
        mainElement.classList.remove('success');
        mainElement.classList.remove('processing');
        mainElement.classList.remove('receiver');
        mainElement.classList.add('error');

        break;

      case 'paid':
        // Success! Payment is confirmed. Update the interface to display the confirmation screen.
        mainElement.classList.remove('processing');
        mainElement.classList.remove('receiver');
        // Update the note about receipt and shipping (the payment has been fully confirmed by the bank).
        confirmationElement.querySelector('.note').innerText =
          'We just sent your receipt to your email address, and your items will be on their way shortly.';
        mainElement.classList.add('success');
        break;
    }
  };

   /**
  //  * Monitor the status of a source after a redirect flow.
  //  *
  //  * This means there is a `source` parameter in the URL, and an active order.
  //  * When this happens, we'll monitor the status of the order and present real-time
  //  * information to the user.
  //  */

   // Custom styling can be passed to options when creating an Element.
   // (Note that this demo uses a wider set of styles than the guide below.)


   // Create an instance of the card Element.
   //var card = elements.create('card', {style: style});



  const pollOrderStatus = async (
    //orderId,
    timeout = 30000,
    interval = 500,
    start = null
  ) => {
    start = start ? start : Date.now();
    const endStates = ['paid', 'failed'];
    // Retrieve the latest order status.
    //const order = await store.getOrderStatus(orderId);
    await handleOrder(order, {status: null});
    if (
      !endStates.includes(order.metadata.status) &&
      Date.now() < start + timeout
    ) {
      // Not done yet. Let's wait and check again.
      setTimeout(pollOrderStatus, interval, orderId, timeout, interval, start);
    } else {
      if (!endStates.includes(order.metadata.status)) {
        // Status has not changed yet. Let's time out.
        console.warn(new Error('Polling timed out.'));
      }
    }
  }
})();
