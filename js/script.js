/**
 * Course Feedback Form Script
 * Integrated with Supabase for data persistence
 */

// Initialize Supabase Client
const SUPABASE_URL = 'https://nishspgrgwwmwzgiaolg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc2hzcGdyZ3d3bXd6Z2lhb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTc3MDUsImV4cCI6MjA4ODc3MzcwNX0.N1s8kCbtB0q3sfvIACiwDEbCbZdQnVMPc6MTiv1t8ns';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.getElementById('feedbackForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const statusMessage = document.getElementById('statusMessage');

    // Email validation helper
    const isValidEmail = (email) => {
        return email.length > 0 && email.includes('@');
    };

    // Show status message with type 'error' or 'success'
    const showStatus = (text, type) => {
        statusMessage.textContent = text;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = 'block';
        
        // Auto-hide success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
    };

    // Form submission handler
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Reset state
        statusMessage.style.display = 'none';
        
        // Get form data
        const formData = new FormData(feedbackForm);
        const data = {
            student_name: formData.get('studentName') || 'Anonymous',
            email: formData.get('email'),
            satisfaction: formData.get('satisfaction'),
            favorite_topic: formData.get('favoriteTopic'),
            recommend: formData.get('recommend'),
            comments: formData.get('comments')
        };

        // --- VALIDATION ---
        let errors = [];
        
        if (!data.email || !isValidEmail(data.email)) errors.push('email');
        if (!data.satisfaction) errors.push('satisfaction');
        if (!data.favorite_topic) errors.push('favoriteTopic');

        if (errors.length > 0) {
            showStatus('Please fill in the required fields correctly.', 'error');
            errors.forEach(fieldId => {
                const el = document.getElementsByName(fieldId)[0] || document.getElementById(fieldId);
                if (el) {
                    el.style.borderColor = 'var(--error)';
                    el.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                    setTimeout(() => {
                        el.style.borderColor = 'rgba(0, 0, 0, 0.05)';
                        el.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
                    }, 3000);
                }
            });
            return;
        }

        // --- SUBMISSION TO SUPABASE ---
        submitBtn.disabled = true;
        btnText.textContent = 'Submitting to Database...';
        
        try {
            const { error } = await supabase
                .from('course_feedback')
                .insert([data]);

            if (error) throw error;

            // Success state
            console.log('--- FEEDBACK SAVED TO SUPABASE ---', data);
            showStatus('Thank you! Your feedback has been recorded.', 'success');
            feedbackForm.reset();
        } catch (error) {
            console.error('Error submitting feedback:', error.message);
            showStatus('Oops! Something went wrong. Please try again.', 'error');
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            btnText.textContent = 'Submit Feedback ✅';
        }
    });

    // Clear error highlights
    feedbackForm.addEventListener('input', (e) => {
        if (e.target.style.borderColor === 'rgb(239, 68, 68)') {
            e.target.style.borderColor = 'var(--primary)';
        }
        statusMessage.style.display = 'none';
    });
});
