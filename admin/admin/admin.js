const API_URL = '../backend/api.php';

document.addEventListener('DOMContentLoaded', loadDashboard);

function loadDashboard() {
    fetch(API_URL + '?action=list')
        .then(response => response.json())
        .then(data => {
            renderStats(data.stats);
            renderTable(data.invitations);
        })
        .catch(err => console.error(err));
}

function renderStats(stats) {
    document.getElementById('stat-total-invited').textContent = stats.total_invited || 0;
    document.getElementById('stat-total-attending').textContent = stats.total_attending || 0;
    document.getElementById('stat-pending-invitations').textContent = stats.total_pending_invitations || 0;
    document.getElementById('stat-declined-invitations').textContent = stats.total_declined_invitations || 0;
}

function renderTable(invitations) {
    const tbody = document.getElementById('invitations-table');
    tbody.innerHTML = '';

    invitations.forEach(inv => {
        const tr = document.createElement('tr');

        let statusClass = 'status-pending';
        let statusText = 'Pendiente';
        if (inv.status === 'confirmed') { statusClass = 'status-confirmed'; statusText = 'Confirmado'; }
        if (inv.status === 'declined') { statusClass = 'status-declined'; statusText = 'Rechazado'; }

        // Get full URL (assuming current location is admin/index.html)
        const baseUrl = window.location.href.replace('/admin/index.html', '').replace('/admin/', '');
        const inviteLink = `${baseUrl}/index.html?id=${inv.uuid}`;

        tr.innerHTML = `
            <td>${inv.guest_names}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${inv.attending_count || 0} / ${inv.total_guests}</td>
             <td class="message-cell" title="${inv.message || ''}">${inv.message ? '📝 ' + inv.message.substring(0, 20) + '...' : '-'}</td>
            <td><a href="${inviteLink}" target="_blank">Abrir</a></td>
        `;
        tbody.appendChild(tr);
    });
}

function createInvitation() {
    const text = document.getElementById('guest-names').value;
    const names = text.split('\n').map(n => n.trim()).filter(n => n !== '');

    if (names.length === 0) {
        alert('Ingresa al menos un nombre');
        return;
    }

    fetch(API_URL + '?action=create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guests: names })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadDashboard(); // Refresh list

                const baseUrl = window.location.href.replace('/admin/index.html', '').replace('/admin/', '');
                const inviteLink = `${baseUrl}/index.html?id=${data.uuid}`;

                document.getElementById('generated-link').value = inviteLink;
                document.getElementById('result-area').classList.remove('hidden');
                document.getElementById('guest-names').value = ''; // clear
            } else {
                alert('Error: ' + data.error);
            }
        })
        .catch(err => console.error(err));
}

function copyToClipboard() {
    const copyText = document.getElementById("generated-link");
    copyText.select();
    document.execCommand("copy");
    alert("¡Link copiado!");
}
