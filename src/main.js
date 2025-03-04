const API_ENDPOINT_DELIVERABLES = '/api/deliverables/';
const API_ENDPOINT_INVESTIGATE = '/api/investigate/';

let unfilteredTableModel;

loadDeliverablesFromServer(
    API_ENDPOINT_DELIVERABLES,
    (jsonObj) => {
        unfilteredTableModel = createTableModel(jsonObj);
        populateTable(unfilteredTableModel);
        wireUpSearch();
    },
    () => {
        const h1 = $('h1');
        h1.nextAll().remove();
        h1.after('<div class="alert alert-danger" role="alert">Laden der Daten vom Server für die Sendungsübersicht fehlgeschlagen.</div>');
    }
);

function loadDeliverablesFromServer(url, onSuccess, onError) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server responded with error status code ${response.status}`);
            }
            return response.json();
        })
        .then(jsonObj => onSuccess(jsonObj))
        .catch(error => {
            console.log(error);
            onError();
        });
}

function createTableModel(jsonObj) {
    const rows = [];

    jsonObj.data.forEach((dataElement, index) => {
        const row = {};
        row.index = index;

        const deliverable = dataElement.deliverable;
        row.trackingId = deliverable.trackingId;

        const sender = deliverable.sender;
        row.senderName = '--';
        row.senderAddress = '--';
        row.senderEmail = '--';
        if (sender !== null) {
            row.senderName = sender.personalData.orgname;
            const senderAddress = sender.postalAddress;
            if (senderAddress !== null) {
                row.senderAddress = [senderAddress.street, senderAddress.door, senderAddress.postalCode, senderAddress.city, senderAddress.countryCode].join(' ');
            }
            if (sender.email !== null) {
                row.senderEmail = sender.email;
            }
        }

        const recipient = deliverable.activeState.recipient;
        row.recipientName = '--';
        row.recipientAddress = '--';
        row.recipientEmail = '--';
        if (recipient !== null) {
            if (recipient.personalData.orgname !== undefined) {
                row.recipientName = recipient.personalData.orgname;
            } else {
                row.recipientName = [recipient.personalData.givenName, recipient.personalData.familyName].join(' ');
            }
            const recipientAddress = recipient.postalAddress;
            if (recipientAddress !== null) {
                row.recipientAddress = [recipientAddress.street, recipientAddress.door, recipientAddress.postalCode, recipientAddress.city, recipientAddress.countryCode].join(' ');
            }
            if (recipient.email !== null) {
                row.recipientEmail = recipient.email;
            }
        }

        row.status = deliverable.activeState.state;

        row.searchData = [row.recipientName, row.recipientAddress, row.recipientEmail].join(' ').toLowerCase();

        rows.push(row);
    });

    return rows;
}

function populateTable(tableModel, searchTerms) {
    const tableBody = $('#mo-table tbody');
    tableBody.empty();
    tableModel.forEach((row, index) => {
        tableBody.append(`
            <tr>
                <td class="font-monospace">${row.trackingId}</td> +
                <td>${row.senderName}<br>${row.senderAddress}<br>${row.senderEmail}</td>
                <td>
                    <span class="mo-highlight-search-terms">${row.recipientName}</span><br>
                    <span class="mo-highlight-search-terms">${row.recipientAddress}</span><br>
                    <span class="mo-highlight-search-terms">${row.recipientEmail}</span></td>
                <td>${row.status}</td>
                <td><button type="button" class="mo-button-investigate btn btn-primary" data-tracking-id="${row.trackingId}">Nachforschen</button></td>
            </tr>
        `);
    });
    const buttons = tableBody.find('.mo-button-investigate');
    buttons.each((index, button) => {
        $(button).on('click', () => {
            const trackingId = $(button).attr('data-tracking-id');
            $.post(API_ENDPOINT_INVESTIGATE, { trackingId: trackingId } )
                .done(() => {
                    $(button).text('Eingeleitet');
                    $(button).addClass('disabled btn-success').removeClass('btn-primary');
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.log(textStatus, errorThrown);
                    $(button).after('<div class="alert alert-danger" role="alert">Beauftragung Nachforschung fehlgeschlagen.</div>');
                });
        });
    });
    if (searchTerms !== undefined) {
        const elements = tableBody.find('.mo-highlight-search-terms');
        elements.each((index, element) => {
            const text = $(element).text();
            const highlightedText= text.replace(new RegExp(searchTerms.join('|'), 'gi'), (match) => {
                return `<span class="mo-highlighted-search-term">${match}</span>`
            });
            $(element).html(highlightedText);
        });
    }
}

function wireUpSearch() {
    const searchInput = $('#mo-search-input');
    searchInput.on('input', () => {
        const searchInputValue = searchInput.val();
        const searchTerms = extractSearchTermsFromInput(searchInputValue);
        const filteredTableModel = createFilteredTableModel(searchTerms);
        populateTable(filteredTableModel, searchTerms);
        $('#mo-badge').empty();
        $('#mo-badge').append(`${filteredTableModel.length} Ergebnisse`);
    })
}

function extractSearchTermsFromInput(input) {
    const trimmedInput = input.trim();
    if (trimmedInput !== '') {
        return trimmedInput.toLowerCase().split(/\s+/);
    } else {
        return [];
    }
}

function createFilteredTableModel(searchTerms) {
    if (searchTerms.length === 0) {
        return unfilteredTableModel;
    }
    const filteredTableModel = [];
    unfilteredTableModel.forEach((row, index) => {
        let allFound = true;
        for (let s = 0; s < searchTerms.length; s++) {
            if (!row.searchData.includes(searchTerms[s])) {
                allFound = false;
                break;
            }
        }
        if (allFound) {
            filteredTableModel.push(row);
        }
    });
    return filteredTableModel;
}
