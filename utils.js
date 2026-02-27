
// Map identity type to prefix
const TYPE_PREFIX = {
    student:   'STU',
    faculty:   'FAC',
    staff:     'STF',
    phd:       'PHD',
    temporary: 'TMP'
};

// Get current year as 4-digit string
function getCurrentYear() {
    return new Date().getFullYear();
}

// Generate the next unique ID for a given type
// Reads the counter from Supabase, increments it, returns the new ID string
async function generateUID(type) {
    const prefix = TYPE_PREFIX[type];
    const year = getCurrentYear();

    // Try to get the current counter
    const { data, error } = await supabase
        .from('id_counters')
        .select('last_number')
        .eq('type_prefix', prefix)
        .eq('year', year)
        .single();

    let nextNumber = 1;

    if (data) {
        nextNumber = data.last_number + 1;
        // Update the counter
        await supabase
            .from('id_counters')
            .update({ last_number: nextNumber })
            .eq('type_prefix', prefix)
            .eq('year', year);
    } else {
        // First entry for this type/year - insert counter
        await supabase
            .from('id_counters')
            .insert({ type_prefix: prefix, year: year, last_number: 1 });
    }

    // Format: STU202400001 (5 digits)
    const paddedNumber = String(nextNumber).padStart(5, '0');
    return `${prefix}${year}${paddedNumber}`;
}

// ----------------------------------------
// Validation Functions
// ----------------------------------------

// Check email format with a simple regex
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Check phone - only digits, spaces, dashes, plus sign
function isValidPhone(phone) {
    const re = /^[\d\s\-\+]{8,20}$/;
    return re.test(phone);
}

// Check minimum name length (2 characters)
function isValidName(name) {
    return name && name.trim().length >= 2;
}

// Check date of birth - cannot be in the future
function isValidBirthDate(dateString) {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date < new Date();
}

// Check minimum age (16 for students)
function isOldEnough(dateString, minAge) {
    if (!dateString) return false;
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    return age >= minAge;
}

// Show an error message under a form field
function showFieldError(fieldId, message) {
    // Remove existing error if any
    clearFieldError(fieldId);
    const field = document.getElementById(fieldId);
    if (!field) return;
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error mt-1';
    errorDiv.id = fieldId + '-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    field.classList.add('is-invalid');
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) field.classList.remove('is-invalid');
    const errorDiv = document.getElementById(fieldId + '-error');
    if (errorDiv) errorDiv.remove();
}

// Capitalize first letter of a string
function capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ----------------------------------------
// Status Badge Helper
// ----------------------------------------
function getStatusBadge(status) {
    const map = {
        'Pending':   'secondary',
        'Active':    'success',
        'Suspended': 'warning',
        'Inactive':  'danger',
        'Archived':  'dark'
    };
    const color = map[status] || 'secondary';
    return `<span class="badge bg-${color}">${status}</span>`;
}



// Returns which statuses are allowed from the current one
function getAllowedTransitions(currentStatus) {
    const rules = {
        'Pending':   ['Active'],
        'Active':    ['Suspended', 'Inactive'],
        'Suspended': ['Active'],
        'Inactive':  ['Archived'],
        'Archived':  []
    };
    return rules[currentStatus] || [];
}

// Loading Overlay
function showLoading() {
    const el = document.getElementById('loading');
    if (el) el.style.display = 'block';
}

function hideLoading() {
    const el = document.getElementById('loading');
    if (el) el.style.display = 'none';
}
