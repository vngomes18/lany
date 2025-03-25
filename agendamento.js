document.addEventListener('DOMContentLoaded', function() {
    // Inicialização do Calendário
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
        },
        buttonText: {
            today: 'Hoje',
            month: 'Mês',
            week: 'Semana'
        },
        selectable: true,
        select: function(info) {
            showTimeSlots(info.start);
        },
        eventClick: function(info) {
            showTimeSlots(info.event.start);
        }
    });
    calendar.render();

    // Variáveis de Estado
    let currentStep = 1;
    let selectedDate = null;
    let selectedTime = null;
    let bookingData = {};

    // Elementos DOM
    const steps = document.querySelectorAll('.step');
    const sections = document.querySelectorAll('.booking-section');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const confirmButton = document.getElementById('confirm-booking');
    const timeSlots = document.querySelector('.time-slots');
    const slotsGrid = document.querySelector('.slots-grid');

    // Preços base por estilo (em R$)
    const basePrices = {
        'fine-line': 200,
        'minimalista': 180,
        'floral': 250,
        'geometrica': 220,
        'escrita': 150
    };

    // Funções de Navegação
    function goToStep(step) {
        currentStep = step;
        
        // Atualizar indicadores de etapa
        steps.forEach((s, index) => {
            if (index + 1 < step) {
                s.classList.add('complete');
                s.classList.remove('active');
            } else if (index + 1 === step) {
                s.classList.add('active');
                s.classList.remove('complete');
            } else {
                s.classList.remove('active', 'complete');
            }
        });

        // Mostrar seção atual
        sections.forEach((section, index) => {
            if (index + 1 === step) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });

        // Ações específicas por etapa
        if (step === 3) {
            updateQuote();
        } else if (step === 4) {
            updateBookingSummary();
        }
    }

    // Gerar Horários Disponíveis
    function showTimeSlots(date) {
        selectedDate = date;
        timeSlots.style.display = 'block';
        slotsGrid.innerHTML = '';

        // Horários disponíveis (9h às 18h, intervalo de 1h)
        const hours = Array.from({length: 10}, (_, i) => i + 9);
        
        hours.forEach(hour => {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.textContent = `${hour}:00`;
            
            slot.addEventListener('click', () => {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                slot.classList.add('selected');
                selectedTime = `${hour}:00`;
            });

            slotsGrid.appendChild(slot);
        });
    }

    // Calcular Orçamento
    function calculatePrice() {
        const style = document.getElementById('tattoo-style').value;
        const size = parseInt(document.getElementById('tattoo-size').value) || 0;
        
        let basePrice = basePrices[style] || 200;
        let sizeMultiplier = Math.ceil(size / 5); // A cada 5cm, multiplica o preço
        
        return basePrice * sizeMultiplier;
    }

    // Atualizar Orçamento
    function updateQuote() {
        const style = document.getElementById('tattoo-style').value;
        const size = document.getElementById('tattoo-size').value;
        const price = calculatePrice();

        document.getElementById('quote-style').textContent = style.charAt(0).toUpperCase() + style.slice(1);
        document.getElementById('quote-size').textContent = `${size}cm`;
        document.getElementById('quote-price').textContent = `R$ ${price.toFixed(2)}`;
    }

    // Atualizar Resumo do Agendamento
    function updateBookingSummary() {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const style = document.getElementById('tattoo-style').value;
        const size = document.getElementById('tattoo-size').value;
        const description = document.getElementById('description').value;
        const price = calculatePrice();

        const dateStr = selectedDate ? selectedDate.toLocaleDateString('pt-BR') : '';
        const timeStr = selectedTime || '';

        const summaryHTML = `
            <div class="summary-item">
                <strong>Nome:</strong> ${name}
            </div>
            <div class="summary-item">
                <strong>E-mail:</strong> ${email}
            </div>
            <div class="summary-item">
                <strong>Telefone:</strong> ${phone}
            </div>
            <div class="summary-item">
                <strong>Estilo:</strong> ${style}
            </div>
            <div class="summary-item">
                <strong>Tamanho:</strong> ${size}cm
            </div>
            <div class="summary-item">
                <strong>Data:</strong> ${dateStr}
            </div>
            <div class="summary-item">
                <strong>Horário:</strong> ${timeStr}
            </div>
            <div class="summary-item">
                <strong>Valor Total:</strong> R$ ${price.toFixed(2)}
            </div>
            <div class="summary-item">
                <strong>Descrição:</strong>
                <p>${description}</p>
            </div>
        `;

        document.getElementById('booking-summary').innerHTML = summaryHTML;
    }

    // Event Listeners
    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Validação antes de prosseguir
            if (currentStep === 1) {
                const form = document.getElementById('clientForm');
                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }
            } else if (currentStep === 2 && !selectedTime) {
                alert('Por favor, selecione um horário disponível.');
                return;
            }

            goToStep(currentStep + 1);
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            goToStep(currentStep - 1);
        });
    });

    confirmButton.addEventListener('click', async () => {
        // Aqui você implementaria a lógica de envio do agendamento
        try {
            // Simulação de envio
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Agendamento realizado com sucesso! Em breve você receberá um e-mail de confirmação.');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Erro ao realizar o agendamento. Por favor, tente novamente.');
        }
    });

    // Atualizar orçamento quando os campos relevantes mudarem
    document.getElementById('tattoo-style').addEventListener('change', updateQuote);
    document.getElementById('tattoo-size').addEventListener('input', updateQuote);

    // Máscara para telefone
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
            value = value.replace(/(\d)(\d{4})$/, '$1-$2');
            e.target.value = value;
        }
    });
}); 