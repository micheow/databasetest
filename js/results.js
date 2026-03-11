/**
 * Results Dashboard Script
 * Fetches and displays data from Supabase
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Supabase Client
    const SUPABASE_URL = 'https://nishspgrgwwmwzgiaolg.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pc2hzcGdyZ3d3bXd6Z2lhb2xnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxOTc3MDUsImV4cCI6MjA4ODc3MzcwNX0.N1s8kCbtB0q3sfvIACiwDEbCbZdQnVMPc6MTiv1t8ns';
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const loading = document.getElementById('loading');
    const resultsContent = document.getElementById('resultsContent');
    const tableBody = document.getElementById('resultsTableBody');
    const totalFeedback = document.getElementById('totalFeedback');
    const avgRatingEl = document.getElementById('avgRating');
    const refreshBtn = document.getElementById('refreshBtn');

    const fetchData = async () => {
        loading.style.display = 'block';
        resultsContent.style.display = 'none';

        try {
            const { data, error } = await supabase
                .from('course_feedback')
                .select('*')
                .order('submitted_at', { ascending: false });

            if (error) throw error;

            displayResults(data);
        } catch (error) {
            console.error('Error fetching data:', error.message);
            alert('Failed to load results. Make sure your table exists and policies allow reading.');
        } finally {
            loading.style.display = 'none';
            resultsContent.style.display = 'block';
        }
    };

    const displayResults = (feedbacks) => {
        tableBody.innerHTML = '';
        
        if (!feedbacks || feedbacks.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center">No feedback received yet.</td></tr>';
            totalFeedback.textContent = '0';
            avgRatingEl.textContent = '0.0';
            return;
        }

        // Stats
        totalFeedback.textContent = feedbacks.length;
        const sumRating = feedbacks.reduce((acc, curr) => acc + parseInt(curr.satisfaction), 0);
        avgRatingEl.textContent = (sumRating / feedbacks.length).toFixed(1);

        // Table Rows
        feedbacks.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div style="font-weight: 600">${item.student_name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-muted)">${item.email}</div>
                </td>
                <td>
                    <span class="rating-pill">⭐ ${item.satisfaction}</span>
                </td>
                <td>${item.favorite_topic}</td>
                <td style="font-style: italic; color: #475569">${item.comments || '-'}</td>
            `;
            tableBody.appendChild(row);
        });
    };

    refreshBtn.addEventListener('click', fetchData);

    // Initial load
    fetchData();
});
