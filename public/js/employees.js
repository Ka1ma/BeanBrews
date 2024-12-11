document.addEventListener('DOMContentLoaded', function() {
    loadEmployeeStats();
    loadEmployees();

    // Set up search functionality
    const searchInput = document.getElementById('employee-search');
    searchInput.addEventListener('input', debounce(function() {
        loadEmployees();
    }, 300));

    // Set up filter functionality
    document.getElementById('role-filter').addEventListener('change', loadEmployees);
    document.getElementById('status-filter').addEventListener('change', loadEmployees);
});

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func.apply(this, args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

async function loadEmployeeStats() {
    try {
        const response = await fetch('/api/employees/stats');
        const stats = await response.json();
        
        document.getElementById('total-employees').textContent = stats.totalEmployees;
        document.getElementById('active-employees').textContent = stats.activeToday;
        document.getElementById('on-leave').textContent = stats.onLeave;
        document.getElementById('avg-performance').textContent = `${stats.avgPerformance}%`;
    } catch (error) {
        console.error('Error loading employee stats:', error);
    }
}

async function loadEmployees() {
    const searchTerm = document.getElementById('employee-search').value;
    const role = document.getElementById('role-filter').value;
    const status = document.getElementById('status-filter').value;

    try {
        const response = await fetch(
            `/api/employees?search=${encodeURIComponent(searchTerm)}&role=${role}&status=${status}`
        );
        const employees = await response.json();
        displayEmployees(employees);
    } catch (error) {
        console.error('Error loading employees:', error);
        document.getElementById('employees-table-body').innerHTML = `
            <tr>
                <td colspan="7" class="text-center">Error loading employees. Please try again later.</td>
            </tr>
        `;
    }
}

function displayEmployees(employees) {
    const tableBody = document.getElementById('employees-table-body');
    if (!employees || employees.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center">No employees found.</td>
            </tr>
        `;
        return;
    }

    const html = employees.map(employee => `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <div class="me-2">
                        <img src="${employee.avatar || 'images/default-avatar.jpg'}" 
                             class="rounded-circle"
                             width="40"
                             height="40"
                             alt="${employee.firstName} ${employee.lastName}">
                    </div>
                    <div>
                        <div class="fw-bold">${employee.firstName} ${employee.lastName}</div>
                        <small class="text-muted">${employee.email}</small>
                    </div>
                </div>
            </td>
            <td>
                <span class="badge bg-primary">${capitalizeFirst(employee.role)}</span>
            </td>
            <td>${employee.phone}</td>
            <td>
                <span class="badge bg-${getStatusColor(employee.status)}">
                    ${capitalizeFirst(employee.status)}
                </span>
            </td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-${getPerformanceColor(employee.performance)}" 
                         role="progressbar" 
                         style="width: ${employee.performance}%"
                         aria-valuenow="${employee.performance}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${employee.performance}%
                    </div>
                </div>
            </td>
            <td>${formatDate(employee.lastActive)}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="viewEmployee('${employee._id}')">
                    <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary me-1" onclick="editEmployee('${employee._id}')">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteEmployee('${employee._id}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');

    tableBody.innerHTML = html;
}

function getStatusColor(status) {
    const colors = {
        'active': 'success',
        'on-leave': 'warning',
        'inactive': 'secondary'
    };
    return colors[status] || 'secondary';
}

function getPerformanceColor(performance) {
    if (performance >= 80) return 'success';
    if (performance >= 60) return 'warning';
    return 'danger';
}

function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleString();
}

function openAddEmployeeModal() {
    const modal = new bootstrap.Modal(document.getElementById('addEmployeeModal'));
    modal.show();
}

async function saveEmployee() {
    const form = document.getElementById('addEmployeeForm');
    const formData = new FormData(form);
    
    const employeeData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        role: formData.get('role'),
        startDate: formData.get('startDate'),
        hourlyRate: parseFloat(formData.get('hourlyRate'))
    };

    try {
        const response = await fetch('/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(employeeData)
        });

        if (response.ok) {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addEmployeeModal'));
            modal.hide();
            form.reset();
            loadEmployees();
            loadEmployeeStats();
        } else {
            throw new Error('Failed to save employee');
        }
    } catch (error) {
        console.error('Error saving employee:', error);
        alert('Error saving employee. Please try again.');
    }
}

function openScheduleModal() {
    loadSchedule();
    const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));
    modal.show();
}

let currentWeekStart = new Date();
currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay() + 1);

async function loadSchedule() {
    try {
        const response = await fetch(`/api/employees/schedule?start=${currentWeekStart.toISOString()}`);
        const schedule = await response.json();
        displaySchedule(schedule);
        updateWeekDisplay();
    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('schedule-table-body').innerHTML = `
            <tr>
                <td colspan="8" class="text-center">Error loading schedule. Please try again later.</td>
            </tr>
        `;
    }
}

function displaySchedule(schedule) {
    const tableBody = document.getElementById('schedule-table-body');
    if (!schedule || schedule.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center">No schedule data available.</td>
            </tr>
        `;
        return;
    }

    const html = schedule.map(employee => `
        <tr>
            <td>${employee.firstName} ${employee.lastName}</td>
            ${employee.shifts.map(shift => `
                <td class="text-center">
                    ${shift ? `${shift.start} - ${shift.end}` : '-'}
                </td>
            `).join('')}
        </tr>
    `).join('');

    tableBody.innerHTML = html;
}

function updateWeekDisplay() {
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + 6);
    
    const formatDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    document.getElementById('current-week').textContent = 
        `${formatDate(currentWeekStart)} - ${formatDate(endDate)}`;
}

function previousWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    loadSchedule();
}

function nextWeek() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    loadSchedule();
}

async function viewEmployee(employeeId) {
    // Implement view employee details
    console.log('Viewing employee:', employeeId);
}

async function editEmployee(employeeId) {
    // Implement edit employee
    console.log('Editing employee:', employeeId);
}

async function deleteEmployee(employeeId) {
    if (confirm('Are you sure you want to delete this employee?')) {
        try {
            const response = await fetch(`/api/employees/${employeeId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadEmployees();
                loadEmployeeStats();
            } else {
                throw new Error('Failed to delete employee');
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
            alert('Error deleting employee. Please try again.');
        }
    }
}
