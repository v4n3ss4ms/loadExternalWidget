const CREDIT_AGREEMENTS_URL = 'http://localhost:8080/credit_agreements';
const EVENTS_URL = 'http://localhost:8080/events';
const SELECT_ID = 'instalment_select';
const WIDGET_STYLES = `
  .instalments-widget {
    padding: 10px;
    width: 100%;
  }
  .instalment-select {
    width: 100%;
  }
  .selection--header {
    display: flex;
    justify-content: space-between;
  }
  .mode-info--title {
    padding: 5px;
    display: flex;
    justify-content: space-between;
  }
  .mode-info--steps {
    padding: 5px;
  }
  .mode-info--steps ol {
    list-style: none;
  }
  .mode-info--steps li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 15px;
  }
  .mode-info--wrapper {
    position: fixed;
    z-index: 1;
    padding-top: 100px;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0,0,0);
    background-color: rgba(0,0,0,0.4);
  }
  .mode-info--content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 50%;
    max-width: 600px;
  }
`;

const sendTracking = (data) => {
  fetch(EVENTS_URL, {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .catch((error) => console.error('Tracking is not sent'))
}

const getDataTracking = (context, type, selectedInstalment = undefined ) => {
  return {
    context,
    type,
    selectedInstalment,
  }
}

const getCreditAgreements = (amount) => {
  return fetch(`${CREDIT_AGREEMENTS_URL}?totalWithTax=${amount}`).then(
    (response) => response.json()
  );
};

const getModal = (fee) => {
  const LAYOUT = `
    <div class="modal_more_info mode-info--wrapper">
      <div class="mode-info--content">
        <div class="mode-info--title">
          <div>Fracciona tu pago</div>
          <div>seQura <a href="#" class="modal_more_info_close">close</a></div>
        </div>
        <ol class="mode-info--steps">
          <li>
            <div>Eliges "Fracciona tu pago" al realizar tu pedido y pagas s??lo la primera cuota.</div>
            <div><img src="../assets/icons/payment.png" width="75px"></div>
          </li>
          <li>
            <div>Recibes tu pedido</div>
            <div><img src="../assets/icons/shipment.png" width="75px"></div>
          </li>
          <li>
            <div>El resto de pagos se cargar??n autom??ticamente en tu tarjeta.</div>
            <div><img src="../assets/icons/card.png" width="75px"></div>
          </li>
        </ol>
        <p>??As?? de simple!</p>
        <p>Adem??s, en el importe mostrado ya se incluye la cuota ??nica mensual de ${fee}/mes, por lo que no tendr??s ninguna sorpresa.</p>
      </div>
    </div>
    `;
  return LAYOUT;
};

const getInstalmentOption = (data) => {
  const LAYOUT = `<option value="${data.instalment_count}" data-fee="${data.instalment_fee.string}" >${data.instalment_count} cuotas de ${data.instalment_total.string}/mes </option>`;
  return LAYOUT;
};

const getInstalmentOptions = (data) => {
  const options = data.reduce((acc, option) => {
    return (acc += getInstalmentOption(option));
  }, "");
  const LAYOUT = `
      <select name="instalments" id="${SELECT_ID}" class="instalment-select">
        ${options}
      </select>
    `;
  return LAYOUT;
};

const getWidget = (data) => {
  const instalmentOptions = getInstalmentOptions(data);
  const LAYOUT = `
    <div class="instalments-widget">
      <div class="selection--header">
        <label for="${SELECT_ID}">P??galo en</label>
        <a href="#" class="more_info">m??s info</a>
      </div>
      ${instalmentOptions}
    </div>
    `;
  return LAYOUT;
};

const addWidgetStyles = ((styleString) => {
  const widgetStyles = document.createElement('style');
  document.head.append(widgetStyles);
  return (styleString) => (widgetStyles.textContent = styleString);
})();

const closeModal = (event) => {
  event.preventDefault();
  const modalMoreInfo = document.getElementsByClassName('modal_more_info')[0];
  modalMoreInfo.remove();

  sendTracking(
    getDataTracking('checkoutWidget', 'closeModal')
  );
};

const openModal = (event) => {
  event.preventDefault();
  const fee = document
    .querySelector(`#${SELECT_ID} option[selected="true"]`)
    .getAttribute('data-fee');
  const modal = getModal(fee);
  event.target.insertAdjacentHTML('afterend', modal);
  const closeMoreInfo = document.getElementsByClassName(
    'modal_more_info_close'
  )[0];
  closeMoreInfo.addEventListener('click', closeModal, false);

  sendTracking(
    getDataTracking('checkoutWidget', 'openModal')
  );
};

const setSelectedByDefault = () => {
  const firstOption = document.querySelector(`#${SELECT_ID} option`);
  firstOption.setAttribute('selected', true);
};

const selectOnChange = (event) => {
  const element = event.target;
  const value = event.target.value;
  element
    .querySelector('option[selected="true"]')
    .setAttribute('selected', false);
  element
    .querySelector(`option[value="${value}"]`)
    .setAttribute('selected', true);
    
    sendTracking(
      getDataTracking('checkoutWidget', 'simulatorInstalmentChanged', value)
    );
};

const addEventListenerToElements = (parent) => {
  const moreInfo = parent.getElementsByClassName('more_info')[0];
  const instalmentSelect = parent.querySelector(`#${SELECT_ID}`);
  moreInfo.addEventListener('click', openModal, false);
  instalmentSelect.addEventListener('change', selectOnChange, false);
};

/**
 * Utility function to render the widget.
 * @param {Element} externalElementId
 * @param {Number} amount
 */
const renderWidget = (externalElementId, amount) => {
  try {
    getCreditAgreements(amount).then((creditAgreementsData) => {
      const external_element = document.getElementById(externalElementId);
      const widget = getWidget(creditAgreementsData);
      addWidgetStyles(WIDGET_STYLES);
      external_element.innerHTML = widget;
      setSelectedByDefault();
      addEventListenerToElements(external_element);
      
      sendTracking(
        getDataTracking('checkoutWidget', 'onLoad')
      );
    });
  } catch {
    console.error('Widget not available');
    sendTracking(
      getDataTracking('checkoutWidget', 'loadError')
    );
  }
};

const renderInstalmentsWidget = () =>
  (window.renderInstalmentsWidget = renderWidget);

export default renderInstalmentsWidget();
