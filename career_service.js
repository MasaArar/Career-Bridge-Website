$(document).ready(function() {
    window.initiateSupport = function() {
        $.ajax({
            type: 'GET',
            url: '/getAppointmentSlots',
            success: function(appointmentSlots) {
                displayAppointmentSlots(appointmentSlots);
            },
            error: function(error) {
                console.error('Error initiating support:', error.responseText);
            }
        });
    };

    function displayAppointmentSlots(slots) {
        const slotsContainer = $('#appointmentSlots');
        slotsContainer.empty();

        slots.forEach(slot => {
            const slotButton = `<button onclick="chooseSlot('${slot}')">${slot}</button>`;
            slotsContainer.append(slotButton);
        });
    }

    window.chooseSlot = function(slot) {
        $.ajax({
            type: 'POST',
            url: '/reserveAppointment',
            data: { chosenSlot: slot },
            success: function() {
                sendConfirmationMessage(slot);
            },
            error: function(error) {
                console.error('Error choosing slot:', error.responseText);
            }
        });
    };

    function sendConfirmationMessage(slot) {
        $.ajax({
            type: 'POST',
            url: '/sendConfirmationEmail',
            data: { chosenSlot: slot },
            success: function() {
                alert('Appointment reserved successfully. Confirmation email sent.');
            },
            error: function(error) {
                console.error('Error sending confirmation email:', error.responseText);
            }
        });
    }
});
